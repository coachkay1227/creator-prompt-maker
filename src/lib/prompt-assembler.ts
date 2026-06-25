// ============================================================
// PROMPT ASSEMBLER — Builds the mega-prompt from wizard answers
// Handles all 4 tools: ChatGPT, Claude, Gemini, NotebookLM
// ============================================================

export interface WizardAnswers {
  toolId: string;
  pathId: string;
  answers: Record<string, string | string[]>;
}

// Helper to get label from id
const getLabel = (id: string, list: Array<{id: string, label: string}>) =>
  list.find(i => i.id === id)?.label ?? id;

// ============================================================
// CHATGPT PROMPT ASSEMBLY
// ============================================================

export function assembleChatGPTPrompt(answers: WizardAnswers): string {
  const a = answers.answers;
  const productType = a['product-type'] as string;
  const skillLevel = a['skill-level'] as string;
  const goal = a['primary-goal'] as string;
  const niche = a['niche'] as string;
  const platforms = Array.isArray(a['platform']) ? a['platform'].join(' + ') : a['platform'] as string;
  const style = a['visual-style'] as string;
  const promotion = Array.isArray(a['promotion']) ? a['promotion'].join(', ') : a['promotion'] as string;
  const audience = a['target-audience'] as string;
  const transformation = a['target-audience-2'] as string;

  const userAnswersBlock = `SECTION 1 — USER ANSWERS
Product Type: ${productType}
Niche/Topic: ${niche}
Skill Level: ${skillLevel}
Primary Goal: ${goal}
Selling Platform(s): ${platforms}
Visual Style: ${style}
Promotion Strategy: ${promotion}
Target Audience: ${audience}
Desired Transformation: ${transformation}`;

  const systemPrompt = `SECTION 2 — SYSTEM PROMPT

Based on the quiz answers above, create a responsive HTML interface (a single self-contained HTML document, no external libraries, no downloads).

The interface must have the following:

Use the "${style}" color scheme. Have simple tabs on the left side for navigation.

LAYOUT RULES:
- Tabs are on the LEFT SIDE and take 30% of screen space
- Headings of the blueprint are at the TOP
- The actual user interactive interface is on the RIGHT and takes 70% of screen space

Tabs must be clickable to open/close content (not auto-expanded).

TABS TO INCLUDE (exact titles):
1. 10 Digital Product Titles — ranked best to worst by estimated Google monthly search demand. Each title is clickable to show estimated monthly search volume.
2. 10 Competitors — websites that sell "${productType}" products in the "${niche}" niche. NOT big brands. Each must have a clickable URL.
3. 10 Domain / Brand Names to Choose From
4. 10 Blog / Content Ideas — ranked by estimated monthly search demand. Each clickable to show search estimate.
5. Step-by-Step Launch Checklist — specific to "${platforms}" platform
6. Revenue Calculator — live inputs: planned price + estimated daily traffic. Formula: Traffic x 2% conversion rate x Price x 30 = monthly revenue estimate. Updates live as user types.
7. Platform Setup Guide — step-by-step guide for setting up on "${platforms}"
8. Promotion Playbook — specific strategy for "${promotion}"
9. Resources & Build Instructions — see conditional logic below

MAIN DASHBOARD (default view):
- Display a summary of the "${productType}" business for a "${niche}" creator
- User inputs: Planned price of first digital product + Estimated daily traffic
- Revenue formula: Traffic x Conversion Rate x Price x 30 (default 2% conversion)
- Charts update live when user changes inputs

CONDITIONAL RESOURCES TAB:
${getResourcesInstructions(productType, platforms)}

OUTPUT REQUIREMENTS:
- Return ONLY the HTML code, nothing else, so it can be produced in canvas mode
- Code must be clean, mobile-responsive, minimal, simple UI
- Use inline CSS and vanilla JavaScript only
- All external links must be clickable
- Ensure chart updates live when user changes inputs
- All prompts must fit in a visible text box with a one-click copy button underneath
- Allow user to scroll so the whole interface can be viewed top to bottom

Now generate the full HTML.`;

  return `${userAnswersBlock}\n\n${systemPrompt}`;
}

