$files = Get-ChildItem -Path "c:\Users\Admin\Desktop\sanduu\sandesh" -Filter "*.html"
$old = '<li><a href="programs.html">Programs</a></li>'
$new = '<li class="dropdown"><a href="programs.html" class="dropdown-toggle">Programs <i class="fas fa-chevron-down"></i></a><ul class="dropdown-menu"><li><a href="programs.html"><i class="fas fa-tasks"></i> Our Programs</a></li><li><a href="extra-activities.html"><i class="fas fa-camera"></i> Extra Activities</a></li></ul></li>'

foreach ($file in $files) {
    if ($file.Name -ne "extra-activities.html") {
        $content = Get-Content $file.FullName -Raw
        if ($content -like "*$old*") {
            $content = $content.Replace($old, $new)
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Output "Updated $($file.Name)"
        }
    }
}
