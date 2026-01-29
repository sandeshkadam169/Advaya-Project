
$targetDir = "c:\Users\Admin\Desktop\sanduu\sandesh"
$searchStr = '<li><a href="extra-activities.html"><i class="fas fa-camera"></i> Extra Activities</a></li>'
$insertStr = '<li><a href="extra-activities.html"><i class="fas fa-camera"></i> Extra Activities</a></li>
                            <li><a href="activities-5years.html"><i class="fas fa-history"></i> Activities during 5 Year</a></li>'

$files = Get-ChildItem -Path $targetDir -Filter *.html

foreach ($file in $files) {
    if ($file.Name -eq "activities-5years.html") {
        continue
    }

    $content = Get-Content -Path $file.FullName -Raw -Encoding utf8
    
    # Normalizing line endings might be tricky, but assuming consistent formatting
    if ($content -match "Activities during 5 Year") {
        Write-Host "Skipping $($file.Name), already has the link."
        continue
    }

    if ($content.Contains($searchStr)) {
        $newContent = $content.Replace($searchStr, $insertStr)
        $newContent | Set-Content -Path $file.FullName -Encoding utf8
        Write-Host "Updated $($file.Name)"
    } else {
        Write-Host "Pattern not found in $($file.Name)"
        # Fallback for slight whitespace variations could be added here if needed
    }
}