function getResourcesInstructions(productType: string, platforms: string): string {
  const instructions: string[] = [];

  if (productType.includes('ebook') || productType.includes('audiobook')) {
    instructions.push('- Provide a ~300-character Gamma (gamma.app) prompt to design the ebook layout');
    instructions.push('- Provide a Claude Artifacts prompt to write the full ebook content');
  }
  if (productType.includes('spreadsheet') || productType.includes('tracker')) {
    instructions.push('- Provide a ~400-character ChatGPT prompt to generate the full spreadsheet with formulas, tabs, charts');
  }
  if (productType.includes('planner') || productType.includes('journal')) {
    instructions.push('- Provide a ~700-character Horizons (hostinger) prompt to build a fully responsive digital planner website');
  }
  if (productType.includes('notion')) {
    instructions.push('- Provide Notion AI setup instructions and template structure');
  }
  if (productType.includes('course') || productType.includes('mini-course')) {
    instructions.push('- Provide course curriculum outline prompt for Claude');
    instructions.push('- Include platform setup steps specific to the selected course platform');
  }
  if (productType.includes('web-app') || productType.includes('saas')) {
    instructions.push('- Provide a Google AI Studio build prompt for the web app');
    instructions.push('- Also provide a Horizons alternative build prompt');
    instructions.push('- Include a full feature spec and UI flow description');
  }
  if (productType.includes('prompt-pack')) {
    instructions.push('- Provide a Claude Artifacts prompt to generate the full prompt pack organized by category');
  }
  if (productType.includes('challenge') || productType.includes('bootcamp')) {
    instructions.push('- Provide a 5-day/7-day challenge sequence prompt');
    instructions.push('- Provide a landing page copy prompt for the challenge');
  }
  if (productType.includes('membership') || productType.includes('community')) {
    instructions.push('- Provide Skool setup guide and welcome sequence prompts');
    instructions.push('- Include community content calendar for first 30 days');
  }
  if (productType.includes('newsletter')) {
    instructions.push('- Provide Beehiiv setup guide and first 3 issue prompts');
    instructions.push('- Include growth strategy specific to newsletter');
  }

  if (platforms.includes('stan') || platforms.includes('gumroad') || platforms.includes('payhip')) {
    instructions.push(`- Provide step-by-step storefront setup guide for ${platforms}`);
    instructions.push('- Include product listing copy: title, description, pricing strategy');
  }
  if (platforms.includes('skool') || platforms.includes('teachable') || platforms.includes('thinkific')) {
    instructions.push(`- Provide course platform setup guide for ${platforms}`);
    instructions.push('- Include student onboarding sequence');
  }
  if (platforms.includes('beehiiv') || platforms.includes('kit')) {
    instructions.push(`- Provide newsletter platform setup for ${platforms}`);
    instructions.push('- Include welcome sequence (3 emails) prompts');
  }
  if (platforms.includes('etsy') || platforms.includes('amazon')) {
    instructions.push(`- Provide marketplace listing optimization guide for ${platforms}`);
    instructions.push('- Include SEO title, tags, and description prompts');
  }

  if (instructions.length === 0) {
    instructions.push('- Provide relevant build tools and resources based on the product type selected');
    instructions.push('- Include a launch checklist specific to the selling platform');
  }

  return instructions.join('\n');
}

// ============================================================
// CLAUDE PROMPT ASSEMBLY
// ============================================================

