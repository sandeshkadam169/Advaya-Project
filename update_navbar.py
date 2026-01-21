import os

target_dir = r"c:\Users\Admin\Desktop\sanduu\sandesh"
files = [f for f in os.listdir(target_dir) if f.endswith(".html") and f != "extra-activities.html"]

old_nav = '<li><a href="programs.html">Programs</a></li>'
new_nav = '''<li class="dropdown"><a href="programs.html" class="dropdown-toggle">Programs <i
                            class="fas fa-chevron-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="programs.html"><i class="fas fa-tasks"></i> Our Programs</a></li>
                        <li><a href="extra-activities.html"><i class="fas fa-camera"></i> Extra Activities</a></li>
                    </ul>
                </li>'''

# Normalized version for safer replacement (removing extra whitespace/newlines if needed, but let's try exact string match first or naive replace)
# Since existing files might have variations in spaces, it's safer to be flexible.
# However, usually the codebase is consistent. Let's try to match the exact line from programs.html content I saw earlier:
# line 47: <li><a href="programs.html">Programs</a></li>

count = 0
for filename in files:
    filepath = os.path.join(target_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old_nav in content:
        new_content = content.replace(old_nav, new_nav)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
        count += 1
    else:
        print(f"Skipped {filename} (Pattern not found)")

print(f"Total updated: {count}")
