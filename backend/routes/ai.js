const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { GoogleGenAI } = require('@google/genai');
const axios = require('axios');
const crypto = require('crypto');
const NodeCache = require('node-cache');

const aiCache = new NodeCache({ stdTTL: 86400 }); // 24H Cache

const providers = [];

const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
const API_KEYS = rawKeys.split(',').map(k => k.trim()).filter(k => k.length > 0);
API_KEYS.forEach(key => providers.push({ type: 'gemini', name: 'Google Gemini', instance: new GoogleGenAI({ apiKey: key }) }));

if (process.env.OPENROUTER_API_KEY) {
    providers.push({ type: 'openrouter', name: 'OpenRouter Core', key: process.env.OPENROUTER_API_KEY });
}
if (process.env.HUGGINGFACE_API_KEY) {
    providers.push({ type: 'huggingface', name: 'HuggingFace Inference', key: process.env.HUGGINGFACE_API_KEY });
}
if (providers.length === 0) { console.warn("WARNING: No API keys configured in environment variables."); }

let currentKeyIndex = 0;

const generateRaw = async (prompt, isJson = false) => {
    let attempts = 0;
    while (attempts < providers.length) {
        const provider = providers[currentKeyIndex];
        try {
            console.log(`[API Engine] Attempting request using: ${provider.name}`);
            let outputText = "";

            if (provider.type === 'gemini') {
                const config = isJson ? { responseMimeType: "application/json" } : {};
                const response = await provider.instance.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config });
                outputText = response.text;
                
            } else if (provider.type === 'openrouter') {
                const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
                    model: "google/gemini-2.5-flash", // Route it back to identical Gemini logic format strings
                    messages: [{ role: "user", content: prompt }]
                }, { headers: { "Authorization": `Bearer ${provider.key}` } });
                outputText = res.data.choices[0].message.content;

            } else if (provider.type === 'huggingface') {
                const res = await axios.post("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
                    inputs: `[INST] ${prompt} [/INST]`, parameters: { max_new_tokens: 4000, return_full_text: false }
                }, { headers: { "Authorization": `Bearer ${provider.key}` } });
                outputText = res.data[0]?.generated_text || res.data?.generated_text || "";
            }

            if (isJson && outputText) {
                outputText = outputText.replace(/```json/gi, '').replace(/```/g, '').trim();
            }
            return { text: outputText };
            
        } catch (error) {
            console.log(`[API Rotator] Provider '${provider.name}' failed testing. Catching error natively. Shifting to next fallback provider...`);
            currentKeyIndex = (currentKeyIndex + 1) % providers.length;
            attempts++;
        }
    }
    throw new Error('429_ALL_KEYS_EXHAUSTED');
};

const generateWithRotation = async (prompt, isJson = false) => {
    const hash = crypto.createHash('md5').update(prompt).digest('hex');
    const cachedResponse = aiCache.get(hash);
    
    if (cachedResponse) {
        console.log('[API Cache] HIT: Serving response from memory cache instantly.');
        return cachedResponse;
    }
    
    const response = await generateRaw(prompt, isJson);
    aiCache.set(hash, response);
    return response;
};

const aiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 1000,
  message: { message: 'Daily free AI limit reached for this IP.' },
  validate: { ip: false },
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'guest';
  }
});

