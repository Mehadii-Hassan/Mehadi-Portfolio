/*
 * ============================================================
 *  ALL CONTENT AND LINKS FOR THE PORTFOLIO LIVE IN THIS FILE.
 *  Edit this one file to change text, projects, skills, links.
 * ============================================================
 */

/* ------------------------------------------------------------------
 *  FILL THESE: Replace every "YOUR_" placeholder below with your
 *  real URLs. If a link has an empty string "" it will be hidden.
 * ------------------------------------------------------------------ */
const LINKS = {
  github:   "https://github.com/Mehadii-Hassan",
  linkedin: "https://www.linkedin.com/in/md-mehadi-hassan-ai/",
  email:    "mailto:mehadi.cse01@gmail.com",
  resume:   "assets/Md__Mehadi_Hassan.pdf",
  // Certificate links:
  cert1:    "https://drive.google.com/file/d/1qqLrZIWMPHhtXXSLVXGEQtx1Iu071SNF/view",
  cert2:    "https://drive.google.com/file/d/1E7YehptqspMi5M-Bubi05JmgNJP4gCSt/view",
  // Optional live demo links. Leave "" to hide the "Live Demo" button.
  demo1:    "",
  demo2:    "",
  demo3:    "",
  demo4:    "",

  // Canonical URL for SEO (used in <link rel=canonical>):
  canonical: "https://Mehadii-Hassan.github.io/Mehadi-Portfolio/"
};

/* ------------------------------------------------------------------
 *  PROFILE
 * ------------------------------------------------------------------ */
const PROFILE = {
  name:      "Md. Mehadi Hassan",
  monogram:  "Mehadi",
  title:     "AI Engineer",
  location:  "Uttara, Dhaka, Bangladesh",
  email:     "mehadi.cse01@gmail.com",
  phone:     "+8801757399837",
  // Show phone / WhatsApp publicly? Set to true to display them.
  showPhone: false,
  degrees:   [
    "Bachelor of Science in Computer Science and Engineering (CSE)"
  ],
  focus:     ["LLMs", "RAG", "Multi-Agent Systems"],
};

/* ------------------------------------------------------------------
 *  HERO + ABOUT TEXT (short, first-person. No new claims added.)
 * ------------------------------------------------------------------ */
const heroTyping = [
  "AI Engineer",
  "LLM & RAG Developer",
  "Multi-Agent Systems Builder",
  "LangGraph Orchestrator"
];

const heroIntro =
  "I'm an AI Engineer who designs and ships production-style AI applications powered by Large Language Models, advanced Retrieval-Augmented Generation, and complex multi-agent orchestration built on LangGraph.";

const aboutText =
  "I design and deploy production-style AI applications powered by Large Language Models (LLMs) and advanced Retrieval-Augmented Generation (RAG). I'm highly skilled in complex multi-agent orchestration using LangGraph, system tool integrations, and comprehensive harness engineering. I love integrating cutting-edge LLM APIs and building high-performance, vector-search-backed conversational systems with Python, Pinecone, and FAISS — focused on shipping scalable, industry-grade AI automation workflows in distributed remote environments.";

/* ------------------------------------------------------------------
 *  SKILLS (6 groups)
 * ------------------------------------------------------------------ */
const skills = [
  {
    group: "Generative AI & Multi-Agent Orchestration",
    icon: "brain",
    items: ["LangGraph", "LangChain", "Multi-Agent Systems", "Harness Engineering", "Tool Systems Integration", "Prompt Engineering"]
  },
  {
    group: "Vector Search & RAG Infrastructure",
    icon: "database",
    items: ["Chroma", "Pinecone", "FAISS", "Advanced Retrieval Pipelines", "Context Chunking"]
  },
  {
    group: "LLM Providers & APIs",
    icon: "chip",
    items: ["Groq", "Google Generative AI (Gemini)", "REST APIs Integration"]
  },
  {
    group: "Frameworks & Deployment Tools",
    icon: "rocket",
    items: ["Streamlit", "Flask", "Docker", "Git", "Linux/Bash"]
  },
  {
    group: "ML/NLP Foundations & Core Languages",
    icon: "code",
    items: ["Python", "Scikit-learn", "Hugging Face Transformers", "SQL", "Bash"]
  },
  {
    group: "Data Engineering & Databases",
    icon: "chart",
    items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "MySQL", "MongoDB"]
  }
];

/* ------------------------------------------------------------------
 *  PROJECTS (4). Each uses LINKS.demo{n} for optional live demo.
 * ------------------------------------------------------------------ */