export function assembleClaudePrompt(answers: WizardAnswers): string {
  const a = answers.answers;
  const productType = a['product-type'] as string;
  const title = a['product-title'] as string;
  const topic = a['product-topic'] as string;
  const structure = a['structure'] as string;
  const audience = a['target-audience'] as string;
  const outcome = a['target-audience-2'] as string;
  const style = a['visual-style'] as string;
  const author = a['author-name'] as string;
  const writingStyle = a['writing-style'] as string;
  const outputFormat = a['output-format'] as string;

  const userAnswersBlock = `SECTION 1 — USER ANSWERS
Product Type: ${productType}
Product Title: ${title}
Topic/Description: ${topic}
Structure: ${structure}
Target Audience: ${audience}
Desired Outcome: ${outcome}
Visual Style: ${style}
Author/Brand: ${author}
Writing Style: ${writingStyle}
Output Format: ${outputFormat}`;

  let systemPrompt = '';

  if (outputFormat === 'full-draft') {
    systemPrompt = `SECTION 2 — SYSTEM PROMPT

You are ${author}, an expert author writing in a ${writingStyle} style.

Create a complete, publication-ready ${productType} titled "${title}" using Artifacts mode.

TOPIC: ${topic}

TARGET READER: ${audience}
TRANSFORMATION THEY WANT: ${outcome}

VISUAL STYLE GUIDANCE: ${style}

STRUCTURE: ${structure}

WRITING REQUIREMENTS:
- Write in ${writingStyle} style throughout
- Every chapter/section must be complete — no placeholders, no "[continue here]"
- Include: Cover page, Table of Contents, Introduction, all chapters/sections, Conclusion, Resources/Next Steps
- Use H1 for title, H2 for chapters, H3 for subsections
- Include practical examples, actionable tips, and real-world applications
- End each chapter with a key takeaway summary
- Author bio: ${author}

OUTPUT: Generate the COMPLETE ${productType} as a formatted Artifact document. Do not stop until the entire product is written.`;

  } else if (outputFormat === 'html-artifact') {
    systemPrompt = `SECTION 2 — SYSTEM PROMPT

Create a single self-contained HTML file (no external libraries) for a ${productType} product called "${title}".

PRODUCT DETAILS:
- Topic: ${topic}
- Author: ${author}
- Target audience: ${audience}
- Visual style: ${style}

THE HTML MUST INCLUDE:
- Interactive table of contents with smooth scroll
- All chapters/sections fully written in ${writingStyle} style
- Visual style matching: ${style}
- Author branding: ${author}
- One-click copy buttons for key content sections
- Mobile responsive layout
- Clean typography, professional spacing

Generate the complete HTML artifact now. No placeholders.`;

  } else if (outputFormat === 'outline') {
    systemPrompt = `SECTION 2 — SYSTEM PROMPT

Create a detailed outline for "${title}" — a ${productType} for ${audience}.

TOPIC: ${topic}
OUTCOME: ${outcome}
WRITING STYLE: ${writingStyle}
STRUCTURE: ${structure}

FOR EACH CHAPTER/MODULE INCLUDE:
1. Chapter title
2. 3-sentence summary of what it covers
3. 5 key points/lessons
4. 1 practical exercise or action step
5. Suggested word count / length

Also provide:
- Hook / opening story idea for the introduction
- Closing call-to-action recommendation
- 3 alternative title options
- Suggested price point with justification

Format as a complete professional outline ready to send to a ghostwriter or use as your writing guide.`;

  } else {
    systemPrompt = `SECTION 2 — SYSTEM PROMPT

Create a ${outputFormat} for "${title}" — a ${productType} about ${topic}.

Designed for: ${audience}
They want: ${outcome}
Author: ${author}
Style: ${writingStyle}
Visual: ${style}
Structure: ${structure}

Generate the complete, ready-to-use ${outputFormat} now. Make it fully detailed and immediately actionable.`;
  }

  return `${userAnswersBlock}\n\n${systemPrompt}`;
}

// ============================================================
// GEMINI PROMPT ASSEMBLY
// ============================================================