router.post('/resume', aiLimiter, async (req, res) => {
  try {
    const { name, profession, email, phone, linkedin, github, degree, university, graduationYear, skills, experience, projects } = req.body;
    const prompt = `Create a professional resume for:
Name: ${name}
Target Profession: ${profession}
Contact Info: ${email} | ${phone} | LinkedIn: ${linkedin || 'N/A'} | GitHub: ${github || 'N/A'}
Education: ${degree} | ${university} | Expected Graduation: ${graduationYear}
Skills: ${skills}
Experience: ${experience}
Projects: ${projects}

CRITICAL FORMATTING INSTRUCTIONS:
- You MUST design the content to fit entirely on ONE single printable page. 
- Keep all bullet points extremely concise, systematic, and direct. Cut all fluff.
- Output the Name as an H1, the Contact Info beneath it, and then the sections.
- Format cleanly with professional Markdown headings. Omit any conversational intro or outro. 
- Ensure the skills and structure are perfectly tailored to maximize success for a ${profession} role.`;

    const response = await generateWithRotation(prompt, false);
    res.json({ title: `${name} Resume`, content: response.text });
  } catch (error) {
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exhausted'))) {
      return res.status(429).json({ message: 'Google API Free Tier Limit Reached: Please wait 15-30 seconds before generating again.' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/presentation', aiLimiter, async (req, res) => {
  try {
    const { topic } = req.body;
    const prompt = `You are a professional presentation designer.

Your task is to generate a complete PowerPoint presentation based on the user's topic.

Requirements:

1. Create a well-structured presentation with 7-9 slides.
2. Each slide must include:
   - Slide title
   - 3–5 concise bullet points
3. Include the following slide types:
   - Title slide
   - Introduction
   - Key concepts
   - Detailed explanation slides
   - Examples or case studies
   - Conclusion
   - Final summary

Design Guidelines:
- Use modern, visually appealing presentation styles.
- Suggest a design theme for the presentation (e.g., Minimal Professional, Modern Gradient, Corporate Blue, Dark Tech).
- Keep text concise and presentation-friendly.

Formatting Rules:
Return the result in structured JSON format strictly like this (no markdown syntax wrappers):

{
  "theme": "presentation theme",
  "slides": [
    {
      "title": "Slide title",
      "points": [
        "bullet point 1",
        "bullet point 2",
        "bullet point 3"
      ]
    }
  ]
}

User Topic: ${topic}

Make the presentation engaging, clear, and visually attractive.`;

    const response = await generateWithRotation(prompt, true);
    
    const presentationData = JSON.parse(response.text);
    res.json({ title: `${topic} Presentation`, content: presentationData });
  } catch (error) {
    console.error('AI Presentation Error:', error);
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exhausted'))) {
      return res.status(429).json({ message: 'Google API Free Tier Limit Reached: Please wait 15-30 seconds before generating again.' });
    }
    res.status(500).json({ message: 'Error generating presentation. The AI might not have returned valid JSON.' });
  }
});

router.post('/caption', aiLimiter, async (req, res) => {
  try {
    const { topic, mood } = req.body;
    const prompt = `Create 5 engaging Instagram captions for the topic "${topic}" with a "${mood}" mood. Include short hooks, engaging body text, and relevant hashtags for each. Use clear Markdown separation.`;

    const response = await generateWithRotation(prompt, false);
    res.json({ topic, content: response.text });
  } catch (error) {
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exhausted'))) {
      return res.status(429).json({ message: 'Google API Free Tier Limit Reached: Please wait 15-30 seconds before generating again.' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/chat-pdf', aiLimiter, async (req, res) => {
  try {
    const { question, pdfText, history } = req.body;
    
    let conversationContext = '';
    if (history && history.length > 0) {
      conversationContext = 'Previous Conversation History:\n' + history.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n') + '\n\n';
    }

    const prompt = `You are a helpful, brilliant AI assistant designed to answer questions strictly based on the provided PDF document. Given the following document text, answer the user's latest question comprehensively. If the document doesn't contain the exact answer, politely inform them, but use your general knowledge to provide helpful context if appropriate.

### DOCUMENT TEXT START
${pdfText.substring(0, 200000)}
### DOCUMENT TEXT END

${conversationContext}
User's Latest Question: ${question}

Provide a clear, engaging, and highly informative answer. Format it beautifully using Markdown (bolding, lists, code blocks if needed).`;

    const response = await generateWithRotation(prompt, false);
    res.json({ answer: response.text });
  } catch (error) {
    console.error('AI Chat Error:', error);
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exhausted'))) {
      return res.status(429).json({ message: 'Google API Free Tier Limit Reached: You are sending requests too quickly. Please wait 10-15 seconds and try asking your question again.' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/email', aiLimiter, async (req, res) => {
  try {
    const { topic, tone } = req.body;
    const prompt = `You are an expert professional copywriter. Write a highly effective, ready-to-send email based on the following input:

Topic/Purpose: ${topic}
Desired Tone: ${tone}

Requirements:
- Only output the exact email subject line and body text.
- Do not include any conversational filler (e.g. "Here is your email:").
- Do not wrap the email in Markdown code blocks (like \`\`\`).
- Provide placeholders like [Name] or [Company] where specific details are needed.
- Keep formatting clean and spacing readable for standard email clients.

Format:
Subject: [Your Subject Here]

[Salutation]
[Body]
[Sign-off]`;

    const response = await generateWithRotation(prompt, false);
    res.json({ content: response.text.trim() });
  } catch (error) {
    console.error('AI Email Error:', error);
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exhausted'))) {
      return res.status(429).json({ message: 'Google API Free Tier Limit Reached: Please wait 15-30 seconds before generating again.' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/homework-helper', aiLimiter, async (req, res) => {
  try {
    const { question, subject, level } = req.body;
    const prompt = `You are a brilliant, patient tutor. Help the student with their homework question.
Subject: ${subject}
Level: ${level}
Question: ${question}

Instructions:
1. Provide a clear, step-by-step explanation of the concept.
2. Don't just give the answer; explain "why" and "how".
3. Use simple, engaging language.
4. Format with bold headings, bullet points, and LaTeX for math where applicable.
5. If the question is multi-part, address each part clearly.`;

    const response = await generateWithRotation(prompt, false);
    res.json({ content: response.text });
  } catch (error) {
    if (error.message === '429_ALL_KEYS_EXHAUSTED') {
      return res.status(429).json({ message: 'AI Limit Reached: All free API keys are currently exhausted. Please wait 15-30 seconds or try again later.' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/essay-writer', aiLimiter, async (req, res) => {
  try {
    const { topic, type, length, keywords } = req.body;
    const prompt = `Write a high-quality ${type} essay on the topic: "${topic}".
Target Length: Approximately ${length} words.
Keywords to include: ${keywords}

Formatting:
- Use H1 for title, H2 for subheadings.
- Include an introduction, body paragraphs with evidence, and a strong conclusion.
- Use academic but accessible tone.
- Ensure logical flow and transitions.`;

    const response = await generateWithRotation(prompt, false);
    res.json({ content: response.text });
  } catch (error) {
    if (error.message === '429_ALL_KEYS_EXHAUSTED') {
      return res.status(429).json({ message: 'AI Limit Reached: All free API keys are currently exhausted. Please wait 15-30 seconds or try again later.' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/study-planner', aiLimiter, async (req, res) => {
  try {
    const { exam, timeframe, subjects, goal } = req.body;
    const prompt = `Generate a comprehensive study plan for the ${exam} exam.
Timeframe: ${timeframe}
Subjects: ${subjects}
Primary Goal: ${goal}

Requirements:
- Create a day-by-day or week-by-week schedule.
- Include specific topics to cover each day.
- Add tips for active recall and spaced repetition.
- Include scheduled breaks and review sessions.`;

    const response = await generateWithRotation(prompt, false);
    res.json({ content: response.text });
  } catch (error) {
    if (error.message === '429_ALL_KEYS_EXHAUSTED') {
      return res.status(429).json({ message: 'AI Limit Reached: All free API keys are currently exhausted. Please wait 15-30 seconds or try again later.' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/notes-generator', aiLimiter, async (req, res) => {
  try {
    const { content, format } = req.body;
    const prompt = `Transform the following raw content into structured, high-quality notes.
Format: ${format} (e.g., Cornell Method, Outline, Mind Map style list)

Content:
${content}

Requirements:
- Identify key concepts, terms, and definitions.
- Organize logically with headings and sub-headings.
- Keep it concise but comprehensive.
- Add a "Summary" section at the end.`;

    const response = await generateWithRotation(prompt, false);
    res.json({ content: response.text });
  } catch (error) {
    if (error.message === '429_ALL_KEYS_EXHAUSTED') {
      return res.status(429).json({ message: 'AI Limit Reached: All free API keys are currently exhausted. Please wait 15-30 seconds or try again later.' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/quiz-generator', aiLimiter, async (req, res) => {
  try {
    const { content, numQuestions, type } = req.body;
    const prompt = `Generate a practice quiz based on the following content.
Number of Questions: ${numQuestions}
Quiz Type: ${type} (e.g., Multiple Choice, True/False, Short Answer)

Content:
${content}

Requirements:
- Provide the questions first.
- Provide the Answer Key at the very bottom.
- For Multiple Choice, provide 4 options (A-D).
- Ensure questions cover key concepts accurately.`;

    const response = await generateWithRotation(prompt, false);
    res.json({ content: response.text });
  } catch (error) {
    if (error.message === '429_ALL_KEYS_EXHAUSTED') {
      return res.status(429).json({ message: 'AI Limit Reached: All free API keys are currently exhausted. Please wait 15-30 seconds or try again later.' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/assignment-generator', aiLimiter, async (req, res) => {
  try {
    const { topic, level, instructions } = req.body;
    const prompt = `Create a complete academic assignment for:
Topic: ${topic}
Grade Level: ${level}
Specific instructions: ${instructions}

Include:
- Assignment Title
- Learning Objectives
- Detailed Instructions
- Grading Rubric
- 2-3 starting research questions or resources.`;

    const response = await generateWithRotation(prompt, false);
    res.json({ content: response.text });
  } catch (error) {
    if (error.message === '429_ALL_KEYS_EXHAUSTED') {
      return res.status(429).json({ message: 'AI Limit Reached: All free API keys are currently exhausted. Please wait 15-30 seconds or try again later.' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.post('/summarize', aiLimiter, async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `Act as a highly intelligent student assistant.
Summarize the following long form text into:
1. A concise, one-paragraph abstract.
2. A detailed bullet-point list of the core arguments and key data.
3. A "Definition of Terms" section if applicable.

Do not include any polite intros or fluff. Only the structured summary.

Text: "${text}"`;

    const response = await generateWithRotation(prompt, false);
    res.json({ content: response.text });
  } catch (error) {
    if (error.message === '429_ALL_KEYS_EXHAUSTED') {
      return res.status(429).json({ message: 'AI Limit Reached: All free API keys are currently exhausted. Please wait 15-30 seconds or try again later.' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
