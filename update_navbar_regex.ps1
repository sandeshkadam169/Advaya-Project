$targetDir = "c:\Users\Admin\Desktop\sanduu\sandesh"
$files = Get-ChildItem -Path $targetDir -Filter "*.html"

# Regex pattern to match the specific "Get Involved" dropdown block
# \s* matches any whitespace (spaces, tabs, newlines)
$pattern = '(?s)<li class="dropdown">\s*<a href="getinvolved\.html" class="dropdown-toggle">Get Involved\s*<i\s+class="fas fa-chevron-down"></i></a>\s*<ul class="dropdown-menu">\s*<li><a href="getinvolved\.html"><i class="fas fa-hands-helping"></i> Get Involved</a></li>\s*<li><a href="overall-info\.html"><i class="fas fa-info-circle"></i> More</a></li>\s*</ul>\s*</li>'

$newContentBlock = '<li class="dropdown"><a href="getinvolved.html" class="dropdown-toggle">Get Involved <i
                class="fas fa-chevron-down"></i></a>
            <ul class="dropdown-menu">
              <li><a href="getinvolved.html"><i class="fas fa-hands-helping"></i> Get Involved</a></li>
              <li><a href="partners.html"><i class="fas fa-handshake"></i> Partners</a></li>
              <li><a href="overall-info.html"><i class="fas fa-info-circle"></i> More</a></li>
            </ul>
          </li>'

$count = 0
foreach ($file in $files) {
    if ($file.Name -eq "partners.html") { continue } # fast skip
    
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    # Check if already updated (contains partners.html link in that area?)
    if ($content -match 'href="partners\.html"') {
        Write-Host "Skipped $($file.Name) (Already updated)"
        continue
    }

    # Perform regex replacement
    if ($content -match $pattern) {
        $newContent = $content -replace $pattern, $newContentBlock
        [System.IO.File]::WriteAllText($file.FullName, $newContent)
        Write-Host "Updated $($file.Name)"
        $count++
    } else {
        Write-Host "Skipped $($file.Name) (Pattern not found)"
    }
}

Write-Host "Total updated: $count"
