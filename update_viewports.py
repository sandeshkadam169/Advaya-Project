import os
import glob
import re

def update_viewports():
    # Target directory (current directory)
    root_dir = os.getcwd()
    
    # New viewport tag
    new_viewport = '<meta name="viewport" content="width=1280">'
    
    # Regex to find existing viewport tags
    # This handles various formats like width=device-width, initial-scale=1.0, etc.
    viewport_pattern = re.compile(r'<meta\s+name=["\']viewport["\']\s+content=["\'][^"\']+["\']\s*>', re.IGNORECASE)
    
    print(f"Scanning {root_dir} for HTML files...")
    
    count = 0
    for file_path in glob.glob(os.path.join(root_dir, "*.html")):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if file has a viewport tag
            if viewport_pattern.search(content):
                # Replace it
                new_content = viewport_pattern.sub(new_viewport, content)
                
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {os.path.basename(file_path)}")
                    count += 1
                else:
                    print(f"Skipped (already up to date): {os.path.basename(file_path)}")
            else:
                # If no viewport tag exists, we might want to add it? 
                # For now, let's just log it. Usually standard compliance requires it in <head>.
                # We will check if <head> exists and insert it if missing.
                if "<head>" in content:
                    new_content = content.replace("<head>", f"<head>\n    {new_viewport}")
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated (Added new): {os.path.basename(file_path)}")
                    count += 1
                else:
                    print(f"Skipped (No <head> tag): {os.path.basename(file_path)}")
                    
        except Exception as e:
            print(f"Error processing {os.path.basename(file_path)}: {e}")

    print(f"Finished. Total files updated: {count}")

if __name__ == "__main__":
    update_viewports()