const projects = [
  {
    title: "MehadiAI",
    subtitle: "Retrieval-Augmented Agent Toolkit",
    summary:
      "A modular RAG-based agent toolkit for building LLM-powered applications with tool/plugin integrations and semantic document search.",
    bullets: [
      "Architected a modular RAG-based agent toolkit for building LLM-powered applications with tool/plugin integrations and semantic document search.",
      "Built Python backend services and a responsive front-end to deliver interactive, LLM-driven assistants and automation workflows.",
      "Designed reusable components for connector integrations, retrieval pipelines, and multi-step agent orchestration."
    ],
    tags: ["LangGraph", "RAG", "Python", "Vector Search"],
    flow: ["Documents", "Embeddings", "Vector Search", "LLM Agent", "Tools"],
    github: "https://github.com/Mehadii-Hassan/MehadiAI",
    demo: LINKS.demo1
  },
  {
    title: "Multi-Agent Research System",
    subtitle: "Coordinated LLM Agents for Research",
    summary:
      "A multi-agent AI system coordinating several LLM agents to perform automated web search, scraping, and structured report generation.",
    bullets: [
      "Engineered a multi-agent AI system coordinating several LLM agents to perform automated web search, scraping, and structured report generation.",
      "Implemented agent orchestration and inter-agent workflows with LangChain, enabling live retrieval and automated critique between agents.",
      "Built a Streamlit interface exposing the multi-agent pipeline as a usable, end-to-end AI application."
    ],
    tags: ["LangChain", "Streamlit", "Multi-Agent"],
    flow: ["Search", "Scrape", "Writer Agent", "Critic Agent", "Report"],
    github: "https://github.com/Mehadii-Hassan/Multi-Agent-Research-System",
    demo: LINKS.demo2
  },
  {
    title: "Medical Chatbot",
    subtitle: "Domain-Specific RAG Chatbot",
    summary:
      "A production-style RAG chatbot combining LangChain orchestration, Pinecone vector search, and Groq-hosted LLMs for domain-specific Q&A.",
    bullets: [
      "Built a production-style RAG chatbot combining LangChain orchestration, Pinecone vector search, and Groq-hosted LLMs for domain-specific Q&A.",
      "Integrated Hugging Face embeddings to ground LLM responses in retrieved medical documents, reducing hallucination risk.",
      "Implemented the full AI application stack: data ingestion, indexing, retrieval, and conversational interface, end to end."
    ],
    tags: ["LangChain", "Pinecone", "Groq", "Hugging Face"],
    flow: ["Medical Docs", "HF Embeddings", "Pinecone", "Groq LLM", "Answer"],
    github: "https://github.com/Mehadii-Hassan/Medical-Chatbot",
    demo: LINKS.demo3
  },
  {
    title: "Personal Voice Assistant System",
    subtitle: "Voice-Powered AI Assistant",
    summary:
      "An AI-powered voice assistant integrating speech recognition, text-to-speech, and Google Generative AI for natural conversational interaction.",
    bullets: [
      "Built an AI-powered voice assistant integrating speech recognition, text-to-speech, and Google Generative AI for natural conversational interaction.",
      "Engineered command-parsing and action-execution modules enabling web automation, Wikipedia search, music playback, and task execution.",
      "Focused on reliable audio I/O and an extendable architecture for adding new AI-driven capabilities."
    ],
    tags: ["Python", "Gemini", "Speech Recognition", "TTS"],
    flow: ["Speech", "Command Parser", "Gemini", "Actions", "Voice Reply"],
    github: "https://github.com/Mehadii-Hassan/Personal-Voice-Assistant-System",
    demo: LINKS.demo4
  }
];

/* ------------------------------------------------------------------
 *  EDUCATION
 * ------------------------------------------------------------------ */
const education = {
  school: "IUBAT – International University of Business Agriculture and Technology",
  degree: "Bachelor of Science in Computer Science and Engineering (CSE)"
};

/* ------------------------------------------------------------------
 *  CERTIFICATIONS
 * ------------------------------------------------------------------ */
const certifications = [
  {
    title: "AI Agent Development Bootcamp for Programmers",
    issuer: "Ostad",
    link: LINKS.cert1
  },
  {
    title: "Full Stack Data Science with Generative AI",
    issuer: "InceptionBD",
    link: LINKS.cert2
  }
];

/* ------------------------------------------------------------------
 *  NAVIGATION links
 * ------------------------------------------------------------------ */
const navLinks = [
  { label: "About", target: "#about" },
  { label: "Skills", target: "#skills" },
  { label: "Projects", target: "#projects" },
  { label: "Terminal", target: "#terminal" },
  { label: "Education", target: "#education" },
  { label: "Contact", target: "#contact" }
];

/* ------------------------------------------------------------------
 *  DATA namespace — convenient single accessor used by main.js.
 *  (Below name is also accessible directly as its own const above.)
 * ------------------------------------------------------------------ */
const DATA = {
  nav: navLinks,
  profile: PROFILE,
  heroTyping: heroTyping,
  heroIntro: heroIntro,
  aboutText: aboutText,
  skills: skills,
  projects: projects,
  education: education,
  certifications: certifications
};