export function assembleGeminiPrompt(answers: WizardAnswers): string {
  const a = answers.answers;
  const productType = a['product-type'] as string;
  const skillLevel = a['skill-level'] as string;
  const goal = a['primary-goal'] as string;
  const niche = a['niche'] as string;
  const platforms = Array.isArray(a['platform']) ? a['platform'].join(' + ') : a['platform'] as string;
  const style = a['visual-style'] as string;
  const workspaceOutput = a['workspace-output'] as string;
  const promotion = Array.isArray(a['promotion']) ? a['promotion'].join(', ') : a['promotion'] as string;
  const deepResearch = Array.isArray(a['deep-research']) ? a['deep-research'] : [];

  const userAnswersBlock = `SECTION 1 — USER ANSWERS
Product Type: ${productType}
Niche/Topic: ${niche}
Skill Level: ${skillLevel}
Primary Goal: ${goal}
Selling Platform(s): ${platforms}
Visual Style: ${style}
Google Workspace Output: ${workspaceOutput}
Promotion Strategy: ${promotion}
Deep Research Requested: ${deepResearch.length > 0 ? deepResearch.join(', ') : 'None'}`;

  let researchPrefix = '';
  if (deepResearch.length > 0) {
    researchPrefix = `STEP 1 — DEEP RESEARCH (complete this first before building):

Before creating the product, conduct thorough research on the following:
${deepResearch.map(r => `- ${r}`).join('\n')}

For the "${niche}" niche and "${productType}" product type, research:
${deepResearch.includes('market-size') ? '- Current market size, growth trends, and projected value\n' : ''}
${deepResearch.includes('competitors') ? '- Top 10 competitors selling similar products (not major brands — indie creators and small businesses). Include their pricing, what makes them successful, and gaps in their offerings.\n' : ''}
${deepResearch.includes('best-titles') ? '- Top 20 best-performing product titles in this space based on search demand and sales data\n' : ''}
${deepResearch.includes('search-demand') ? '- Current Google search volume for the top 10 related keywords\n' : ''}
${deepResearch.includes('content-gaps') ? '- Identify 5 content gaps — topics people are searching for that have low competition\n' : ''}
${deepResearch.includes('monetization') ? '- Monetization opportunities: pricing strategies, upsells, bundles, subscription options\n' : ''}
${deepResearch.includes('content-formats') ? '- Best-performing content formats for this niche in 2026 (video, PDF, interactive, audio, etc.)\n' : ''}

Present this research in a structured format before proceeding to build the product.

---

STEP 2 — BUILD THE PRODUCT:

`;
  }

  let outputInstructions = '';
  if (workspaceOutput === 'google-docs') {
    outputInstructions = `Create this as a fully formatted Google Document with:
- H1 title at top
- Complete Table of Contents
- H2 chapter headings, H3 subsections
- All content fully written — no placeholders
- Professional formatting ready to share
- Visual style: ${style}`;
  } else if (workspaceOutput === 'google-sheets') {
    outputInstructions = `Create this as a Google Sheets specification with:
- Tab structure (list every tab name and its purpose)
- For each tab: column headers, formulas, data types
- Color coding scheme based on ${style} style
- Charts/graphs to include
- Automation rules or conditional formatting
- Step-by-step instructions for building in Google Sheets`;
  } else if (workspaceOutput === 'google-slides') {
    outputInstructions = `Create a 20-slide Google Slides presentation with:
- Slide 1: Title slide
- Slides 2-3: Problem/opportunity (why this matters)
- Slides 4-18: Core content sections (3-4 points per slide)
- Slide 19: Summary / Key Takeaways
- Slide 20: CTA / Next Steps
For each slide: title, 3-5 bullet points, speaker notes, suggested visual
Visual style: ${style}`;
  } else if (workspaceOutput === 'html-artifact') {
    outputInstructions = `Create a single self-contained HTML interactive dashboard with:
- 30% left navigation tabs / 70% right content area
- Style: ${style}
- Tabs: Product Titles, Competitors, Domain Names, Blog Ideas, Launch Checklist, Revenue Calculator, Platform Guide, Promo Playbook, Resources
- Revenue calculator: live inputs (price + traffic) with 2% conversion formula
- All inline CSS and vanilla JavaScript
- Mobile responsive
- One-click copy buttons on all prompt boxes`;
  } else if (workspaceOutput === 'full-suite') {
    outputInstructions = `Deliver THREE separate outputs:
1. GOOGLE DOC: Full written ${productType} document
2. GOOGLE SHEETS: Tracking/planning spreadsheet for this product launch
3. HTML DASHBOARD: Interactive blueprint dashboard

Generate all three sequentially, clearly labeled.`;
  }

  const systemPrompt = `SECTION 2 — SYSTEM PROMPT

${researchPrefix}You are a digital product creation expert helping a ${skillLevel}-level creator build a ${productType} in the ${niche} niche.

Their goal: ${goal}
Selling on: ${platforms}
Promoting via: ${promotion}

${outputInstructions}

Include a section specifically for ${platforms} setup instructions and a ${promotion} promotional strategy tailored to this product.

Make everything specific, actionable, and immediately usable. No generic advice.`;

  return `${userAnswersBlock}\n\n${systemPrompt}`;
}

