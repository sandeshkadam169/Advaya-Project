$targetDir = "c:\Users\Admin\Desktop\sanduu\sandesh"
$files = Get-ChildItem -Path $targetDir -Filter "*.html"

# Regex pattern to match the 'Who We Are' dropdown list item content.
# It matches from <li class="dropdown"><a href="about.html"...Who We Are...<ul class="dropdown-menu"> 
# until the closing </ul></li> of the main dropdown.
$pattern = '(?s)(<li class=["'']dropdown["'']>\s*<a href=["'']about\.html["''] class=["'']dropdown-toggle["'']>\s*Who We Are\s*<i[^>]*></i></a>\s*<ul class=["'']dropdown-menu["'']>)(.*?)(</ul>\s*</li>)'

# The new flattened content
$newInner = '
                            <li><a href="about.html"><i class="fas fa-info-circle"></i> About Us</a></li>
                            <li><a href="about.html#vision-mission"><i class="fas fa-bullseye"></i> Vision & Mission</a></li>
                            <li><a href="journey.html"><i class="fas fa-road"></i> Journey</a></li>
                            <li><a href="research-presence.html"><i class="fas fa-search"></i> Research & Presence</a></li>
                            <li><a href="stories.html"><i class="fas fa-book-open"></i> Stories</a></li>
                            <li><a href="achievements.html"><i class="fas fa-trophy"></i> Achievements</a></li>
                            <li><a href="contact.html"><i class="fas fa-envelope"></i> Contact Us</a></li>'

$regex = [System.Text.RegularExpressions.Regex]::new($pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        
        if ($regex.IsMatch($content)) {
            # Check if already updated to avoid double-processing (optional, but regex replace is idempotent if pattern matches old only)
            # The old pattern contains "nested-dropdown", new one doesn't.
            if ($content -match "nested-dropdown") {
                $newContent = $regex.Replace($content, '${1}' + $newInner + '
                        ${3}')
                [System.IO.File]::WriteAllText($file.FullName, $newContent)
                Write-Host "Updated $($file.Name)"
            } else {
                 Write-Host "Already updated or nested not found in $($file.Name)"
            }
        } else {
            Write-Host "Pattern not found in $($file.Name)"
        }
    } catch {
        Write-Host "Error processing $($file.Name): $_"
    }
}
