import type { CvData } from './types';

const cvData: CvData = {
  personal: {
    name: 'Abdel-Rahman Abdel-Monsef',
    title: 'Computers & Systems Engineer | Web Developer & Cybersecurity Enthusiast',
    location: 'Cairo, Egypt',
    phones: ['+20 127 286 2660', '+20 102 070 8385'],
    email: 'abdelmonsef349@gmail.com',
    linkedIn: 'https://www.linkedin.com/in/abdelrhman-abdelmonsef-48aa281ab/',
    github: 'https://github.com/abdelrhmanabdelmonsef',
    htb: 'https://profile.hackthebox.com/profile/019e8056-cb46-73e2-a8ce-09c8b8aceb7d',
    tryHackMe: 'https://tryhackme.com/p/0xTDS'
  },

  summary:
    'Highly motivated Computers & Systems Engineering graduate with growing hands-on experience in modern web development — especially TypeScript, JavaScript, Node.js, Express, NestJS, and Next.js — combined with a proven foundation in web application penetration testing from a dedicated cybersecurity internship. I am building solid backend and frontend skills through asynchronous Node.js patterns, REST APIs, middleware, and module-based architecture, while maintaining strong interest in cybersecurity, secure coding, and OWASP-aware web application security. Known for problem-solving, teamwork, and a fast-learning mindset.',

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
      id: 'proj-ocean67',
      title: '🚀 Ocean67 Fulfillment Platform',
      link: 'https://github.com/abdelrhmanabdelmonsef',
      description:
        'Built a full-stack TypeScript/NestJS/Next.js platform for secure digital-goods fulfillment with webhook ingestion, async BullMQ workers, RBAC, PostgreSQL/Redis workflows, provider integration logic, and ~85 automated tests.',
      tags: ['TypeScript', 'NestJS', 'Next.js', 'BullMQ', 'PostgreSQL', 'Redis', 'Webhook Security', 'RBAC', 'Jest'],
      featuredTags: ['TypeScript', 'NestJS']
    }
  ],

  skillCategories: [
    {
      id: 'skill-web-security',
      title: 'Web Security',
      color: 'green',
      tags: ['Penetration Testing', 'OWASP Top 10', 'SQL Injection', 'XSS', 'SSRF', 'Auth Bypass', 'Access Control', 'CSRF', 'IDOR', 'Secure Coding']
    },
    {
      id: 'skill-tools',
      title: 'Pentesting Tools',
      color: 'blue',
      tags: ['Burp Suite', 'Nmap', 'Metasploit', 'OWASP ZAP', 'Wireshark', 'Dirbuster', 'SQLMap', 'Gobuster', 'Hydra']
    },
    {
      id: 'skill-os',
      title: 'Operating Systems',
      color: 'purple',
      tags: ['Kali Linux', 'Parrot OS', 'Red Hat Linux', 'Debian', 'Windows Server', 'Windows Client']
    },
    {
      id: 'skill-networking',
      title: 'Networking & Code',
      color: 'gray',
      tags: ['TCP/IP', 'Routing & Switching', 'Python', 'Bash Scripting', 'Java', 'JavaScript', 'SQL / MySQL', 'Git']
    },
    {
      id: 'skill-backend-devops',
      title: 'Backend & DevOps',
      color: 'blue',
      tags: ['NestJS', 'TypeORM', 'PostgreSQL', 'Redis', 'BullMQ', 'Docker Compose', 'Nx', 'pnpm', 'Jest', 'Testcontainers']
    },
    {
      id: 'skill-web-dev',
      title: 'Web Development',
      color: 'green',
      tags: ['TypeScript', 'React', 'Tailwind CSS', 'JavaScript', 'Node.js', 'Express.js', 'Asynchronous JS', 'Express Middleware', 'Route Params', 'NestJS', 'Next.js'],
      progress: [
        { name: 'TypeScript', label: 'Upper Basic', width: 72 },
        { name: 'JavaScript', label: 'Mid Level', width: 65 },
        { name: 'Node.js', label: 'Mid Level', width: 60 },
        { name: 'NestJS', label: 'Intermediate', width: 55 }
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
          url: '/HTB%20Academy%20Student%20Transcript.pdf',
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
        { label: 'Academy', value: '6' },
        { label: 'Labs', value: '0' }
      ],
      transcriptUrl: '/HTB%20Academy%20Student%20Transcript.pdf',
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
  matrix     - Toggle low-overhead matrix rain background.
  clear      - Flush terminal logs.`,

    whoami: `[+] OPERATIVE IDENTITY DOSSIER:
=======================================
  Name:        Abdel-Rahman Abdel-Monsef
  Title:       Computers & Systems Engineer | Cybersecurity Specialist
  Specialty:   Web Application Penetration Testing & Secure Code Analysis
  HTB Handle:  @0xMonsef
  THM Handle:  @0xTDS
  Clearance:   Level 1 Guest (Recruiter)
  Status:      Active - Seeking Global Opportunities
  Objective:   Acquire robust certifications (OSCP / eWAPT) & secure critical systems.`,

    skills: `[+] CONFIDENCE & CAPABILITY MAPPING [100pt Max]:
===================================================
  Web Application Pentesting   [████████████████░░░] 85%
  Vulnerability Scanning       [█████████████████░░] 90%
  Burp Suite & Nmap API        [█████████████████░░] 90%
  Linux Server Administration  [███████████████░░░░] 78%
  Python & Bash Security Script[████████████████░░░] 80%
  Network Architecture         [██████████████░░░░░] 75%
  OWASP Top 10 Exploitation    [█████████████████░░] 88%`,

    certs: `[+] ACADEMIC & PROFESSIONAL CREDENTIALS:
===========================================
  1. Red Hat System Administration I (RH124)  [VERIFIED - PDF READY]
  2. Google Cybersecurity Professional Cert   [VERIFIED - SUITE & SUB-COURSE CORES]
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
  - Email:      abdelmonsef349@gmail.com
  - Mobile:     +20 127 286 2660 / +20 102 070 8385`
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
