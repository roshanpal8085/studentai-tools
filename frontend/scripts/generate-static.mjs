/**
 * generate-static.mjs
 * 
 * Post-build script: Generates static HTML files for each blog post and key page.
 * This injects real, readable content into the HTML that crawlers (including AdSense)
 * can read WITHOUT executing JavaScript.
 * 
 * Run: node scripts/generate-static.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const BASE_URL = 'https://studentaitools.in';

// Read the base index.html template from dist
const baseHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');

// ── Helper: strip markdown syntax to plain text ──────────────────────────────
function stripMarkdown(md) {
  return md
    .replace(/#{1,6}\s+/g, '')         // headings
    .replace(/\*\*(.+?)\*\*/g, '$1')   // bold
    .replace(/\*(.+?)\*/g, '$1')       // italic
    .replace(/`(.+?)`/g, '$1')         // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/^>\s+/gm, '')            // blockquotes
    .replace(/^[-*+]\s+/gm, '')        // bullets
    .replace(/^\d+\.\s+/gm, '')        // numbered lists
    .replace(/\n{3,}/g, '\n\n')        // extra newlines
    .trim();
}

// ── Helper: escape HTML entities ─────────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Helper: inject SEO + content into base HTML ───────────────────────────────
function buildHtml({ title, description, canonical, content, ogImage = '' }) {
  const plainContent = stripMarkdown(content);
  // First 160 chars for meta description if not provided
  const metaDesc = description || plainContent.slice(0, 160).replace(/\n/g, ' ');
  const fullCanonical = `${BASE_URL}${canonical}`;

  // Build noscript content block — this is what crawlers without JS see
  // We convert the markdown plain text into readable paragraphs
  const paragraphs = plainContent
    .split('\n\n')
    .filter(p => p.trim().length > 20)
    .slice(0, 40) // limit to avoid huge files
    .map(p => `<p>${esc(p.trim())}</p>`)
    .join('\n    ');

  const noscriptBlock = `<noscript>
  <div style="max-width:900px;margin:40px auto;padding:20px;font-family:sans-serif;line-height:1.7;color:#1e293b">
    <h1>${esc(title)}</h1>
    <p><em>${esc(metaDesc)}</em></p>
    <hr/>
    ${paragraphs}
  </div>
</noscript>`;

  // Replace / inject into the base HTML
  return baseHtml
    // Title
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    // Meta description — replace existing or add
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${esc(metaDesc.slice(0, 300))}$2`
    )
    // Canonical — replace existing or add before </head>
    .replace(
      /<link\s+rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${esc(fullCanonical)}" />`
    )
    // Add og:title, og:description, og:image before </head>
    .replace(
      '</head>',
      `  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(metaDesc.slice(0, 300))}" />
  <meta property="og:url" content="${esc(fullCanonical)}" />
  ${ogImage ? `<meta property="og:image" content="${esc(ogImage)}" />` : ''}
  <meta name="robots" content="index, follow" />
</head>`
    )
    // Inject noscript content BEFORE the root div
    .replace(
      '<div id="root">',
      `${noscriptBlock}\n<div id="root">`
    );
}

// ── Helper: write file, creating parent dirs as needed ────────────────────────
function writeRoute(route, html) {
  const routePath = route === '/' ? '' : route;
  const dir = join(DIST, routePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const filePath = join(dir, 'index.html');
  writeFileSync(filePath, html, 'utf-8');
  console.log(`  ✅ ${route}`);
}

// ── Load blog data ────────────────────────────────────────────────────────────
console.log('\n📄 Reading blogData.js...');
const blogDataRaw = readFileSync(
  join(__dirname, '..', 'src', 'data', 'blogData.js'),
  'utf-8'
);

const posts = [];
const postRegex = /\{\s*id:\s*(\d+),\s*title:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*readTime:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*image:\s*"([^"]+)",\s*content:\s*`([\s\S]*?)`\s*\}/g;

let match;
while ((match = postRegex.exec(blogDataRaw)) !== null) {
  posts.push({
    id: parseInt(match[1]),
    title: match[2],
    slug: match[3],
    excerpt: match[4],
    date: match[5],
    readTime: match[6],
    category: match[7],
    image: match[8],
    content: match[9],
  });
}

