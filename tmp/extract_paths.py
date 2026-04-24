import re

app_path = r'c:\Users\DELL\.gemini\antigravity\scratch\studentai-tools\frontend\src\App.jsx'
with open(app_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Match standard routes like <Route path="/something" ...
paths = re.findall(r'path=["\'](/[^"\']*)["\']', content)

# Filter out '*' and redirects if we want, but let's see all
paths = sorted(list(set(paths)))
for p in paths:
    print(p)
