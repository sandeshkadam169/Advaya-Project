$targetDir = "c:\Users\Admin\Desktop\sanduu\sandesh"
$files = Get-ChildItem -Path $targetDir -Filter "*.html"

$oldNavChunk = '<li class="dropdown"><a href="getinvolved.html" class="dropdown-toggle">Get Involved <i
                class="fas fa-chevron-down"></i></a>
            <ul class="dropdown-menu">
              <li><a href="getinvolved.html"><i class="fas fa-hands-helping"></i> Get Involved</a></li>
              <li><a href="overall-info.html"><i class="fas fa-info-circle"></i> More</a></li>
            </ul>
          </li>'

$newNavChunk = '<li class="dropdown"><a href="getinvolved.html" class="dropdown-toggle">Get Involved <i
                class="fas fa-chevron-down"></i></a>
            <ul class="dropdown-menu">
              <li><a href="getinvolved.html"><i class="fas fa-hands-helping"></i> Get Involved</a></li>
              <li><a href="partners.html"><i class="fas fa-handshake"></i> Partners</a></li>
              <li><a href="overall-info.html"><i class="fas fa-info-circle"></i> More</a></li>
            </ul>
          </li>'

# Use [regex]::Escape to handle special characters if we were using regex replace, but here we can try simple string replacement using .Replace()
# However, newlines in the file might differ (CRLF vs LF).
# Let's read the file as a single string.

$count = 0
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    # Normalize line endings for the search chunk if needed, or just try to be flexible? 
    # The chunk above has specific newlines.
    
    # Let's try exact match first
    if ($content.Contains($oldNavChunk)) {
        $newContent = $content.Replace($oldNavChunk, $newNavChunk)
        [System.IO.File]::WriteAllText($file.FullName, $newContent)
        Write-Host "Updated $($file.Name)"
        $count++
    } else {
        # Fallback: Maybe mismatched whitespace?
        # Let's try to match blindly on a minimized version? No, riskier.
        # Let's just output skipped.
        Write-Host "Skipped $($file.Name) (Pattern not found)"
    }
}

Write-Host "Total updated: $count"
