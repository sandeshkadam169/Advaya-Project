import os
import re

target_dir = r"c:\Users\Admin\Desktop\sanduu\sandesh"
files = [f for f in os.listdir(target_dir) if f.endswith(".html")]

# Pattern matches the start of the Programs dropdown to the end of its list
pattern = re.compile(
    r'(<li class=["\']dropdown["\']>\s*<a href=["\']programs\.html["\'] class=["\']dropdown-toggle["\']>Programs\s*<i\s*class=["\']fas fa-chevron-down["\']></i></a>\s*<ul class=["\']dropdown-menu["\']>)(.*?)(</ul>\s*</li>)',
    re.DOTALL | re.IGNORECASE
)

# New content to be inserted. I'll use a generic indentation, it might not perfect match every file but will work.
new_list_items = '''
              <li><a href="programs.html"><i class="fas fa-tasks"></i> Our Programs</a></li>
              <li><a href="extra-activities.html"><i class="fas fa-camera"></i> Extra Activities</a></li>
              <li><a href="celebration.html"><i class="fas fa-glass-cheers"></i> Celebration</a></li>
              <li><a href="activities-5years.html"><i class="fas fa-history"></i> Activities during 5 Year</a></li>'''

count = 0
for filename in files:
    filepath = os.path.join(target_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if pattern.search(content):
        # Substitute the inner content (group 2) with new_list_items
        # We reconstruct the string using group 1 (start) + new items + group 3 (end)
        # We need to handle the closing tag indentation carefully.
        # But honestly, HTML doesn't care about whitespace.
        
        new_content = pattern.sub(r'\1' + new_list_items + r'\n            \3', content)
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
            count += 1
        else:
            print(f"No change needed for {filename} (Already up to date?)")
    else:
        print(f"Pattern not found in {filename}")

print(f"Total updated: {count}")
