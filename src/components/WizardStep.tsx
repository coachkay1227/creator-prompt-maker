'use client';

import { useState, useEffect } from 'react';
import { useWizardStore } from '@/store/wizard-store';
import { assemblePrompt } from '@/lib/prompt-assembler';

type Question = {
  id: string;
  label: string;
  type: 'single' | 'multi' | 'text';
  options?: { id: string; label: string }[];
  placeholder?: string;
  max?: number;
};

const QUESTIONS: Record<string, Question[]> = {
  'chatgpt-blueprint': [
    { id: 'product-type', label: 'What type of digital product are you selling?', type: 'single', options: [
      {id:'ebook',label:'Ebook / PDF Guide'},{id:'audiobook',label:'Audiobook'},{id:'spreadsheet',label:'Spreadsheet / Tracker'},{id:'planner',label:'Planner / Journal'},{id:'notion',label:'Notion Template'},{id:'course',label:'Online Course'},{id:'mini-course',label:'Mini-Course'},{id:'web-app',label:'Web App / Tool'},{id:'saas',label:'SaaS Product'},{id:'prompt-pack',label:'Prompt Pack'},{id:'challenge',label:'Challenge / Bootcamp'},{id:'membership',label:'Membership / Community'},{id:'newsletter',label:'Newsletter'},{id:'coaching',label:'Coaching Program'},
    ]},
    { id: 'niche', label: 'What is your niche or topic?', type: 'text', placeholder: 'e.g. personal finance for millennials, fitness for busy moms, AI tools for creators...' },
    { id: 'skill-level', label: 'What is your skill level as a creator?', type: 'single', options: [
      {id:'beginner',label:'Beginner — just starting out'},{id:'intermediate',label:'Intermediate — some experience'},{id:'advanced',label:'Advanced — experienced creator'},
    ]},
    { id: 'primary-goal', label: 'What is your primary goal?', type: 'single', options: [
      {id:'first-product',label:'Launch my first digital product'},{id:'grow-income',label:'Grow my passive income'},{id:'build-audience',label:'Build my audience'},{id:'replace-income',label:'Replace my 9-5 income'},{id:'scale-business',label:'Scale an existing business'},
    ]},
    { id: 'platform', label: 'Where will you sell? (pick up to 3)', type: 'multi', max: 3, options: [
      {id:'stan',label:'Stan Store'},{id:'gumroad',label:'Gumroad'},{id:'payhip',label:'Payhip'},{id:'etsy',label:'Etsy'},{id:'shopify',label:'Shopify'},{id:'teachable',label:'Teachable'},{id:'thinkific',label:'Thinkific'},{id:'skool',label:'Skool'},{id:'beehiiv',label:'Beehiiv'},{id:'kit',label:'Kit (ConvertKit)'},{id:'amazon',label:'Amazon KDP'},{id:'own-site',label:'My own website'},
    ]},
    { id: 'visual-style', label: 'What visual style fits your brand?', type: 'single', options: [
      {id:'minimal-dark',label:'Minimal Dark'},{id:'clean-white',label:'Clean White / Light'},{id:'bold-colorful',label:'Bold & Colorful'},{id:'professional-navy',label:'Professional Navy'},{id:'warm-earthy',label:'Warm & Earthy'},{id:'pastel-soft',label:'Pastel & Soft'},
    ]},
    { id: 'promotion', label: 'How will you promote? (pick up to 3)', type: 'multi', max: 3, options: [
      {id:'instagram',label:'Instagram'},{id:'tiktok',label:'TikTok'},{id:'youtube',label:'YouTube'},{id:'pinterest',label:'Pinterest'},{id:'email-list',label:'Email List'},{id:'twitter',label:'X / Twitter'},{id:'linkedin',label:'LinkedIn'},{id:'facebook-groups',label:'Facebook Groups'},{id:'seo-blog',label:'SEO Blog'},{id:'podcast',label:'Podcast'},{id:'paid-ads',label:'Paid Ads'},
    ]},
    { id: 'target-audience', label: 'Who is your target audience?', type: 'text', placeholder: 'e.g. busy moms aged 28-45 who want to lose weight without going to the gym' },
    { id: 'target-audience-2', label: 'What transformation do they want?', type: 'text', placeholder: 'e.g. go from overwhelmed beginner to making $500/month with digital products in 90 days' },
  ],
  'claude-ebook': [
    { id: 'product-type', label: 'What type of written product?', type: 'single', options: [
      {id:'ebook',label:'Ebook'},{id:'lead-magnet',label:'Lead Magnet / Free Guide'},{id:'workbook',label:'Workbook'},{id:'audiobook',label:'Audiobook Script'},{id:'white-paper',label:'White Paper'},{id:'case-study',label:'Case Study'},
    ]},
    { id: 'product-title', label: 'What is the title of your product?', type: 'text', placeholder: 'e.g. The 30-Day Digital Product Launch Blueprint' },
    { id: 'product-topic', label: 'Describe the topic and content in detail', type: 'text', placeholder: 'e.g. A step-by-step guide helping beginners launch their first digital product in 30 days using free tools...' },
    { id: 'structure', label: 'What structure should it follow?', type: 'single', options: [
      {id:'chapters',label:'Chapters (traditional book format)'},{id:'modules',label:'Modules / Lessons'},{id:'steps',label:'Step-by-Step Process'},{id:'days',label:'Day-by-Day Program'},{id:'sections',label:'Sections & Sub-sections'},{id:'qa-format',label:'Q&A Format'},
    ]},
    { id: 'target-audience', label: 'Who is this product for?', type: 'text', placeholder: 'e.g. beginner entrepreneurs who have never created a digital product before' },
    { id: 'target-audience-2', label: 'What outcome will they achieve?', type: 'text', placeholder: 'e.g. launch their first product and make their first sale within 30 days' },
    { id: 'visual-style', label: 'What visual style / tone?', type: 'single', options: [
      {id:'clean-professional',label:'Clean & Professional'},{id:'warm-friendly',label:'Warm & Friendly'},{id:'bold-direct',label:'Bold & Direct'},{id:'academic',label:'Academic / Research-Based'},{id:'conversational',label:'Conversational / Casual'},
    ]},
    { id: 'author-name', label: 'Author or brand name to use', type: 'text', placeholder: 'e.g. Sarah Johnson, The Digital Creator Co.' },
    { id: 'writing-style', label: 'Writing style preference', type: 'single', options: [
      {id:'conversational',label:'Conversational & Relatable'},{id:'professional',label:'Professional & Authoritative'},{id:'storytelling',label:'Story-Driven'},{id:'instructional',label:'Clear & Instructional'},{id:'inspiring',label:'Inspiring & Motivational'},
    ]},
    { id: 'output-format', label: 'How should Claude output this?', type: 'single', options: [
      {id:'full-draft',label:'Full Draft — write the entire product'},{id:'html-artifact',label:'HTML Artifact — interactive web format'},{id:'outline',label:'Detailed Outline first'},
    ]},
  ],
  'claude-template': [
    { id: 'product-type', label: 'What type of template?', type: 'single', options: [
      {id:'spreadsheet',label:'Spreadsheet / Tracker'},{id:'planner',label:'Planner / Journal'},{id:'notion',label:'Notion Template'},{id:'checklist',label:'Checklist / SOP'},{id:'swipe-file',label:'Swipe File'},{id:'canva-template',label:'Canva Template Brief'},
    ]},
    { id: 'product-title', label: 'Product name / title', type: 'text', placeholder: 'e.g. The Ultimate Budget Tracker for Freelancers' },
    { id: 'product-topic', label: 'What does this template help users do?', type: 'text', placeholder: 'e.g. track monthly income and expenses, plan content for 90 days...' },
    { id: 'structure', label: 'How should it be structured?', type: 'single', options: [
      {id:'tabs',label:'Multiple tabs / sections'},{id:'single-page',label:'Single page'},{id:'daily',label:'Daily format'},{id:'weekly',label:'Weekly format'},{id:'monthly',label:'Monthly format'},{id:'project-based',label:'Project-based'},
    ]},
    { id: 'target-audience', label: 'Who is this for?', type: 'text', placeholder: 'e.g. freelance designers who struggle to track their income and taxes' },
    { id: 'target-audience-2', label: 'What problem does it solve?', type: 'text', placeholder: 'e.g. saves 3 hours/month on bookkeeping and never miss a tax deduction' },
    { id: 'visual-style', label: 'Visual style', type: 'single', options: [
      {id:'minimal-clean',label:'Minimal & Clean'},{id:'colorful',label:'Colorful & Fun'},{id:'professional',label:'Professional & Corporate'},{id:'aesthetic',label:'Aesthetic / Pinterest-worthy'},
    ]},
    { id: 'output-format', label: 'Output format', type: 'single', options: [
      {id:'full-draft',label:'Write full template content'},{id:'html-artifact',label:'Build as interactive HTML tool'},{id:'outline',label:'Detailed spec / outline'},
    ]},
  ],
  'claude-promptpack': [
    { id: 'product-type', label: 'What type of prompt product?', type: 'single', options: [
      {id:'prompt-pack',label:'Prompt Pack (categorized prompts)'},{id:'swipe-file',label:'Swipe File (ready-to-copy content)'},{id:'challenge',label:'Challenge Sequence'},
    ]},
    { id: 'product-title', label: 'Product title', type: 'text', placeholder: 'e.g. 100 ChatGPT Prompts for Etsy Sellers' },
    { id: 'product-topic', label: 'What is the focus / category?', type: 'text', placeholder: 'e.g. prompts for creating Etsy product listings, email marketing, SEO descriptions...' },
    { id: 'target-audience', label: 'Who is this for?', type: 'text', placeholder: 'e.g. Etsy sellers who want to use AI to write better product descriptions and increase sales' },
    { id: 'target-audience-2', label: 'Main outcome / benefit', type: 'text', placeholder: 'e.g. cut content creation time by 80% and increase Etsy conversion rates' },
    { id: 'visual-style', label: 'Tone/style', type: 'single', options: [
      {id:'professional',label:'Professional'},{id:'fun-casual',label:'Fun & Casual'},{id:'educational',label:'Educational'},{id:'direct',label:'Direct & No-fluff'},
    ]},
    { id: 'output-format', label: 'Output format', type: 'single', options: [
      {id:'full-draft',label:'Write all prompts in full'},{id:'html-artifact',label:'Interactive HTML with copy buttons'},{id:'outline',label:'Categories and outline first'},
    ]},
  ],
  'claude-course': [
    { id: 'product-type', label: 'Course type', type: 'single', options: [
      {id:'mini-course',label:'Mini-Course (3-7 lessons)'},{id:'course',label:'Full Course (8+ modules)'},{id:'challenge',label:'Challenge / Bootcamp'},{id:'email-course',label:'Email Course'},
    ]},
    { id: 'product-title', label: 'Course title', type: 'text', placeholder: 'e.g. 7-Day Instagram Growth Blueprint' },
    { id: 'product-topic', label: 'What will students learn?', type: 'text', placeholder: 'e.g. how to go from 0 to 1000 Instagram followers in 7 days using content batching...' },
    { id: 'target-audience', label: 'Target student', type: 'text', placeholder: 'e.g. beginner content creators with under 500 followers' },
    { id: 'target-audience-2', label: 'Transformation / result', type: 'text', placeholder: 'e.g. grow to 1000+ engaged followers and get their first brand deal' },
    { id: 'structure', label: 'Course structure', type: 'single', options: [
      {id:'modules',label:'Modules with lessons'},{id:'days',label:'Day-by-day program'},{id:'steps',label:'Step-by-step phases'},{id:'challenges',label:'Daily challenges'},
    ]},
    { id: 'visual-style', label: 'Teaching style', type: 'single', options: [
      {id:'step-by-step',label:'Step-by-step instructional'},{id:'storytelling',label:'Story + examples based'},{id:'framework',label:'Framework-based'},{id:'conversational',label:'Conversational coaching style'},
    ]},
    { id: 'output-format', label: 'Output format', type: 'single', options: [
      {id:'full-draft',label:'Write all lesson content'},{id:'outline',label:'Full course outline + scripts'},{id:'html-artifact',label:'Interactive HTML course page'},
    ]},
  ],
  'gemini-product': [
    { id: 'product-type', label: 'Product type', type: 'single', options: [
      {id:'ebook',label:'Ebook / Guide'},{id:'spreadsheet',label:'Spreadsheet / Tracker'},{id:'planner',label:'Planner / Journal'},{id:'course',label:'Course Curriculum'},{id:'prompt-pack',label:'Prompt Pack'},{id:'template',label:'Template'},{id:'research-report',label:'Research Report'},
    ]},
    { id: 'niche', label: 'Niche / topic', type: 'text', placeholder: 'e.g. social media marketing for small businesses' },
    { id: 'skill-level', label: 'Your creator level', type: 'single', options: [
      {id:'beginner',label:'Beginner'},{id:'intermediate',label:'Intermediate'},{id:'advanced',label:'Advanced'},
    ]},
    { id: 'primary-goal', label: 'Primary goal', type: 'single', options: [
      {id:'first-product',label:'Launch my first product'},{id:'grow-income',label:'Grow passive income'},{id:'build-audience',label:'Build my audience'},{id:'scale-business',label:'Scale existing business'},
    ]},
    { id: 'workspace-output', label: 'Which Google format?', type: 'single', options: [
      {id:'google-docs',label:'Google Docs (written product)'},{id:'google-sheets',label:'Google Sheets (tracker/spreadsheet)'},{id:'google-slides',label:'Google Slides (presentation/course)'},{id:'gmail-draft',label:'Gmail (email sequence)'},
    ]},
    { id: 'visual-style', label: 'Visual style', type: 'single', options: [
      {id:'clean-minimal',label:'Clean & Minimal'},{id:'professional',label:'Professional'},{id:'colorful',label:'Colorful & Bold'},{id:'corporate',label:'Corporate'},
    ]},
    { id: 'platform', label: 'Selling platform', type: 'single', options: [
      {id:'gumroad',label:'Gumroad'},{id:'stan',label:'Stan Store'},{id:'etsy',label:'Etsy'},{id:'own-site',label:'Own website'},{id:'teachable',label:'Teachable'},{id:'amazon',label:'Amazon KDP'},
    ]},
    { id: 'promotion', label: 'Promotion method', type: 'single', options: [
      {id:'instagram',label:'Instagram'},{id:'youtube',label:'YouTube'},{id:'email-list',label:'Email list'},{id:'pinterest',label:'Pinterest'},{id:'tiktok',label:'TikTok'},{id:'seo-blog',label:'SEO Blog'},
    ]},
    { id: 'deep-research', label: 'Want Gemini to research first? (optional, pick any)', type: 'multi', max: 4, options: [
      {id:'market-size',label:'Market size & trends'},{id:'competitors',label:'Top competitors analysis'},{id:'best-titles',label:'Best-performing product titles'},{id:'search-demand',label:'Keyword search demand'},{id:'content-gaps',label:'Content gaps to exploit'},{id:'monetization',label:'Monetization strategies'},
    ]},
  ],
  'gemini-research': [
    { id: 'product-type', label: 'What product are you researching for?', type: 'single', options: [
      {id:'ebook',label:'Ebook / Guide'},{id:'course',label:'Course'},{id:'spreadsheet',label:'Spreadsheet / Tracker'},{id:'membership',label:'Membership'},{id:'saas',label:'Web App / SaaS'},{id:'coaching',label:'Coaching Program'},
    ]},
    { id: 'niche', label: 'Your niche / market', type: 'text', placeholder: 'e.g. productivity tools for remote workers' },
    { id: 'workspace-output', label: 'Preferred output format', type: 'single', options: [
      {id:'google-docs',label:'Google Docs research report'},{id:'google-sheets',label:'Google Sheets competitor tracker'},{id:'google-slides',label:'Google Slides market overview'},
    ]},
    { id: 'skill-level', label: 'Your creator level', type: 'single', options: [
      {id:'beginner',label:'Beginner'},{id:'intermediate',label:'Intermediate'},{id:'advanced',label:'Advanced'},
    ]},
    { id: 'primary-goal', label: 'Primary goal', type: 'single', options: [
      {id:'validate-idea',label:'Validate my product idea'},{id:'find-gap',label:'Find a content gap'},{id:'understand-competitors',label:'Understand the competition'},{id:'pricing-strategy',label:'Figure out pricing strategy'},
    ]},
    { id: 'deep-research', label: 'What should Gemini research? (pick all that apply)', type: 'multi', max: 6, options: [
      {id:'market-size',label:'Market size & growth trends'},{id:'competitors',label:'Top 10 competitors'},{id:'best-titles',label:'Best-performing product titles'},{id:'search-demand',label:'Google search demand'},{id:'content-gaps',label:'Content gaps & opportunities'},{id:'monetization',label:'Monetization strategies'},{id:'content-formats',label:'Best content formats for 2026'},
    ]},
    { id: 'visual-style', label: 'Report style', type: 'single', options: [
      {id:'detailed',label:'Detailed & comprehensive'},{id:'executive-summary',label:'Executive summary format'},{id:'action-plan',label:'Action plan format'},
    ]},
    { id: 'platform', label: 'Selling platform you are targeting', type: 'single', options: [
      {id:'gumroad',label:'Gumroad'},{id:'stan',label:'Stan Store'},{id:'etsy',label:'Etsy'},{id:'teachable',label:'Teachable'},{id:'amazon',label:'Amazon KDP'},{id:'own-site',label:'Own website'},
    ]},
  ],
  'nlm-course': [
    { id: 'course-title', label: 'Course title', type: 'text', placeholder: 'e.g. The Complete AI Tools Masterclass for Content Creators' },
    { id: 'course-topic', label: 'What will this course teach?', type: 'text', placeholder: 'e.g. how to use ChatGPT, Midjourney and Canva to create and sell digital products in 30 days' },
    { id: 'target-student', label: 'Who is your target student?', type: 'text', placeholder: 'e.g. beginner content creators aged 25-45 who have never used AI tools' },
    { id: 'target-student-2', label: 'What outcome will they achieve?', type: 'text', placeholder: 'e.g. create their first AI-powered digital product and earn their first $500 online' },
    { id: 'course-structure', label: 'Course structure', type: 'single', options: [
      {id:'modules',label:'Modules with lessons'},{id:'days',label:'Day-by-day program'},{id:'phases',label:'Phase-based progression'},{id:'challenges',label:'Daily challenges'},
    ]},
    { id: 'student-level', label: 'Student experience level', type: 'single', options: [
      {id:'beginner',label:'Complete beginner'},{id:'intermediate',label:'Some experience'},{id:'advanced',label:'Advanced practitioner'},
    ]},
    { id: 'source-material', label: 'What sources will you upload to NotebookLM?', type: 'multi', max: 5, options: [
      {id:'pdf-docs',label:'PDF documents'},{id:'google-docs',label:'Google Docs'},{id:'youtube-videos',label:'YouTube videos'},{id:'urls',label:'Website URLs'},{id:'rough-notes',label:'Rough notes / text'},{id:'no-sources',label:'No sources yet'},
    ]},
    { id: 'delivery-platform', label: 'Course delivery platform', type: 'single', options: [
      {id:'teachable',label:'Teachable'},{id:'thinkific',label:'Thinkific'},{id:'skool',label:'Skool'},{id:'kajabi',label:'Kajabi'},{id:'gumroad',label:'Gumroad'},{id:'beehiiv',label:'Beehiiv (email course)'},{id:'own-site',label:'Own website'},
    ]},
    { id: 'output-type', label: 'What outputs do you need? (pick all)', type: 'multi', max: 9, options: [
      {id:'module-outline',label:'Full course outline'},{id:'learning-objectives',label:'Learning objectives'},{id:'workbook-questions',label:'Workbook exercises'},{id:'quiz-questions',label:'Quiz questions'},{id:'lesson-scripts',label:'Video lesson scripts'},{id:'summary-docs',label:'Chapter summaries'},{id:'podcast-overview',label:'Audio overview'},{id:'quick-start',label:'Quick-start guide'},{id:'sales-copy',label:'Sales page copy'},
    ]},
  ],
  'nlm-learning': [
    { id: 'course-topic', label: 'What topic are you studying or teaching?', type: 'text', placeholder: 'e.g. advanced SEO strategies for e-commerce' },
    { id: 'target-student', label: 'Who is the learner?', type: 'text', placeholder: 'e.g. marketing managers with 2-3 years experience wanting to level up their SEO skills' },
    { id: 'student-level', label: 'Knowledge level', type: 'single', options: [
      {id:'beginner',label:'Beginner'},{id:'intermediate',label:'Intermediate'},{id:'advanced',label:'Advanced'},
    ]},
    { id: 'source-material', label: 'Source materials you will upload', type: 'multi', max: 5, options: [
      {id:'pdf-docs',label:'PDF documents'},{id:'google-docs',label:'Google Docs'},{id:'youtube-videos',label:'YouTube videos'},{id:'urls',label:'Website URLs'},{id:'rough-notes',label:'Rough notes'},
    ]},
    { id: 'output-type', label: 'What do you need?', type: 'multi', max: 4, options: [
      {id:'study-guide',label:'Study guide & key concepts'},{id:'faq',label:'FAQ document'},{id:'concept-map',label:'Concept map description'},{id:'quiz',label:'Assessment quiz'},
    ]},
  ],
  'nlm-audio': [
    { id: 'audio-topic', label: 'What is the audio product about?', type: 'text', placeholder: 'e.g. how to build a profitable side hustle with digital products in 2026' },
    { id: 'target-student', label: 'Who is the listener?', type: 'text', placeholder: 'e.g. busy professionals who commute and want to learn on the go' },
    { id: 'target-student-2', label: 'Key transformation they want', type: 'text', placeholder: 'e.g. go from overwhelmed to earning $2k/month from a side hustle in 90 days' },
    { id: 'audio-format', label: 'Audio format', type: 'single', options: [
      {id:'podcast-episode',label:'Podcast episode'},{id:'audio-course',label:'Audio course series'},{id:'audiobook',label:'Audiobook chapter'},{id:'interview',label:'Interview / conversation style'},
    ]},
    { id: 'audio-length', label: 'Target length', type: 'single', options: [
      {id:'short',label:'Short (5-15 min)'},{id:'medium',label:'Medium (15-30 min)'},{id:'long',label:'Long (30-60 min)'},{id:'series',label:'Multi-episode series'},
    ]},
    { id: 'audio-tone', label: 'Tone and style', type: 'single', options: [
      {id:'conversational',label:'Conversational & casual'},{id:'educational',label:'Educational & structured'},{id:'inspiring',label:'Inspiring & motivational'},{id:'expert',label:'Expert interview style'},
    ]},
    { id: 'source-material', label: 'Source materials you will upload', type: 'multi', max: 4, options: [
      {id:'pdf-docs',label:'PDF documents'},{id:'rough-notes',label:'Rough notes / outlines'},{id:'urls',label:'Website articles'},{id:'no-sources',label:'No sources yet'},
    ]},
  ],
  'nlm-research': [
    { id: 'research-topic', label: 'What market or topic are you researching?', type: 'text', placeholder: 'e.g. digital planners for students, AI writing tools for small businesses' },
    { id: 'product-type', label: 'What product type are you validating?', type: 'single', options: [
      {id:'ebook',label:'Ebook / Guide'},{id:'course',label:'Course'},{id:'template',label:'Template'},{id:'membership',label:'Membership'},{id:'saas',label:'Web App / Tool'},{id:'prompt-pack',label:'Prompt Pack'},
    ]},
    { id: 'research-types', label: 'What research do you need?', type: 'multi', max: 4, options: [
      {id:'competitor-analysis',label:'Competitor analysis'},{id:'content-gaps',label:'Content gap analysis'},{id:'product-blueprint',label:'Product blueprint'},{id:'build-prompt',label:'AI build prompt generator'},
    ]},
    { id: 'source-material', label: 'Source materials to upload', type: 'multi', max: 4, options: [
      {id:'urls',label:'Competitor website URLs'},{id:'pdf-docs',label:'Industry reports / PDFs'},{id:'rough-notes',label:'Your own notes'},{id:'no-sources',label:'No sources yet'},
    ]},
  ],
};