console.log(`  Found ${posts.length} blog posts`);

console.log('\n🔨 Generating static HTML files...\n');

// 1. Home page
writeRoute('/', buildHtml({
  title: 'Your AI Study Assistant — Free AI Tools for Students | StudentAI Tools',
  description: 'StudentAI Tools is a focused AI Study Assistant for students. Generate notes, create quizzes, plan your study schedule, and chat with your textbooks — all free, no sign-up.',
  canonical: '/',
  content: `StudentAI Tools gives every student access to free, powerful AI study tools.

Our core tools include:

AI Notes Generator — Convert raw lecture notes, textbook chapters, or any study material into structured, exam-ready notes in seconds.

AI Quiz Generator — Transform your study material into MCQs, true/false, and short-answer questions using active recall, the most effective study technique known to science.

AI Study Planner — Input your exam dates and current confidence levels, and get a personalised week-by-week study schedule that prioritises your weakest subjects.

Chat with PDF — Upload any textbook, research paper, or document and ask it direct questions. Get cited answers instantly without reading 300 pages.

AI Homework Helper — Get step-by-step explanations for any subject at any academic level. Available 24/7, completely free.

AI Essay Writer — Structure your arguments, generate outlines, and write better essays with AI assistance.

AI Resume Builder — Create ATS-optimised resumes that get noticed by recruiters.

All tools are 100% free. No registration required. Works on mobile. Used by students from India and 180+ countries worldwide. We believe that premium educational tools shouldn't be locked behind a paywall, which is why we offer all of this ad-supported, giving free and unlimited access to the resources you need to succeed in your academic journey.`,
}));

// 2. Blog index
const blogExcerpts = posts.slice(0, 10).map(p => `${p.title}: ${p.excerpt}`).join('\n\n');
writeRoute('/blog', buildHtml({
  title: 'StudentAI Blog — Study Guides, AI Tips & Academic Advice',
  description: 'Explore 25+ in-depth articles on AI study tools, exam prep strategies, essay writing, and academic productivity. Written for students, by educators who understand the struggle.',
  canonical: '/blog',
  content: `StudentAI Study Blog\n\nIn-depth guides on AI study strategies, exam preparation, and academic writing — designed to help you study smarter, not harder. Our blog features a wide array of topics curated specifically to help students navigate the evolving landscape of education and technology. From mastering the Joint Entrance Examination (JEE) to tackling UPSC preparations, our comprehensive guides provide actionable advice. Learn how to leverage AI tools ethically, improve your memory retention, and drastically reduce the time spent on mundane tasks like formatting notes or building study schedules. \n\n${blogExcerpts}`,
}));

// 3. Individual blog posts
for (const post of posts) {
  writeRoute(`/blog/${post.slug}`, buildHtml({
    title: post.title,
    description: post.excerpt,
    canonical: `/blog/${post.slug}`,
    content: post.content,
    ogImage: post.image,
  }));
}

