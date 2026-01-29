
import os

target_dir = r"c:\Users\Admin\Desktop\sanduu\sandesh"
files = [f for f in os.listdir(target_dir) if f.endswith(".html")]

# Using a flexible regex or just string replacement if format is consistent.
# The previous `update_navbar.py` showed that `programs.html` had a specific structure.
# I need to insert the new list item into the dropdown menu for Programs.

# Pattern to search for:
# The dropdown usually ends with:
# <li><a href="extra-activities.html"><i class="fas fa-camera"></i> Extra Activities</a></li>
#                     </ul>

search_str = '<li><a href="extra-activities.html"><i class="fas fa-camera"></i> Extra Activities</a></li>'
insert_str = '\n                            <li><a href="activities-5years.html"><i class="fas fa-history"></i> Activities during 5 Year</a></li>'

count = 0
for filename in files:
    if filename == "activities-5years.html":
        continue # Already has it

    filepath = os.path.join(target_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already added to avoid duplication
    if "activities-5years.html" in content:
        print(f"Skipping {filename}, already has the link.")
        continue

    if search_str in content:
        # Insert after the search string
        new_content = content.replace(search_str, search_str + insert_str)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
        count += 1
    else:
        # Fallback: maybe the indentation is different or it's single line
        # Try to find just the closing </ul> of the programs dropdown? prefer specific context
        print(f"Pattern not found in {filename}")

print(f"Total files updated: {count}")
