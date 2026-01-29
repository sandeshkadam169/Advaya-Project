import os

target_dir = r"c:\Users\Admin\Desktop\sanduu\sandesh"
files = [f for f in os.listdir(target_dir) if f.endswith(".html")]

# The navigation block we want to replace
# We need to target the "Get Involved" LI item.
# It usually looks like this (based on getinvolved.html):
# <li class="dropdown"><a href="getinvolved.html" class="dropdown-toggle">Get Involved <i
#                 class="fas fa-chevron-down"></i></a>
#             <ul class="dropdown-menu">
#               <li><a href="getinvolved.html"><i class="fas fa-hands-helping"></i> Get Involved</a></li>
#               <li><a href="overall-info.html"><i class="fas fa-info-circle"></i> More</a></li>
#             </ul>
#           </li>

# I will try to match a large enough chunk to be unique but robust.
# Since spacing might vary, I'll use a regex or a simple find/replace if I'm confident about formatting.
# Given I'm in control, I'll try to match the exact string from getinvolved.html which seems to be the standard.

old_nav_chunk = '''<li class="dropdown"><a href="getinvolved.html" class="dropdown-toggle">Get Involved <i
                class="fas fa-chevron-down"></i></a>
            <ul class="dropdown-menu">
              <li><a href="getinvolved.html"><i class="fas fa-hands-helping"></i> Get Involved</a></li>
              <li><a href="overall-info.html"><i class="fas fa-info-circle"></i> More</a></li>
            </ul>
          </li>'''

new_nav_chunk = '''<li class="dropdown"><a href="getinvolved.html" class="dropdown-toggle">Get Involved <i
                class="fas fa-chevron-down"></i></a>
            <ul class="dropdown-menu">
              <li><a href="getinvolved.html"><i class="fas fa-hands-helping"></i> Get Involved</a></li>
              <li><a href="partners.html"><i class="fas fa-handshake"></i> Partners</a></li>
              <li><a href="overall-info.html"><i class="fas fa-info-circle"></i> More</a></li>
            </ul>
          </li>'''

count = 0
for filename in files:
    filepath = os.path.join(target_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple string replacement
    if old_nav_chunk in content:
        new_content = content.replace(old_nav_chunk, new_nav_chunk)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
        count += 1
    else:
        # Fallback: Try with different whitespace if direct match fails? 
        # Or look for a shorter unique substring.
        # Let's try to find just the inner UL and replace it if the outer LI matches vaguely?
        # Actually, let's just report skipped files.
        print(f"Skipped {filename} (Pattern not found)")
        # Debug: print what was found to see why it didn't match
        # start_idx = content.find('href="getinvolved.html" class="dropdown-toggle"')
        # if start_idx != -1:
        #     print(f"  Found near match at index {start_idx}")
        #     print(f"  Snippet: {content[start_idx:start_idx+300]}")

print(f"Total updated: {count}")
