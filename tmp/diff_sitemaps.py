import re

old_path = r'c:\Users\DELL\.gemini\antigravity\scratch\studentai-tools\tmp\sitemap_old.xml'
new_path = r'c:\Users\DELL\.gemini\antigravity\scratch\studentai-tools\frontend\public\sitemap.xml'

def extract_locs(path):
    # Try different encodings
    for encoding in ['utf-8', 'utf-16', 'utf-16-le', 'utf-16-be']:
        try:
            with open(path, 'r', encoding=encoding) as f:
                content = f.read()
            return set(re.findall(r'<loc>([^<]+)</loc>', content))
        except:
            continue
    return set()

old_locs = extract_locs(old_path)
new_locs = extract_locs(new_path)

removed = old_locs - new_locs
added = new_locs - old_locs

if removed:
    print(f"REMOVED: {sorted(list(removed))}")
else:
    print("NO LOCS REMOVED.")

if added:
    print(f"ADDED: {sorted(list(added))}")
else:
    print("NO LOCS ADDED.")
