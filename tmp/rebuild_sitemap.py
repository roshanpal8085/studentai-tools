import re

# Routes from App.jsx (extracted manually for precision)
core_paths = [
    "/", "/ai-resume-generator", "/presentation-generator", "/chat-pdf", "/email-writer",
    "/instagram-caption-generator", "/free-pdf-tools", "/free-pdf-tool",
    "/tools/merge-pdf", "/tools/split-pdf", "/tools/pdf-watermark", "/tools/delete-pdf-pages",
    "/tools/compress-pdf", "/ai-homework-helper", "/ai-essay-writer", "/ai-study-planner",
    "/ai-notes-generator", "/ai-quiz-generator", "/ai-assignment-generator", "/ai-text-summarizer",
    "/about", "/privacy-policy", "/terms-conditions", "/disclaimer", "/contact",
    "/free-tools", "/tools/word-counter", "/tools/grammar-checker", "/tools/qr-generator",
    "/tools/password-generator", "/tools/age-calculator", "/tools/image-compressor",
    "/total-unit-converter", "/tools/percentage-calculator", "/tools/random-name-generator",
    "/tools/essay-topic-generator", "/tools/ai-prompt-generator", "/tools/exam-countdown",
    "/tools/study-timer", "/tools/image-to-pdf", "/tools/pdf-to-word",
    "/tools/random-question-generator", "/tools/homework-planner", "/tools/study-timetable-generator",
    "/tools/citation-generator", "/tools/gpa-calculator", "/tools/pdf-footer-editor",
    "/tools/internet-speed-test", "/tools/paraphrasing-tool", "/blog", "/free-games",
    "/snake-game", "/sudoku-game", "/tic-tac-toe", "/memory-card-game", "/typing-speed-test",
    "/math-quiz-game", "/logic-puzzle-game", "/stack-game", "/color-switch-game",
    "/word-puzzle-game", "/flappy-bird-game"
]

# Blog Slugs from blogData.js
blog_data_path = r'c:\Users\DELL\.gemini\antigravity\scratch\studentai-tools\frontend\src\data\blogData.js'
with open(blog_data_path, 'r', encoding='utf-8') as f:
    blog_content = f.read()

blog_slugs = re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", blog_content)
all_paths = core_paths + [f"/blog/{slug}" for slug in blog_slugs]

# Generate Sitemap XML
xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for path in all_paths:
    priority = "0.7"
    if path == "/": priority = "1.0"
    elif path in ["/ai-resume-generator", "/ai-homework-helper", "/ai-essay-writer", "/free-games"]: priority = "0.9"
    elif "/blog/" in path or path in ["/free-tools", "/free-pdf-tools", "/blog"]: priority = "0.8"
    
    # Special cases for speed test
    extra = ""
    if path == "/tools/internet-speed-test":
        extra = "<lastmod>2026-03-26</lastmod><changefreq>weekly</changefreq>"
        priority = "0.9"
    
    # Special case for games priority/freq
    game_list = ["/snake-game", "/sudoku-game", "/tic-tac-toe", "/memory-card-game", 
                 "/typing-speed-test", "/math-quiz-game", "/logic-puzzle-game", 
                 "/stack-game", "/color-switch-game", "/word-puzzle-game", "/flappy-bird-game"]
    if path in game_list:
        extra = "<changefreq>monthly</changefreq>"
        priority = "0.8"

    xml += f'  <url><loc>https://studentaitools.in{path}</loc>{extra}<priority>{priority}</priority></url>\n'

xml += '</urlset>'

# Compare with current sitemap.xml
sitemap_path = r'c:\Users\DELL\.gemini\antigravity\scratch\studentai-tools\frontend\public\sitemap.xml'
with open(sitemap_path, 'r', encoding='utf-8') as f:
    current_sitemap = f.read()

current_locs = set(re.findall(r'<loc>([^<]+)</loc>', current_sitemap))
full_locs = set([f"https://studentaitools.in{p}" for p in all_paths])

missing = full_locs - current_locs
if missing:
    print(f"MISSING FROM SITEMAP: {sorted(list(missing))}")
else:
    print("SITEMAP IS COMPLETE ACCORDING TO APP.JSX AND BLOGDATA.JS")

# Output the perfect XML to a file
with open(r'c:\Users\DELL\.gemini\antigravity\scratch\studentai-tools\tmp\perfect_sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(xml)