export default function WizardStep() {
  const { selectedToolId, selectedPathId, currentStep, totalSteps, answers, setAnswer, toggleMultiAnswer, nextStep, prevStep, setTotalSteps, setGeneratedPrompt, setIsGenerating, addToHistory } = useWizardStore();
  const [text, setText] = useState('');

  const pathKey = selectedPathId || '';
  const questions = QUESTIONS[pathKey] || [];
  const questionIndex = currentStep - 1;
  const question = questions[questionIndex];

  useEffect(() => {
    if (questions.length > 0 && totalSteps !== questions.length) {
      setTotalSteps(questions.length);
    }
  }, [questions.length, totalSteps, setTotalSteps]);

  useEffect(() => {
    if (question && question.type === 'text') {
      setText((answers[question.id] as string) || '');
    }
  }, [question, answers]);

  if (!question) return null;

  const currentAnswer = answers[question.id];
  const isAnswered = question.type === 'text'
    ? text.trim().length > 0
    : question.type === 'multi'
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : !!currentAnswer;

  const isLastStep = currentStep === questions.length;

  const handleNext = () => {
    if (question.type === 'text') {
      setAnswer(question.id, text.trim());
    }
    if (isLastStep) {
      handleGenerate();
    } else {
      nextStep();
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const finalAnswers: Record<string, string | string[]> = { ...answers };
    if (question.type === 'text') finalAnswers[question.id] = text.trim();

    // Map path to mode for NotebookLM
    if (selectedToolId === 'notebooklm') {
      const modeMap: Record<string, string> = {
        'nlm-course': 'course-builder',
        'nlm-learning': 'learning-tool',
        'nlm-audio': 'audio-product',
        'nlm-research': 'research-validate',
      };
      finalAnswers['mode'] = modeMap[selectedPathId || ''] || 'course-builder';
    }

    const prompt = assemblePrompt({ toolId: selectedToolId || '', pathId: selectedPathId || '', answers: finalAnswers });
    setGeneratedPrompt(prompt);
    addToHistory({
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      toolId: selectedToolId || '',
      toolName: selectedToolId || '',
      pathId: selectedPathId || '',
      productType: (finalAnswers['product-type'] as string) || '',
      niche: (finalAnswers['niche'] as string) || (finalAnswers['course-topic'] as string) || '',
      answers: finalAnswers,
      prompt,
    });
    setIsGenerating(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-2 text-white">{question.label}</h2>
        {question.type === 'multi' && question.max && (
          <p className="text-gray-500 text-sm mb-4">Select up to {question.max}</p>
        )}

        {question.type === 'single' && question.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {question.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAnswer(question.id, opt.id)}
                className={'option-card text-sm ' + (currentAnswer === opt.id ? 'selected border-indigo-500 text-indigo-400' : '')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {question.type === 'multi' && question.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {question.options.map((opt) => {
              const selected = Array.isArray(currentAnswer) && currentAnswer.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleMultiAnswer(question.id, opt.id, question.max || 10)}
                  className={'option-card text-sm ' + (selected ? 'selected border-indigo-500 text-indigo-400' : '')}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'text' && (
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-indigo-500 mb-6"
            rows={4}
            placeholder={question.placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}

        <div className="flex gap-3">
          {currentStep > 1 && (
            <button onClick={prevStep} className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 text-sm">
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={'flex-1 py-3 rounded-lg font-semibold text-white transition-all ' + (isAnswered ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-700 opacity-50 cursor-not-allowed')}
          >
            {isLastStep ? 'Generate My Prompt' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
