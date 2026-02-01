$targetDir = "c:\Users\Admin\Desktop\sanduu\sandesh"
$files = Get-ChildItem -Path $targetDir -Filter "*.html"

# Regex pattern to match the entire 'Who We Are' dropdown and replace it with the clean, original nested structure.
# This pattern matches from <li class="dropdown">...Who We Are... down to the closing </li> of that dropdown.
# It attempts to swallow the entire messed up block including the duplicate items.
# We match: <li class="dropdown"><a href="about.html"...Who We Are... </li> (lazy match until the matching closing li?)
# Regex for matching balanced tags is hard, but we can match until "Programs" dropdown starts?
# Or just match specific mess pattern.
# The mess seems to be: 
# <ul class="dropdown-menu"> [Flattened Items] </ul> </li> [Trailing Items] </ul> </li>
# Actually, let's target the inner <ul class="dropdown-menu"> ... </ul> content of "Who We Are".

$pattern = '(?s)(<li class=["'']dropdown["'']>\s*<a href=["'']about\.html["''] class=["'']dropdown-toggle["'']>\s*Who We Are\s*<i[^>]*></i></a>\s*<ul class=["'']dropdown-menu["'']>)(.*?)(</ul>\s*</li>)'

# The clean original nested content
$restoreContent = '
              <li class="nested-dropdown"><a href="about.html"><i class="fas fa-info-circle"></i> About Us <i class="fas fa-chevron-right"></i></a>
                <ul class="nested-menu">
                  <li><a href="about.html#vision-mission">Vision & Mission</a></li>
                  <li><a href="journey.html">Journey</a></li>
                  <li><a href="research-presence.html">Research & Presence</a></li>
                </ul>
              </li>
              <li><a href="stories.html"><i class="fas fa-book-open"></i> Stories</a></li>
              <li><a href="achievements.html"><i class="fas fa-trophy"></i> Achievements</a></li>
              <li><a href="contact.html"><i class="fas fa-envelope"></i> Contact Us</a></li>'

$regex = [System.Text.RegularExpressions.Regex]::new($pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        
        # We need to be careful. The previous script might have left multiple </ul> closing tags or messed up structure.
        # Let's try to match the *opening* of the dropdown and strictly replace everything until the *start* of the Programs dropdown.
        # Programs dropdown starts with: <li class="dropdown"><a href="programs.html"
        
        $broadPattern = '(?s)(<li class=["'']dropdown["'']>\s*<a href=["'']about\.html["''] class=["'']dropdown-toggle["'']>\s*Who We Are\s*<i[^>]*></i></a>\s*<ul class=["'']dropdown-menu["'']>).*?(</li>\s*</ul>\s*</li>)'
        # The previous mess had extra </ul></li>. 
        
        # Let's try a safer approach: Replace the entire block between "Home" LI end and "Programs" LI start.
        $homeEnd = '<li><a href="index.html">Home</a></li>'
        $programsStart = '<li class="dropdown"><a href="programs.html" class="dropdown-toggle">Programs'
        
        $fullBlockPattern = '(?s)(' + [regex]::Escape($homeEnd) + ').*?(' + [regex]::Escape($programsStart) + ')'
        
        # Reconstruct the "Who We Are" block entirely
        $fullReplacement = '${1}' + "
          <li class=""dropdown""><a href=""about.html"" class=""dropdown-toggle"">Who We Are <i class=""fas fa-chevron-down""></i></a>
            <ul class=""dropdown-menu"">
" + $restoreContent + "
            </ul>
          </li>
          " + '${2}'

        $fullRegex = [System.Text.RegularExpressions.Regex]::new($fullBlockPattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        
        if ($fullRegex.IsMatch($content)) {
            $newContent = $fullRegex.Replace($content, $fullReplacement)
            [System.IO.File]::WriteAllText($file.FullName, $newContent)
            Write-Host "Restored $($file.Name)"
        } else {
            Write-Host "Pattern not found in $($file.Name)"
        }
    } catch {
        Write-Host "Error processing $($file.Name): $_"
    }
}