// 4. Expanded Tool pages
const toolPages = [
  {
    route: '/ai-notes-generator',
    title: 'Free AI Notes Generator — Instant Study Notes from Any Text (2026)',
    description: 'Convert raw lecture notes, textbook chapters, or any topic into structured, exam-ready study notes in seconds. Free, no signup required.',
    content: `The AI Notes Generator converts any raw text, topic, or study material into structured, exam-ready notes. Paste your lecture content and get formatted notes with headings, bullet points, and key definitions automatically highlighted. Used by students for university exams, JEE preparation, UPSC revision, and school assignments. Free, no account required, works on mobile.

How It Works:
Instead of spending hours manually copying text from a textbook, simply input the core concepts or paste a transcript of your professor's lecture. Our AI engine reads the material, comprehends the context, and extracts the most vital pieces of information. It automatically restructures the text into a hierarchy of Main Topics, Sub-topics, Key Definitions, and Summary points. This method is heavily inspired by the Cornell Note-Taking system and active recall frameworks.

Features:
- Instant Summarization: Reduces thousands of words down to the absolute essentials.
- Bullet Point Formatting: Makes content easily scannable for quick revision before a test.
- Concept Highlighting: Automatically bolds crucial vocabulary terms, dates, and formulas.
- Free to Use: We do not charge students for access, and there are no usage limits that disrupt your study flow.

Why Use an AI Notes Generator?
Research shows that students spend roughly 60% of their study time just preparing their study materials, and only 40% actually studying them. By using AI to automate the creation of study guides, you flip that ratio. You get to spend more time absorbing the material and testing yourself. This is incredibly useful for law students dealing with massive case files, medical students memorizing anatomy, or engineering students distilling complex physics theories into actionable formulas. 

Frequently Asked Questions:
Q: Can I paste a whole textbook chapter?
A: Yes, you can paste large blocks of text. The AI will chunk it and process it into a cohesive summary.
Q: Does this replace reading the book?
A: No. This tool is meant to act as a study aid for revision. It works best when you already have a foundational understanding of the material.
Q: Is it really free?
A: Yes, StudentAI Tools is completely free and ad-supported.`,
  },
  {
    route: '/ai-quiz-generator',
    title: 'Free AI Quiz Generator — Turn Notes into Practice Tests Instantly',
    description: 'Transform your study notes into MCQs, true/false, and short-answer practice questions using active recall — the most effective study technique. Free.',
    content: `The AI Quiz Generator transforms your study material into interactive practice tests. Paste your notes, select question type (Multiple Choice, True/False, Short Answer) and difficulty level, and get a custom quiz in seconds. Active recall through testing is proven to improve retention by 50% compared to re-reading. Used by students for JEE, NEET, UPSC, GATE, university exams, and school tests.

The Science of Active Recall:
Cognitive science has repeatedly proven that re-reading textbook chapters is an inefficient way to study. The "Testing Effect" demonstrates that the act of retrieving information from your brain (by answering a question) significantly strengthens the neural pathways associated with that memory. Our AI Quiz Generator allows you to instantly apply active recall to any subject without having to manually write flashcards.

Features:
- Multiple Question Types: Generate Multiple Choice Questions (MCQs), True/False statements, and Short Answer questions.
- Adjustable Difficulty: Choose between Beginner, Intermediate, and Advanced difficulty levels depending on your preparation stage.
- Instant Feedback: The AI provides the correct answers alongside detailed explanations for *why* the answer is correct.
- High School to Postgraduate: Capable of generating quizzes for basic biology up to advanced organic chemistry or constitutional law.

How to Use the Quiz Generator:
1. Paste your study notes, a Wikipedia article, or a transcript of a lecture into the input box.
2. Select the type of questions you want. (We recommend MCQs for quick revision and Short Answers for deep understanding).
3. Specify the number of questions.
4. The AI will analyze the text, extract the core facts, and build a test. Take the test without looking at your notes!

Frequently Asked Questions:
Q: Will the AI ever generate a wrong answer?
A: While our AI uses the context provided in your notes to ensure maximum accuracy, it's always good practice to double-check surprising answers against your textbook.
Q: Can I use this to prepare for competitive exams like the JEE or UPSC?
A: Absolutely. Active recall is the cornerstone of competitive exam preparation. Use this tool to test yourself on daily current affairs or complex engineering formulas.`,
  },
  {
    route: '/ai-study-planner',
    title: 'Free AI Study Planner — Personalised Exam Schedule Generator',
    description: 'Input your exam dates and confidence levels, get a personalised study schedule that prioritises your weakest subjects. Free AI-powered planning.',
    content: `The AI Study Planner creates personalised, adaptive study schedules based on your exam dates, subjects, and current knowledge levels. Unlike static paper planners, it allocates more time to your weakest subjects and adjusts when your schedule changes. Ideal for students with multiple exams, those preparing for JEE, UPSC, GATE, CAT, or any competitive exam.

Why Static Planners Fail:
Most students write down a study schedule on a piece of paper, allocating exactly 2 hours to every subject. This is inefficient. If you are terrible at Calculus but excellent at History, you should spend 3 hours on Calculus and 1 hour on History. Furthermore, if you miss a day due to illness, a paper schedule is ruined. Our AI Study Planner dynamically generates schedules based on priority, time available, and your self-reported confidence levels.

Features of the AI Study Planner:
- Weakness Prioritization: Automatically weights the schedule heavily toward subjects where you need the most help.
- Spaced Repetition Integration: Suggests review sessions at optimal intervals to prevent the forgetting curve.
- Custom Time Blocks: Tells the AI how many hours you can study per day, and it will break those hours into manageable Pomodoro sessions.
- Multi-Exam Support: Input multiple exam dates, and the AI will backward-plan your study trajectory so you don't cram at the last minute.

How It Works:
You simply tell the AI your exam dates, the subjects you need to cover, and rank your confidence in each subject from 1 to 10. You also input your available study hours. The AI then acts like a professional academic coach, distributing the syllabus across your available days, leaving buffer days for emergencies and review.

Frequently Asked Questions:
Q: What if I miss a day of studying?
A: You can simply regenerate the schedule with your new remaining time frame.
Q: Is this useful for university finals?
A: Yes. When managing 4 or 5 completely different classes during finals week, an optimized schedule is the difference between passing and failing.`,
  },
  {
    route: '/ai-homework-helper',
    title: 'Free AI Homework Helper — Step-by-Step Solutions for Any Subject',
    description: 'Stuck on homework? Get instant, step-by-step AI explanations for Maths, Science, History, Literature & more. Free, no signup. Used by 2M+ students.',
    content: `The AI Homework Helper provides step-by-step explanations for any academic subject at any level. From basic algebra to advanced calculus, organic chemistry to literary analysis — get clear, educational explanations that teach you the reasoning, not just the answer. Available 24/7, completely free, no registration required. Supports Physics, Chemistry, Biology, Mathematics, History, Literature, Economics, Computer Science.

Beyond Simple Answers:
We don't just give you the final answer. We show you the logic behind it so you can learn for the exams. The goal of this tool is to act as a 24/7 personalized tutor, not a cheat code. When you encounter a math problem you can't solve, our AI will break down the algebraic properties used in each step. When you struggle with a literature theme, our AI will explain the historical context and provide textual evidence.

Features:
- Step-by-Step Methodology: Every solution is broken down into easily digestible parts.
- Multi-Disciplinary Support: From the laws of thermodynamics to complex calculus or economic theories, our AI covers it all.
- Conceptual Clarity: Our explanations are tailored to your specific academic level, ensuring the language is perfectly understandable whether you are in High School or Post-Grad.

How to Use AI Tutors (Without Cheating):
The line between using a tool for learning and using it to bypass learning is thin. Top students use AI ethically to actually boost their exam grades.
- The Wrong Way: Copy-pasting the AI's exact final answer onto your homework sheet without reading the steps. You will fail the proctored exam because you didn't build the neural pathways required for problem-solving.
- The Right Way: Asking the AI to "explain the concept" behind a problem you are stuck on. Typing your own attempt at a math problem and asking the AI: "Where did I make a mistake in my logic?"

Frequently Asked Questions:
Q: Is this AI Homework Helper free?
A: Yes! StudentAI is 100% free for all students. No registration or credit cards are required.
Q: How accurate are the math solutions?
A: Our AI utilizes advanced symbolic reasoning to handle math, science, and technical subjects with extremely high accuracy. However, always double-check complex proofs.
Q: Is it considered cheating to use this?
A: Using AI to understand a concept you are stuck on is tutoring. Submitting the AI's generated answer as your own work without understanding it is plagiarism. Use it to learn, not to copy.`,
  },
  {
    route: '/ai-essay-writer',
    title: 'Free AI Essay Writer — Generate Structured Academic Essays Instantly',
    description: 'Generate structured, academic essay drafts with clear thesis, arguments, and conclusion. Use as a writing framework, not a replacement for your own thinking.',
    content: `The AI Essay Writer helps students overcome writer's block by generating structured essay outlines and drafts. Input your topic, requirements, and word count, and get a well-organised draft with clear thesis, topic sentences, supporting arguments, and conclusion. Use it as a structural scaffold for your own writing. Supports persuasive essays, analytical essays, compare-contrast, research papers, and more.

Overcoming the Blank Page Syndrome:
The hardest part of writing an essay is starting. Staring at a blank document can cause severe anxiety. Our AI Essay Writer acts as a structural scaffold. It provides you with a cohesive outline, a strong thesis statement, and logical paragraph transitions. You can then take this structure, inject your own original research, refine the arguments, and rewrite it in your own voice. 

Features:
- Academic Formatting: Generates essays with proper introductions, body paragraphs, and conclusions.
- Argumentative Structure: Ensures that claims are backed by logical reasoning or suggested evidence points.
- Customizable Tone: Specify if you want the essay to sound objective, persuasive, analytical, or descriptive.
- Outline Generation: If you don't want a full draft, you can ask the AI to just generate a bulleted outline for you to follow.

Ethical Usage in Academics:
We strictly advise against submitting AI-generated text directly to your professors. Universities employ advanced AI detection tools, and passing off machine-generated text as your own is a violation of academic integrity. Instead, use this tool to brainstorm ideas, overcome writer's block, and understand how a well-structured essay should flow. Use it as a writing partner, not a ghostwriter.

Frequently Asked Questions:
Q: Can professors detect if I use this tool?
A: If you copy and paste the output directly, yes. AI detectors look for specific predictable language patterns (perplexity and burstiness). You must use the generated text only as an outline or inspiration, and write the final essay in your own unique voice.
Q: Does the AI include citations?
A: The AI can generate placeholder citations or suggest where a citation is needed, but it cannot conduct live academic database research. You must verify and insert your own factual citations.`,
  },
  {
    route: '/ai-resume-generator',
    title: 'Free AI Resume Builder — ATS-Optimised Resumes for Students',
    description: 'Create professional, ATS-friendly resumes that get past automated screening. Turn your student experience into compelling achievement statements. Free.',
    content: `The AI Resume Builder transforms your raw student experiences into ATS-optimised resumes that get noticed by recruiters. Input your education, projects, internships, and activities — the AI generates professional achievement-focused bullet points that highlight real impact. Optimises for Applicant Tracking Systems (ATS) by incorporating relevant keywords from job descriptions.

Getting Past the ATS Robots:
Over 75% of resumes are rejected by Applicant Tracking Systems (ATS) before a human ever sees them. This happens because the resumes lack the correct keywords, use unreadable formatting, or frame responsibilities poorly. As a student or recent graduate, your resume needs to frame your academic projects, club leadership, and coursework as professional, impactful achievements. Our AI analyzes your input and rewrites it using strong action verbs and quantifiable metrics.

Features:
- Action Verb Optimization: Replaces weak phrases like "helped with" with strong verbs like "Orchestrated", "Developed", or "Streamlined".
- Metric Integration: Encourages you to add numbers to your achievements (e.g., "Led a team of 5", "Increased engagement by 20%").
- Industry-Specific Tailoring: Paste a job description alongside your experience, and the AI will align your bullet points to match the job's required skills.
- Clean Formatting: Generates clean, standard text that can easily be copied into a standard ATS-friendly Word document template.

Why Students Need This:
Many students feel they lack "real experience." But leading a university society event, managing a complex engineering capstone project, or conducting extensive laboratory research absolutely counts as experience if framed correctly. The AI Resume Builder helps bridge the gap between academic life and corporate expectations.

Frequently Asked Questions:
Q: Will this guarantee me a job?
A: No tool can guarantee a job, but this will significantly increase your chances of getting an interview by ensuring your resume actually passes the automated screening software.
Q: Should I include high school achievements?
A: Once you are in your second year of college, generally no, unless it was a massive national award. The AI helps you focus on your most recent, relevant college experiences.`,
  },
  {
    route: '/free-tools',
    title: '12 Premium AI Study Tools for Students — Free & Practical Guide',
    description: 'Discover the ultimate 12 premium free AI tools for students. Structured by study workflow: notes, quizzes, planning, and writing — each with real use cases and tips.',
    content: `A comprehensive guide to the 12 most powerful free AI study tools on StudentAI, organised by how you actually study. Each tool is explained with a real student scenario, so you know exactly when and how to use it. Tools include: AI Notes Generator, AI Quiz Generator, AI Study Planner, Chat with PDF, AI Homework Helper, AI Text Summarizer, AI Essay Writer, Assignment Generator, Presentation Builder, AI Resume Builder, Paraphrasing Tool, Grammar Checker, and PDF Tools.

The Ultimate Student Workflow:
Modern education requires a modern workflow. You can no longer rely on purely analog methods if you want to compete at the highest levels of academia, whether that's getting into a top university, scoring high on the JEE/UPSC, or securing a prestigious internship. We have built a suite of tools that follow the exact lifecycle of a student's semester.

1. The Learning Phase: Use the AI Notes Generator and Chat with PDF to rapidly digest complex textbooks and long lectures.
2. The Revision Phase: Use the AI Quiz Generator and AI Study Planner to apply active recall and spaced repetition to your study schedule.
3. The Execution Phase: Use the AI Homework Helper, Grammar Checker, and Paraphrasing Tool to polish your assignments and clarify confusing problems.
4. The Professional Phase: Use the AI Resume Builder to transition from academia into the professional workforce seamlessly.

Why We Built This:
These 12 tools represent the core necessities of student life. Previously, accessing AI of this caliber required expensive monthly subscriptions to various disparate platforms. We consolidated them into one centralized hub, completely free, specifically engineered with the student experience in mind. 

Explore the Tools:
Navigate through our platform to find the specific tool you need. Whether you are struggling to summarize a 50-page historical document, need to rephrase an awkward paragraph in your essay, or need to merge two PDFs together for an assignment submission, StudentAI Tools has you covered.`,
  },
  {
    route: '/about',
    title: 'About Us — StudentAI Tools | Our Mission, Team & Story',
    description: 'Learn about the team behind StudentAI Tools — a curated platform of free AI tools built exclusively for students. Our mission: democratise academic AI.',
    content: `StudentAI Tools was founded in 2024 by Roshan Pal, a software engineer and former university student who noticed that the most powerful AI tools for education were locked behind expensive subscriptions. Students at elite institutions with research grants could access them. Students at government colleges in smaller Indian cities could not. StudentAI Tools was built to close that gap. By using modern web architecture, optimised AI API integrations, and an advertising-supported free model, we created a platform where every student can access professional-grade AI tools instantly in a browser, with zero signup required. We serve 2M+ tool uses per month across 180+ countries.

Our Core Mission:
We believe that artificial intelligence is the most significant educational equalizer since the invention of the printing press. However, its potential is wasted if only a fraction of the global student population can afford it. Our mission is to democratize access to these cutting-edge academic resources. We fund our server and API costs entirely through unobtrusive advertising, ensuring that the student never has to pull out a credit card.

The Technology:
We leverage the latest advancements in Large Language Models (LLMs), optimizing our prompts specifically for educational use cases. Unlike generic chatbots, our tools are wrapped in purpose-built user interfaces that guide the student toward productive, ethical, and effective learning outcomes. We do not encourage cheating; we engineer our prompts to act as tutors, explainers, and structural guides.

Who We Serve:
While we started with a focus on helping engineering and medical students in India navigate hyper-competitive exams like the JEE, NEET, and UPSC, our platform has rapidly expanded globally. Today, high school students in the United States use our Essay Writer for AP English, university students in the UK use our PDF Chat for literature reviews, and graduates worldwide use our Resume Builder to enter the workforce.

Contact Us:
We are constantly iterating and improving our tools based on student feedback. If you have a feature request, notice a bug, or just want to tell us how our tools helped you pass a tough exam, please reach out to us through our contact page. We are building this platform for you.`,
  },
];

for (const page of toolPages) {
  writeRoute(page.route, buildHtml(page));
}

console.log('\n✅ Static generation complete!');
console.log(`   ${posts.length + toolPages.length + 2} HTML files generated in dist/\n`);