// ============================================================
// NOTEBOOKLM PROMPT ASSEMBLY
// ============================================================

export function assembleNotebookLMPrompt(answers: WizardAnswers): string {
  const a = answers.answers;
  const mode = answers.pathId;

  const userAnswersBlock = `SECTION 1 — USER ANSWERS
Mode: ${mode}
${Object.entries(a).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')}`;

  let systemPrompt = '';

  if (mode === 'course-builder') {
    const topic = a['course-topic'] as string;
    const title = a['course-title'] as string;
    const audience = a['target-student'] as string;
    const outcome = a['target-student-2'] as string;
    const structure = a['course-structure'] as string;
    const level = a['student-level'] as string;
    const platform = a['delivery-platform'] as string;
    const outputs = Array.isArray(a['output-type']) ? a['output-type'] : [a['output-type'] as string];
    const sources = Array.isArray(a['source-material']) ? a['source-material'] : [a['source-material'] as string];

    systemPrompt = `SECTION 2 — NOTEBOOKLM SETUP & PROMPTS

STEP 1 — SET UP YOUR NOTEBOOK:
1. Go to notebooklm.google.com
2. Click "New Notebook"
3. Name it: "${title}"
4. Add your sources:
${sources.includes('pdf-docs') ? '   - Upload your PDF documents using the "Add source" button\n' : ''}
${sources.includes('google-docs') ? '   - Add Google Docs by pasting the URL or uploading the file\n' : ''}
${sources.includes('youtube-videos') ? '   - Add YouTube video URLs using the "Website" source option\n' : ''}
${sources.includes('urls') ? '   - Add website URLs using the "Website" source option\n' : ''}
${sources.includes('rough-notes') ? '   - Create a "Copied text" source and paste your notes\n' : ''}
${sources.includes('no-sources') ? '   - NOTE: Without sources, NotebookLM will have limited knowledge. Consider adding at least 2-3 relevant articles or documents about "${topic}"\n' : ''}

STEP 2 — USE THESE PROMPTS IN ORDER:

---

${outputs.includes('module-outline') ? `PROMPT 1 — FULL COURSE OUTLINE:
"Based on all sources in this notebook, generate a structured course outline for '${title}' with a ${structure} format for ${level} level students.

For each module include:
- Module number and title
- 4-6 lesson titles within the module
- One core learning objective (what the student can DO after this module)
- Estimated time to complete

Target student: ${audience}
Their goal: ${outcome}

Format clearly with Module numbers and lesson sub-bullets."

---

` : ''}${outputs.includes('learning-objectives') ? `PROMPT 2 — LEARNING OBJECTIVES:
"For each module in the course outline you just created for '${title}', write 3 specific, measurable learning objectives.

Use this format for each:
- By the end of this module, students will be able to: [specific action verb] [specific skill/knowledge] [specific context/condition]

Use Bloom's Taxonomy action verbs: identify, explain, apply, analyze, create, evaluate."

---

` : ''}${outputs.includes('workbook-questions') ? `PROMPT 3 — WORKBOOK QUESTIONS:
"Create a workbook exercise section for each module of '${title}'.

For each module include:
1. A reflection question (personal connection to the material)
2. An application exercise (hands-on activity they can complete)
3. A planning prompt (how they'll implement this in their life/work)
4. A self-assessment question (how well did they understand this?)

Keep all questions specific to the source material and relevant to: ${audience}"

---

` : ''}${outputs.includes('quiz-questions') ? `PROMPT 4 — QUIZ QUESTIONS:
"Create 5 multiple-choice quiz questions for each module of '${title}'.

For each question:
- Write the question
- Provide 4 answer options (A, B, C, D)
- Mark the correct answer with [CORRECT]
- Add a 1-sentence explanation of why it's correct

Base ALL questions strictly on the source material. Focus on application, not just recall."

---

` : ''}${outputs.includes('study-guide') ? `PROMPT 5 — STUDY GUIDE:
"Create a comprehensive study guide for '${title}' based on the source material.

Include:
- Top 20 key concepts with clear definitions
- How each concept connects to the others (concept map description)
- Common misconceptions to avoid
- Quick reference glossary (alphabetical)
- The 5 most important frameworks or models from the material

Write for a ${level} level student who is ${audience}"

---

` : ''}${outputs.includes('faq') ? `PROMPT 6 — COURSE FAQ:
"Based on the source material for '${title}', create a FAQ document with the top 20 questions students will ask.

For each question:
- Write the question exactly as a student would ask it
- Provide a complete, helpful answer (3-5 sentences minimum)
- Include any relevant examples or resources

Focus on the questions that ${audience} would most commonly have about ${topic}"

---

` : ''}${outputs.includes('audio-overview') ? `PROMPT 7 — AUDIO OVERVIEW:
"I want to create an Audio Overview of the key insights from '${title}'.

First, identify:
- The 3 most important insights from all the source material
- The single biggest 'aha moment' a student will have
- The most practical, immediately actionable takeaway

Then, after generating this analysis, click the 'Audio Overview' button in NotebookLM to auto-generate the podcast. When prompted to customize, paste this focus: 'Create a dynamic, conversational discussion focused on the 3 key insights for ${audience} who want to ${outcome}. Make it feel like two experts having a real conversation, not a lecture.'"

---

` : ''}${outputs.includes('quick-start') ? `PROMPT 8 — QUICK-START GUIDE:
"Create a 'Quick-Start Guide' for new students of '${title}'.

This should be the FIRST thing they read. Include:
- Welcome message (warm, encouraging, written for ${audience})
- What they'll achieve by completing this course: ${outcome}
- How the course is structured (${structure})
- How to use the materials most effectively
- The #1 thing to do before starting Module 1
- Community/support info placeholder
- Expected time commitment

Keep it to one page. Tone: ${level === 'beginner' ? 'warm, encouraging, jargon-free' : 'professional, direct, respects their time'}"

---

` : ''}${outputs.includes('sales-copy') ? `PROMPT 9 — SALES PAGE COPY:
"Based on all the source material and course content for '${title}', write a sales page outline.

Include:
- 5 headline options (power headline + 4 alternatives)
- Above-fold hook paragraph (2-3 sentences, lead with the transformation)
- Problem section: describe the pain points of ${audience} before taking this course
- Solution section: how '${title}' solves these problems
- What's included (use the module outline)
- 3 testimonial placeholders with realistic before/after scenarios
- Instructor bio placeholder
- Pricing section: suggest 3 pricing tiers with what's included in each
- FAQ (5 objection-busting questions)
- Strong closing CTA paragraph

Write with ${level === 'beginner' ? 'simple, accessible language' : 'professional, authoritative tone'}"

---

` : ''}FINAL STEP — DEPLOY ON ${platform.toUpperCase()}:
After generating all content above, use this checklist to set up your course on ${platform}:
1. Export all content from NotebookLM (copy/paste or download)
2. Create your course structure in ${platform}
3. Upload or paste lesson content into each module
4. Set up the workbook as a downloadable PDF
5. Configure quiz questions using ${platform}'s quiz feature
6. Record your video lessons using the module outlines as your script
7. Set your pricing (recommended: test at $97-$197 for signature course)
8. Write your sales page using the copy outline above
9. Set up your welcome email sequence
10. Launch to your audience using the promotion strategy`;

  } else if (mode === 'learning-tool') {
    systemPrompt = `SECTION 2 — NOTEBOOKLM SETUP & PROMPTS

STEP 1 — SET UP YOUR NOTEBOOK:
1. Go to notebooklm.google.com
2. Create a new notebook with your source materials
3. Add all relevant documents, URLs, or notes about your topic

STEP 2 — USE THESE PROMPTS:

PROMPT 1 — STUDY GUIDE:
"Create a comprehensive study guide based on all source material.
Include: top 30 key concepts with definitions, how-to summaries for main processes, common mistakes to avoid, and a quick-reference cheat sheet.
Format for easy scanning with clear headers and bullet points."

PROMPT 2 — FAQ DOCUMENT:
"Generate the top 30 questions someone learning this topic would ask, with complete answers based strictly on the source material.
Format: Question in bold, followed by a 3-5 sentence answer. Group by topic."

PROMPT 3 — CONCEPT MAP:
"Describe a concept map showing how all the key ideas in the source material connect to each other.
Identify: the central concept, 5-7 main branches, how each branch connects, and the 3 most important relationships between concepts."

PROMPT 4 — ASSESSMENT QUIZ:
"Create a 20-question assessment quiz to test understanding of the source material.
Mix: 10 multiple choice, 5 true/false, 5 short answer.
Include an answer key and scoring guide."`;

  } else if (mode === 'audio-product') {
    const topic = a['audio-topic'] as string;
    const format = a['audio-format'] as string;
    const length = a['audio-length'] as string;
    const tone = a['audio-tone'] as string;

    systemPrompt = `SECTION 2 — NOTEBOOKLM SETUP & PROMPTS

STEP 1 — SET UP YOUR NOTEBOOK:
1. Go to notebooklm.google.com
2. Create a new notebook titled: "${topic}"
3. Add your source materials (documents, URLs, notes)

STEP 2 — GENERATE YOUR AUDIO OVERVIEW:

PROMPT 1 — PRE-PRODUCTION ANALYSIS:
"Analyze all source material and identify:
1. The 3 most compelling insights that would make great audio content
2. The single most surprising or counterintuitive finding
3. The most actionable advice that listeners can use immediately
4. 5 specific examples or stories from the material to reference
5. The emotional hook — what will make listeners feel something?"

STEP 3 — CREATE THE AUDIO OVERVIEW:
1. Click the "Audio Overview" button in your NotebookLM notebook
2. In the "Customize" panel, paste this instruction:
   "Create a ${length} ${format} in a ${tone} tone. Focus on the top 3 insights from the source material. Start with a hook that immediately grabs attention. Include specific examples. End with a clear, actionable takeaway. Make it feel like two knowledgeable friends having a real conversation, not a scripted presentation."
3. Click "Generate" and wait for the audio to be created

STEP 4 — DISTRIBUTE YOUR AUDIO PRODUCT:
1. Download the generated audio file
2. Add your intro/outro music using a free tool like Audacity or GarageBand
3. Upload to your chosen platform
4. Create a transcript using the NotebookLM text output
5. Use the transcript as the written companion product`;

  } else if (mode === 'research-pipeline') {
    const researchTopic = a['research-topic'] as string;
    const productType = a['product-type'] as string;
    const researchTypes = Array.isArray(a['research-types']) ? a['research-types'] : [];

    systemPrompt = `SECTION 2 — NOTEBOOKLM SETUP & PROMPTS

STEP 1 — GATHER RESEARCH SOURCES:
1. Go to notebooklm.google.com
2. Create a new notebook titled: "Research: ${researchTopic}"
3. Add these source types:
   - 3-5 authoritative articles about "${researchTopic}" (copy URLs)
   - Any existing competitor products you've found (export as PDF if possible)
   - Relevant YouTube transcripts about this topic
   - Industry reports or studies (free versions from Google Scholar)
   - Your own notes and observations

STEP 2 — RESEARCH PROMPTS:

PROMPT 1 — MARKET ANALYSIS:
"Based on all sources, create a comprehensive market analysis for '${researchTopic}':
1. Who is already buying products about this topic? (demographic profile)
2. What are they paying? (price range analysis)
3. What do they love about existing products? (top-rated features)
4. What are they complaining about? (gaps and frustrations)
5. What is the estimated market size and growth trajectory?
6. What is the best opportunity for a new creator entering this space?"

PROMPT 2 — CONTENT GAP ANALYSIS:
"Identify 10 specific content gaps in the '${researchTopic}' space based on source material:
For each gap: describe the topic, why it's underserved, who specifically needs it, and what format would work best (ebook, course, template, etc.)"

PROMPT 3 — PRODUCT BLUEPRINT:
"Based on all research, create a detailed product blueprint for a '${productType}' about '${researchTopic}':
- Recommended product name (3 options)
- Exact target customer (1 specific person description)
- Core promise / transformation
- 10 main sections/chapters/modules
- Unique angle that differentiates from existing products
- Suggested price point with justification
- Launch strategy recommendation"

PROMPT 4 — BUILD PROMPT GENERATOR:
"Generate a ready-to-paste ChatGPT Canvas prompt to build the full '${productType}' based on the research above. The prompt should include all relevant context, the target audience, the unique angle, and specific instructions for creating an interactive HTML blueprint dashboard."`;
  }

  return `${userAnswersBlock}\n\n${systemPrompt}`;
}

// ============================================================
// MAIN ASSEMBLER — Routes to correct tool
// ============================================================

export function assemblePrompt(answers: WizardAnswers): string {
  switch (answers.toolId) {
    case 'chatgpt':
      return assembleChatGPTPrompt(answers);
    case 'claude':
      return assembleClaudePrompt(answers);
    case 'gemini':
      return assembleGeminiPrompt(answers);
    case 'notebooklm':
      return assembleNotebookLMPrompt(answers);
    default:
      return `Unknown tool: ${answers.toolId}`;
  }
}

export function getInstructions(toolId: string, outputFormat?: string): string[] {
  switch (toolId) {
    case 'chatgpt':
      return [
        'Click "Copy Full Prompt"',
        'Open a new chat in ChatGPT (chatgpt.com)',
        'Paste into the chat and select Canvas mode',
        'The AI will generate your structured interactive blueprint',
      ];
    case 'claude':
      if (outputFormat === 'html-artifact') {
        return [
          'Click "Copy Full Prompt"',
          'Open a new chat in Claude (claude.ai)',
          'Paste into the chat',
          'Claude will render the interactive product in Artifacts mode',
        ];
      }
      return [
        'Click "Copy Full Prompt"',
        'Open a new chat in Claude (claude.ai)',
        'Paste into the chat',
        'Claude will write your complete product in Artifacts mode',
      ];
    case 'gemini':
      return [
        'Click "Copy Full Prompt"',
        'Open Gemini Advanced (gemini.google.com)',
        'Paste into the chat',
        'For Docs/Sheets/Slides: ask Gemini to create the file in your Google Drive',
      ];
    case 'notebooklm':
      return [
        'Click "Copy Full Prompt"',
        'Go to notebooklm.google.com',
        'Create a new notebook and add your source materials',
        'Paste each numbered prompt into the chat one at a time',
      ];
    default:
      return ['Copy the prompt', 'Paste into your AI tool', 'Generate your product'];
  }
}
