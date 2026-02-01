$targetDir = "c:\Users\Admin\Desktop\sanduu\sandesh"
$files = Get-ChildItem -Path $targetDir -Filter "*.html"

# Regex pattern to match the Programs dropdown list item.
# (?s) enables Singleline mode (dot matches newline)
$pattern = '(?s)(<li class=["'']dropdown["'']>\s*<a href=["'']programs\.html["''] class=["'']dropdown-toggle["'']>\s*Programs\s*<i[^>]*></i></a>\s*<ul class=["'']dropdown-menu["'']>)(.*?)(</ul>\s*</li>)'

$newInner = '
                            <li><a href="programs.html"><i class="fas fa-tasks"></i> Our Programs</a></li>
                            <li><a href="extra-activities.html"><i class="fas fa-camera"></i> Extra Activities</a></li>
                            <li><a href="celebration.html"><i class="fas fa-glass-cheers"></i> Celebration</a></li>
                            <li><a href="activities-5years.html"><i class="fas fa-history"></i> Activities during 5 Year</a></li>'

$regex = [System.Text.RegularExpressions.Regex]::new($pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        
        if ($regex.IsMatch($content)) {
            $newContent = $regex.Replace($content, '${1}' + $newInner + '
                        ${3}') # Adjusting closing indentation slightly
            
            # Simple check to avoid rewriting same file if no meaningful change (though replace will always write if match found and technically replacing same with same?)
            # Actually if I run it again, it replaces the existing list with the same list, so it's fine.
            
            [System.IO.File]::WriteAllText($file.FullName, $newContent)
            Write-Host "Updated $($file.Name)"
        } else {
            Write-Host "Pattern not found in $($file.Name)"
        }
    } catch {
        Write-Host "Error processing $($file.Name): $_"
    }
}
