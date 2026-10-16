/* =====================================================================
   MODEL — the data and state of the app. Never touches the DOM.
   Edit your content here: featured projects, skills, image overrides.
   ===================================================================== */

const Model = {

  githubUser: "not-umesh",

  // Where the contact form delivers (via formsubmit.co relay)
  contactEmail: "umeshverma.mv@gmail.com",

  // App state (read/written by the Controller, displayed by the View)
  state: {
    screen: "home",        // which screen is showing
    menuIndex: 0,          // selected item on the home menu
    reposLoaded: false,
    skillsBuilt: false,
  },

  // ---- Featured projects (hand-written, shown above the GitHub feed) ----
  featured: [
    {
      title: "DISASTER MANAGEMENT SYSTEM",
      tag: "Flutter", color: "#3ddcff", live: false,
      url: "https://github.com/not-umesh/Disaster_Management_System",
      cta: "View on GitHub →",
      desc: "Comprehensive disaster-management app with an integrated AI chatbot for emergency assistance, real-time alerts and crisis coordination.",
    },
    {
      title: "AI DISASTER CHATBOT BACKEND",
      tag: "Java", color: "#f1a05a",
      url: "https://github.com/not-umesh/Disaster_Management_chatbot",
      cta: "View on GitHub →",
      desc: "Spring Boot backend powering the AI chatbot — intelligent responses for emergency situations and crisis guidance.",
    },
    {
      title: "AI HANDWRITTEN MATH SOLVER",
      tag: "Full Stack AI", color: "#ffd166",
      url: "https://github.com/not-umesh/AI_HandWritten_Math_Solver_fullstack",
      cta: "View on GitHub →",
      desc: "Full-stack app that recognizes handwritten mathematical expressions and solves them using computer vision and machine learning.",
    },
    {
      title: "MINDBUDDY CHATBOT",
      tag: "Mental Health", color: "#ff7eb6",
      url: "https://github.com/not-umesh/MindBuddy-ai_mentalhealth_chatbot",
      cta: "View on GitHub →",
      desc: "An empathetic AI-powered mental health companion offering supportive conversations and wellness resources.",
    },
    {
      title: "DEEPFAKE DETECTOR",
      tag: "Security", color: "#b28dff",
      url: "https://github.com/not-umesh/DeepFakeDetector",
      cta: "View on GitHub →",
      desc: "Web app that detects deepfake media with rate limiting, input validation and secure API integration for accurate analysis.",
    },
    {
      title: "REAL-TIME NETWORK IDS",
      tag: "Cybersecurity", color: "#7bffb0",
      url: "https://github.com/not-umesh/Real-Time-Network-Intrusion-Detection-System-IDS-",
      cta: "View on GitHub →",
      desc: "Suricata-backed ML intrusion detection system optimized for Apple Silicon with sub-1ms CoreML inference.",
    },
    {
      title: "KISHAN-MITRA",
      tag: "Agritech", color: "#9dff5a",
      url: "https://github.com/not-umesh/kishan-mitra",
      cta: "View on GitHub →",
      desc: "Free-tier mobile app giving Indian farmers live weather, mandi prices and AI-powered agricultural advice.",
    },
  ],

  // Repos already shown in "featured" (or not worth showing) get hidden from the GitHub feed
  featuredRepoNames: [
    "Disaster_Management_System",
    "Disaster_Management_chatbot",
    "AI_HandWritten_Math_Solver_fullstack",
    "MindBuddy-ai_mentalhealth_chatbot",
    "DeepFakeDetector",
    "Real-Time-Network-Intrusion-Detection-System-IDS-",
    "kishan-mitra",
    "not-umesh",            // profile README repo
    "uv.portfolio",         // this website itself
    "learningtimepass",
  ],

  // Shown if the GitHub API can't be reached
  fallbackRepos: [
    {
      name: "Pashu-Nirikshak-Prototype", language: "TypeScript", stargazers_count: 0,
      html_url: "https://github.com/not-umesh/Pashu-Nirikshak-Prototype",
      description: "Smart India Hackathon 2026 livestock monitoring system — health and activity tracking for cattle with real-time alerts.",
    },
    {
      name: "voice-to-notes-app", language: "TypeScript", stargazers_count: 0,
      html_url: "https://github.com/not-umesh/voice-to-notes-app",
      description: "React Native app using Whisper AI to transcribe and summarize classroom lectures into organized, actionable study notes.",
    },
    {
      name: "ResQ_personal-safety-emergency-app", language: "TypeScript", stargazers_count: 0,
      html_url: "https://github.com/not-umesh/ResQ_personal-safety-emergency-app",
      description: "Personal safety and emergency response app with one-tap SOS, live location sharing and trusted-contact alerts.",
    },
    {
      name: "Group-expense-splitter-android-app", language: "TypeScript", stargazers_count: 0,
      html_url: "https://github.com/not-umesh/Group-expense-splitter-android-app",
      description: "Split group expenses fairly — track shared spending, balances and settlements across friends.",
    },
    {
      name: "Automated-Agentic-Workflow", language: "Python", stargazers_count: 0,
      html_url: "https://github.com/not-umesh/Automated-Agentic-Workflow",
      description: "Automated multi-step agentic workflow orchestrating LLM-powered tools to complete complex tasks end to end.",
    },
  ],

  // Optional thumbnail overrides: repo name → image path.
  // Anything not listed is looked up at assets/projects/<RepoName>.png
  projectImages: {},

  langColors: {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
    Dart: "#00B4AB", Java: "#b07219", HTML: "#e34c26", CSS: "#663399",
    "Jupyter Notebook": "#DA5B0B", C: "#555", "C++": "#f34b7d",
  },

  // ---- Skills screen ----
  skills: [
    { group: "AI · Machine Learning", items: [
      ["Python", 88], ["Machine Learning", 85],
      ["TensorFlow · Deep Learning", 80], ["Data Analysis", 78],
      ["AI Chatbots · Whisper", 84],
    ]},
    { group: "Web · Mobile", items: [
      ["JavaScript · TypeScript", 86], ["React · Next.js", 84],
      ["React Native · Flutter", 82], ["HTML5 · CSS3", 90],
    ]},
    { group: "Backend · Tools", items: [
      ["Node.js", 80], ["MongoDB", 76],
      ["Java · Spring Boot", 70], ["Git · GitHub", 88],
    ]},
  ],

  // ---- Achievements (About screen stamps) ----
  achievements: [
    "Smart India Hackathon 2026",
    "ISRO Bharatiya Antariksh Hackathon",
    "AppMaking Merit Award",
    "MY Bharat Budget Quest — Finalist",
  ],

  // ---- Data fetching ----
  async fetchRepos() {
    const skip = new Set(this.featuredRepoNames);
    try {
      const res = await fetch(
        `https://api.github.com/users/${this.githubUser}/repos?per_page=100&sort=updated`
      );
      if (!res.ok) throw new Error(res.status);
      const repos = (await res.json()).filter(r => !r.fork && !skip.has(r.name));
      return { repos, live: true };
    } catch {
      return { repos: this.fallbackRepos.filter(r => !skip.has(r.name)), live: false };
    }
  },
};
