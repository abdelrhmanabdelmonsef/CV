import type { CvData } from './types';

const cvData: CvData = {
  personal: {
    name: 'Abdel-Rahman Abdel-Monsef',
    title: 'Computers & Systems Engineer | Web Developer & Cybersecurity Enthusiast',
    location: 'Cairo, Egypt',
    phones: ['+20 127 286 2660', '+20 102 070 8385'],
    email: 'abdelmonsef349@gmail.com',
    secondaryEmail: 'abdelmonsef348@gmail.com',
    linkedIn: 'https://www.linkedin.com/in/abdelrhman-abdelmonsef-48aa281ab/',
    github: 'https://github.com/abdelrhmanabdelmonsef',
    htb: 'https://profile.hackthebox.com/profile/019e8056-cb46-73e2-a8ce-09c8b8aceb7d',
    tryHackMe: 'https://tryhackme.com/p/0xTDS'
  },

  summary:
    'Highly motivated Computers & Systems Engineering graduate with growing hands-on experience in modern web development — especially TypeScript, JavaScript, Node.js, Express, NestJS, and Next.js — combined with a proven foundation in web application penetration testing from a dedicated cybersecurity internship. I am building solid backend and frontend skills through asynchronous Node.js patterns, REST APIs, middleware, and module-based architecture, while maintaining strong interest in cybersecurity, secure coding, and OWASP-aware web application security. Known for problem-solving, teamwork, and a fast-learning mindset.',

  resume: {
    summary:
      'Computers & Systems Engineering graduate with hands-on experience in modern web development (TypeScript, Node.js, NestJS, Next.js) and a solid foundation in cybersecurity from a dedicated penetration testing internship. Applies OWASP-aware secure coding practices and is actively pursuing OSCP and eWAPT certifications.',
    skills: [
      'Web App Pentesting',
      'OWASP Top 10',
      'TypeScript',
      'Node.js',
      'Express',
      'NestJS',
      'Next.js',
      'PostgreSQL',
      'Redis',
      'BullMQ',
      'Burp Suite',
      'Nmap',
      'Kali Linux',
      'Red Hat Linux',
      'Python',
      'Bash',
      'Docker'
    ],
    platformLine: 'TryHackMe (@0xTDS) & HackTheBox (@0xMonsef — Pro Rank, 30+ Labs)'
  },

  learningHighlights: [
    'Developing large-scale TypeScript applications with secure webhook ingestion, queue-based fulfillment, and RBAC-driven operations.',
    'Focused on full-stack JavaScript with TypeScript, Node.js, Express, NestJS, and Next.js.',
    'Practicing secure web development by applying secure coding principles and OWASP-aware patterns.',
    'Building backend APIs and frontend dashboards while exploring NestJS architecture, async jobs, and modern deployment tooling.'
  ],

  education: [
    {
      degree: 'Bachelor of Science — Computers & Systems Engineering',
      institution: 'Al-Azhar University, Faculty of Computers & Systems Engineering',
      duration: 'Oct 2019 – Jun 2024',
      location: 'Cairo, Egypt',
      grade: 'Very Good (A Equivalent)',
      highlights: [
        'Strong foundation in cybersecurity, networking protocols, operating systems, and software engineering.',
        'Completed graduation project developing a cybersecurity penetration testing tool with automated scanning and reporting capabilities.'
      ],
      certificateUrl: '/certificates/graduation_cert.pdf',
      certificateTitle: 'Bachelor Degree Certificate - Al-Azhar University'
    }
  ],

  experience: [
    {
      id: 'exp-hackers-for-you',
      role: 'Penetration Tester Intern',
      organization: 'Hackers For You',
      duration: 'Feb 2024 – May 2024',
      durationMonths: '3 months',
      status: 'Completed',
      statusVariant: 'green',
      highlights: [
        'Collaborated with senior penetration testers to perform comprehensive security assessments and web application/network penetration tests.',
        'Executed targeted reconnaissance, vulnerability scanning, and manual exploitation of flaws to secure applications against OWASP Top 10 vulnerabilities.',
        'Analyzed test results, drafted detailed technical remediation reports, and presented actionable security recommendations to developers.',
        'Participated in continuous training and threat modeling sessions to align security controls with modern cybersecurity best practices.'
      ],
      certificateUrl: '/certificates/Hackers_For_you_intern_cert.png',
      certificateTitle: 'Hackers For You - Internship Certificate'
    }
  ],

  projects: [
    {
      id: 'proj-grad',
      title: '🔐 Automated Web Pentest Tool',
      link: 'https://github.com/abdelrhmanabdelmonsef/web-app-vuln-scanner',
      description:
        'Developed a custom penetration testing toolkit designed for automated web application security assessments. The tool performs reconnaissance, service enumeration, vulnerability identification, and generates structured PDF reports for remediation guidance.',
      tags: ['Python', 'Bash', 'OWASP Top 10', 'Nmap API', 'Burp API'],
      featuredTags: ['Python', 'OWASP Top 10']
    },
    {
      id: 'proj-ocean67',
      title: '🚀 Ocean67 Fulfillment Platform',
      isPrivate: true,
      description:
        'Built a full-stack TypeScript/NestJS/Next.js platform for secure digital-goods fulfillment with webhook ingestion, async BullMQ workers, RBAC, PostgreSQL/Redis workflows, provider integration logic, and ~85 automated tests.',
      tags: ['TypeScript', 'NestJS', 'Next.js', 'BullMQ', 'PostgreSQL', 'Redis', 'Webhook Security', 'RBAC', 'Jest'],
      featuredTags: ['TypeScript', 'NestJS']
    },
    {
      id: 'proj-tasks-notes',
      title: '📋 Tasks & Notes App',
      link: 'https://github.com/abdelrhmanabdelmonsef/tasks-notes-app',
      description:
        'Full-stack monorepo featuring a NestJS REST API with JWT auth, RBAC, PostgreSQL persistence via TypeORM, class-validator DTOs, bcrypt password hashing, BullMQ async queues, and a Next.js frontend scaffold.',
      tags: ['TypeScript', 'NestJS', 'Node.js', 'PostgreSQL', 'TypeORM', 'JWT', 'Passport', 'Next.js', 'Tailwind CSS'],
      featuredTags: ['TypeScript', 'NestJS']
    }
  ],

  skillCategories: [
    {
      id: 'skill-web-security',
      title: 'Web Security',
      color: 'green',
      tags: [
        'Penetration Testing',
        'OWASP Top 10 Audit',
        'Vulnerability Assessment',
        'Secure Coding',
        'RBAC & Access Control',
        'Webhook Security',
        'Account Protection',
        'Threat Modeling'
      ]
    },
    {
      id: 'skill-tools',
      title: 'Pentesting Tools',
      color: 'blue',
      tags: ['Burp Suite', 'Nmap', 'Metasploit', 'OWASP ZAP', 'Wireshark', 'SQLMap', 'Gobuster', 'Hydra', 'Dirbuster']
    },
    {
      id: 'skill-os',
      title: 'Operating Systems',
      color: 'purple',
      tags: ['Kali Linux', 'Parrot OS', 'Red Hat Linux', 'Debian', 'Windows Server']
    },
    {
      id: 'skill-networking',
      title: 'Networking & Core Code',
      color: 'gray',
      tags: ['TCP/IP Protocols', 'Routing & Switching', 'Network Security', 'Python', 'Bash Scripting', 'Java', 'Git']
    },
    {
      id: 'skill-backend-devops',
      title: 'Backend & DevOps',
      color: 'blue',
      tags: [
        'Node.js',
        'Express.js',
        'NestJS',
        'PostgreSQL',
        'TypeORM',
        'Redis',
        'BullMQ',
        'REST APIs',
        'JWT Auth',
        'Passport.js',
        'Docker Compose',
        'Jest',
        'Testcontainers',
        'Nx Workspace',
        'pnpm'
      ]
    },
    {
      id: 'skill-web-dev',
      title: 'Web Development',
      color: 'green',
      tags: ['TypeScript', 'JavaScript (ES6+)', 'Next.js', 'React', 'Tailwind CSS', 'HTML5 / CSS3'],
      progress: [
        { name: 'TypeScript', label: 'Intermediate', width: 72 },
        { name: 'JavaScript', label: 'Intermediate', width: 75 },
        { name: 'Node.js', label: 'Intermediate', width: 70 },
        { name: 'Express.js', label: 'Foundational', width: 60 },
        { name: 'NestJS', label: 'Intermediate', width: 70 },
        { name: 'Next.js', label: 'Intermediate', width: 68 }
      ]
    }
  ],

  certifications: [
    {
      id: 'cert-rhcsa',
      name: 'Red Hat System Administration I (RH124)',
      issuer: 'Red Hat Inc.',
      status: 'verified',
      documents: [
        {
          label: 'Verify',
          url: '/certificates/mlang_enCourse_Certificate_Enmlangmlang_ar___mlang.pdf',
          title: 'Red Hat System Administration I (RH124) Certificate'
        }
      ]
    },
    {
      id: 'cert-google-cyber',
      name: 'Google Cybersecurity Professional Certificate',
      issuer: 'Google & Coursera — Foundations, Managing Risk, Linux & SQL, Network Security',
      status: 'verified',
      documents: [
        { label: 'Suite Certificate', url: '/certificates/Coursera%2062QY3G5YL8MZ.pdf', title: 'Google Cybersecurity Certificate (Full Suite)' },
        { label: 'Risks', url: '/certificates/Coursera%20M7NZDA9943MN.pdf', title: 'Play It Safe: Manage Security Risks Certificate' },
        { label: 'Networks', url: '/certificates/Coursera%20M4T8D89EFANG.pdf', title: 'Connect and Protect: Network Security Certificate' },
        { label: 'Linux/SQL', url: '/certificates/Coursera%20VKAPSSTPLL5W.pdf', title: 'Tools of the Trade: Linux and SQL Certificate' }
      ]
    },
    {
      id: 'cert-mckinsey',
      name: 'McKinsey Forward Program',
      issuer: 'McKinsey & Company — Advanced Adaptability, Problem-Solving, Team Leadership',
      status: 'completed'
    },
    {
      id: 'cert-oscp-training',
      name: 'OSCP & eWAPT (Active Training)',
      issuer: 'Offensive Security & eLearnSecurity — Preparing for Exams',
      status: 'in_progress'
    },
    {
      id: 'cert-htb-academy',
      name: 'HackTheBox Academy Student Transcript',
      issuer: 'HackTheBox Academy — Active Web Security Path & Penetration Testing Modules',
      status: 'verified',
      documents: [
        {
          label: 'Verify',
          url: '/HTB_Academy_Student_Transcript.pdf',
          title: 'HackTheBox Academy Student Transcript'
        }
      ]
    }
  ],

  platforms: [
    {
      id: 'thm-card',
      name: 'TryHackMe',
      emoji: '🔴',
      handle: '@0xTDS',
      url: 'https://tryhackme.com/p/0xTDS',
      badgeUrl: 'https://tryhackme-badges.s3.amazonaws.com/0xTDS.png'
    },
    {
      id: 'htb-card',
      name: 'HackTheBox',
      emoji: '🟢',
      handle: '@0xMonsef',
      url: 'https://profile.hackthebox.com/profile/019e8056-cb46-73e2-a8ce-09c8b8aceb7d',
      badges: [
        {
          name: 'Playing with the mess',
          imageUrl: 'https://academy.hackthebox.com/storage/badges/playing-with-the-mess.png'
        },
        {
          name: 'Developer',
          imageUrl: 'https://academy.hackthebox.com/storage/badges/developer.png'
        },
        {
          name: 'Your request is my demand',
          imageUrl: 'https://academy.hackthebox.com/storage/badges/your-request-is-my-demand.png'
        },
        {
          name: 'Academician',
          imageUrl: 'https://academy.hackthebox.com/storage/badges/academician.png'
        },
        {
          name: 'Binary Duo Explorer',
          imageUrl: 'https://academy.hackthebox.com/storage/badges/0d982edba15037e6d52d54eaa7f0209a/logo.png'
        },
        {
          name: 'Cyber Rookie 365',
          imageUrl: 'https://academy.hackthebox.com/storage/badges/60fc416b5eec425a6451aeb1e50d14e4/logo.png'
        }
      ],
      stats: [
        { label: 'Rank', value: 'Pro' },
        { label: 'Labs', value: '30+' },
        { label: 'Academy', value: '6' }
      ],
      transcriptUrl: '/HTB_Academy_Student_Transcript.pdf',
      transcriptTitle: 'HackTheBox Academy Student Transcript'
    }
  ],

  volunteer: [
    {
      id: 'vol-gdsc',
      icon: '🔐',
      role: 'Vice-Head, Cybersecurity Team',
      org: 'Google Developer Student Clubs (GDSC) — Al-Azhar University',
      period: '2022 – 2024',
      description: 'Coordinated, planned, and delivered high-quality cybersecurity workshops, CTF training, and events for 150+ students.'
    },
    {
      id: 'vol-azsecs',
      icon: '🛡️',
      role: 'Vice-Head, Cybersecurity Team',
      org: 'AZ-SEnCS — Al-Azhar University',
      period: '2022 – 2024',
      description: 'Designed practical security curricula and assisted in organizing academic cybersecurity bootcamps for university students.'
    },
    {
      id: 'vol-java',
      icon: '☕',
      role: 'Member, Java Development Team',
      org: 'AZ-SEnCS — Al-Azhar University',
      period: '2021 – 2023',
      description: 'Partnered with peers to build and optimize Java-based applications, incorporating OOP design and clean coding principles.'
    }
  ],

  languages: [
    { id: 'lang-arabic', name: 'Arabic', level: 'Native / C2', proficiency: 100 },
    { id: 'lang-english', name: 'English', level: 'Professional / B2', proficiency: 75 }
  ],

  contact: {
    phones: ['+20 127 286 2660', '+20 102 070 8385'],
    email: 'abdelmonsef349@gmail.com',
    secondaryEmail: 'abdelmonsef348@gmail.com',
    linkedIn: 'https://www.linkedin.com/in/abdelrhman-abdelmonsef-48aa281ab/',
    github: 'https://github.com/abdelrhmanabdelmonsef',
    location: 'Cairo, Egypt'
  },

  terminal: {
    help: `Available Security Commands:
  help       - Display this assistance manual.
  whoami     - View profile metadata & clearance.
  skills     - Perform interactive confidence mapping.
  certs      - List encrypted academic credentials.
  socials    - Display telemetry connection coordinates.
  nmap       - Perform active local credential scan.
  exploit    - Launch simulated binary penetration matrix.
  projects   - Output major software & security engineering builds.
  exp        - View professional work history timeline.
  edu        - Inspect academic degree credentials.
  matrix     - Toggle low-overhead matrix rain background.
  clear      - Flush terminal logs.`,

    whoami: `[+] OPERATIVE IDENTITY DOSSIER:
=======================================
  Name:        Abdel-Rahman Abdel-Monsef
  Title:       Computers & Systems Engineer | Cybersecurity Specialist & Web Developer
  Specialty:   Web Application Penetration Testing, NestJS & Secure Code Analysis
  HTB Handle:  @0xMonsef (Pro Rank, 30+ Labs)
  THM Handle:  @0xTDS
  Clearance:   Level 1 Guest (Recruiter)
  Status:      Active - Seeking Global Opportunities
  Objective:   Acquire robust certifications (OSCP / eWAPT) & secure critical systems.`,

    skills: `[+] CONFIDENCE & CAPABILITY MAPPING [100pt Max]:
===================================================
  Web Application Pentesting   [████████████████░░░] 85%
  Vulnerability Assessment     [█████████████████░░] 90%
  Burp Suite & Nmap API        [█████████████████░░] 90%
  TypeScript & NestJS Dev      [██████████████░░░░░] 72%
  Linux Server Administration  [███████████████░░░░] 78%
  Python & Bash Automation     [████████████████░░░] 80%
  OWASP Top 10 Exploitation    [█████████████████░░] 88%`,

    certs: `[+] ACADEMIC & PROFESSIONAL CREDENTIALS:
===========================================
  1. Red Hat System Administration I (RH124)  [VERIFIED - PDF READY]
  2. Google Cybersecurity Professional Cert   [VERIFIED - SUITE & SUB-COURSES]
  3. McKinsey Forward Program                 [VERIFIED - COMPLETED]
  4. OSCP & eWAPT Training                    [ONGOING - PREPARATION PHASE]
  5. HackTheBox Academy Student Transcript    [VERIFIED - PDF READY]
  *(Type 'nmap' to trigger an active scan/verification)*`,

    socials: `[+] TELEMETRY CONNECTION COORDINATES:
========================================
  - LinkedIn:   abdelrhman-abdelmonsef
  - GitHub:     abdelrhmanabdelmonsef
  - HTB:        @0xMonsef
  - TryHackMe:  @0xTDS
  - Emails:     abdelmonsef349@gmail.com / abdelmonsef348@gmail.com
  - Mobiles:    +20 127 286 2660 / +20 102 070 8385`,

    nmap: `[+] STARTING NMAP SCAN v7.94 AT LOCAL TARGET
==================================================
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 8.9p1 Ubuntu
80/tcp   open  http        Next.js 16 Web Engine
443/tcp  open  ssl/https   NestJS Secure API Gateway
5432/tcp open  postgresql  PostgreSQL 18 Operational DB
6379/tcp open  redis       Redis Idempotency Nonce Store
--------------------------------------------------
[✓] SCAN COMPLETE: 0 VULNERABILITIES DETECTED. ALL SHIELD MATRIXES OPERATIONAL.`,

    exploit: `[!] INITIATING SIMULATED BINARY PENETRATION MATRIX...
[+] TARGET: Vulnerability Assessment Engine
[+] STAGE 1: Reconnaissance & Subdomain Enumeration ... PASS
[+] STAGE 2: OWASP Top 10 Vulnerability Audit ... PASS
[+] STAGE 3: RBAC & Webhook Idempotency Verification ... PASS
[✓] EXPLOIT SIMULATION SUCCESSFUL: SECURE ARCHITECTURE VERIFIED. SYSTEM STABLE.`,

    projects: `[+] KEY ENGINEERING & SECURITY PROJECTS:
===========================================
  1. 🔐 Automated Web Pentest Tool (Graduation Project)
     - Python, Bash, OWASP Top 10, Nmap & Burp APIs.
     - Repo: https://github.com/abdelrhmanabdelmonsef/web-app-vuln-scanner
  2. 🚀 Ocean67 Fulfillment Platform
     - Full-stack NestJS/Next.js/BullMQ/PostgreSQL digital-goods fulfillment.
     - Repo: Private Repository
  3. 📋 Tasks & Notes App
     - NestJS REST API, JWT, RBAC, TypeORM, PostgreSQL, class-validator, Next.js.
     - Repo: https://github.com/abdelrhmanabdelmonsef/tasks-notes-app`,

    exp: `[+] WORK HISTORY DOSSIER:
===========================
  Role:         Penetration Tester Intern
  Company:      Hackers For You
  Duration:     Feb 2024 – May 2024 (3 months)
  Highlights:   Web App & Network Pentesting, OWASP Top 10 Remediation, Technical Security Reports.`,

    edu: `[+] ACADEMIC CREDENTIALS:
============================
  Degree:       B.Sc. Computers & Systems Engineering
  Institution:  Al-Azhar University, Faculty of Computers & Systems Engineering
  Duration:     Oct 2019 – Jun 2024 | Cairo, Egypt
  Grade:        Very Good (Grade A Equivalent)`
  },

  seo: {
    title: 'Abdel-Rahman Abdel-Monsef | Web Developer & Cybersecurity Enthusiast',
    description:
      'Professional portfolio of Abdel-Rahman Abdel-Monsef — Computers & Systems Engineering graduate with growing experience in modern web development and cybersecurity.',
    keywords:
      'Web Developer, TypeScript, JavaScript, Node.js, Express, NestJS, Next.js, Cybersecurity, Egypt, Portfolio',
    ogUrl: 'https://github.com/abdelrhmanabdelmonsef/CV',
    ogImage: '/photo/pic.jpg',
    knowsAbout: [
      'Web Development',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Express',
      'NestJS',
      'Next.js',
      'Cybersecurity',
      'Network Security',
      'Linux Administration',
      'Python',
      'Bash',
      'Vulnerability Assessment'
    ]
  },

  footer: {
    status: 'Operational Status: Ready for Deployments',
    location: 'Located in Cairo, Egypt',
    updated: 'Updated: May 2026'
  }
};

export default cvData;
