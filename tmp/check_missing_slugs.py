import re

blog_data_path = r'c:\Users\DELL\.gemini\antigravity\scratch\studentai-tools\frontend\src\data\blogData.js'
sitemap_path = r'c:\Users\DELL\.gemini\antigravity\scratch\studentai-tools\frontend\public\sitemap.xml'

with open(blog_data_path, 'r', encoding='utf-8') as f:
    blog_content = f.read()

slugs = re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", blog_content)
print(f"Total slugs in blogData.js: {len(slugs)}")

with open(sitemap_path, 'r', encoding='utf-8') as f:
    sitemap_content = f.read()

missing_slugs = []
for slug in slugs:
    if f"/blog/{slug}" not in sitemap_content:
        missing_slugs.append(slug)

print(f"Missing slugs in sitemap: {missing_slugs}")
