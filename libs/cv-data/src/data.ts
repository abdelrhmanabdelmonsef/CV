import type { CvData } from './types';

const cvData: CvData = {
  personal: {
    name: 'Abdel-Rahman Abdel-Monsef',
    title: 'Software Engineer | Scalable Backend & Distributed Systems | AppSec',
    location: 'Cairo, Egypt',
    phones: ['+20 127 286 2660', '+20 102 070 8385'],
    email: 'a.abdelmonsef@kneraflow.com',
    secondaryEmail: 'abdelmonsef349@gmail.com',
    linkedIn: 'https://www.linkedin.com/in/abdelrhman-abdelmonsef-48aa281ab/',
    github: 'https://github.com/abdelrhmanabdelmonsef',
    htb: 'https://profile.hackthebox.com/profile/019e8056-cb46-73e2-a8ce-09c8b8aceb7d',
    tryHackMe: 'https://tryhackme.com/p/0xTDS',
    militaryStatus: 'Completed / Exempted'
  },

  summary:
    'Software Engineer with a Bachelor’s in Computers & Systems Engineering (Al-Azhar University), specializing in scalable TypeScript/Node.js backend architectures, NestJS microservices, and modern Next.js applications. Experienced in engineering resilient distributed systems featuring asynchronous worker queues (BullMQ/Redis), multi-tenant PostgreSQL schemas, and secure payment/telecom webhook ingestion. Combines enterprise full-stack development with an offensive security foundation (OWASP Top 10, penetration testing, secure code review) to build hardened, production-ready platforms.',

  resume: {
    summary:
      'Software Engineer with a Bachelor’s in Computers & Systems Engineering, specializing in scalable Node.js/NestJS backend architectures, TypeScript, and modern Next.js applications. Experienced in designing resilient distributed systems featuring asynchronous queues (BullMQ/Redis), multi-tenant PostgreSQL persistence, and secure webhook pipelines. Combines full-stack development expertise with an offensive security foundation (OWASP Top 10, penetration testing, secure code review) to deliver hardened, production-ready software.',
    skills: [
      'TypeScript',
      'Node.js',
      'NestJS',
      'Next.js (App Router)',
      'Express.js',
      'PostgreSQL',
      'Redis',
      'BullMQ',
      'Docker Compose',
      'RESTful APIs',
      'TypeORM',
      'Microservices',
      'Jest',
      'Testcontainers',
      'Web App Pentesting',
      'OWASP Top 10',
      'Burp Suite',
      'Red Hat Linux (RH124)',
      'Kali Linux',
      'Python',
      'Bash'
    ],
    platformLine: 'TryHackMe (@0xTDS) & HackTheBox (@0xMonsef — Pro Rank, 30+ Labs)'
  },

  learningHighlights: [
    'Designing high-throughput TypeScript/Node.js architectures with decoupled BullMQ worker pipelines and Redis caching.',
    'Engineering multi-tenant relational databases in PostgreSQL with UUIDv7 primary keys and composite idempotency constraints.',
    'Hardening full-stack web applications against OWASP Top 10 vulnerabilities (BOLA/IDOR, SQLi, CSRF, broken access control).',
    'Building high-performance bilingual (Arabic RTL & English) administrative dashboards with Next.js 16 App Router and Tailwind CSS.'
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
      id: 'exp-kneraflow',
      role: 'Software Engineer',
      organization: 'Kneraflow (kneraflow.com)',
      duration: 'Sep 2026 – Present',
      status: 'Present',
      statusVariant: 'green',
      highlights: [
        'Architecting production-grade RESTful APIs and distributed backend services in TypeScript/Node.js, optimizing endpoint latency and database query efficiency.',
        'Designing asynchronous job pipelines and event-driven workflows, ensuring resilient background processing and reliable third-party integrations.',
        'Applying security-first engineering patterns across microservices, conducting internal code audits for authorization controls, input sanitization, and rate limiting.',
        'Collaborating across engineering cycles to maintain high-reliability cloud deployments, automated testing, and maintainable modular codebases.'
      ]
    },
    {
      id: 'exp-smaww-fullstack',
      role: 'Full-Stack Developer Intern (AI-Driven)',
      organization: 'Smaww (smaww.net)',
      duration: 'Jun 2026 – Sep 2026',
      durationMonths: '3 months',
      status: 'Completed',
      statusVariant: 'green',
      highlights: [
        'Architected asynchronous fulfillment pipelines using NestJS, BullMQ, and Redis for the Ocean67 digital fulfillment platform, decoupling webhook ingestion from provider fulfillment across 10+ third-party APIs (Salla, STC, Taqnyat SMS).',
        'Designed multi-tenant PostgreSQL data architecture utilizing time-ordered UUIDv7 primary keys, composite uniqueness constraints for webhook idempotency, and AES-256-GCM encryption for stored provider credentials.',
        'Implemented comprehensive testing and observability suites with ~85 automated unit and integration tests (Jest & Testcontainers), Prometheus metrics (prom-client), and structured Pino logging with correlation IDs.',
        'Developed high-performance bilingual (Arabic RTL / English) operations and admin dashboards using Next.js 16 (App Router), Tailwind CSS, and Zod-validated server actions with granular RBAC permissions.'
      ]
    },
    {
      id: 'exp-hackers-for-you',
      role: 'Penetration Tester Intern',
      organization: 'Hackers For You',
      duration: 'Feb 2024 – May 2024',
      durationMonths: '3 months',
      status: 'Completed',
      statusVariant: 'green',
      highlights: [
        'Executed comprehensive web application penetration tests and vulnerability assessments across staging and production client environments.',
        'Identified and demonstrated exploitation of critical OWASP Top 10 vulnerabilities, including Broken Object-Level Authorization (BOLA), IDOR, SQL injection, and CSRF.',
        'Drafted actionable technical remediation roadmaps and paired directly with software engineers to patch vulnerabilities and implement secure authorization patterns.',
        'Conducted threat modeling and secure code reviews to align application controls with modern enterprise cybersecurity standards.'
      ],
      certificateUrl: '/certificates/Hackers_For_you_intern_cert.png',
      certificateTitle: 'Hackers For You - Internship Certificate'
    }
  ],

  projects: [
    {
      id: 'proj-ocean67',
      title: '🚀 Ocean67 Fulfillment Platform',
      associatedWith: 'Smaww Internship',
      isPrivate: true,
      description:
        'Unified digital-goods fulfillment platform monorepo engineered at Smaww (smaww.net). Built with TypeScript, NestJS, and Next.js 16 App Router, featuring secure webhook ingestion, async BullMQ workers, multi-tenant PostgreSQL with UUIDv7, AES-256-GCM encrypted credentials, granular RBAC, and ~85 automated tests with Jest & Testcontainers.',
      tags: ['TypeScript', 'NestJS', 'Next.js 16', 'BullMQ', 'Redis', 'PostgreSQL', 'UUIDv7', 'Webhook Security', 'RBAC', 'Jest', 'Testcontainers'],
      featuredTags: ['TypeScript', 'NestJS', 'Next.js 16', 'BullMQ']
    },
    {
      id: 'proj-tasks-notes',
      title: '📋 Tasks & Notes App',
      link: 'https://github.com/abdelrhmanabdelmonsef/tasks-notes-app',
      description:
        'Full-stack monorepo featuring a NestJS REST API with JWT authentication (access & refresh tokens), RBAC, PostgreSQL persistence via TypeORM, class-validator DTOs, bcrypt password hashing, BullMQ asynchronous queues, and a responsive Next.js frontend scaffold.',
      tags: ['TypeScript', 'NestJS', 'Node.js', 'PostgreSQL', 'TypeORM', 'BullMQ', 'JWT / RBAC', 'Next.js', 'Tailwind CSS'],
      featuredTags: ['TypeScript', 'NestJS', 'PostgreSQL']
    },
    {
      id: 'proj-grad',
      title: '🔐 Automated Web Pentest Tool',
      link: 'https://github.com/abdelrhmanabdelmonsef/web-app-vuln-scanner',
      description:
        'Custom automated penetration testing toolkit developed for university graduation project. Performs multi-stage reconnaissance, port discovery, OWASP Top 10 vulnerability scanning, and automated structured remediation report generation in Python and Bash.',
      tags: ['Python', 'Bash Scripting', 'OWASP Top 10', 'Nmap API', 'Burp API', 'Linux'],
      featuredTags: ['Python', 'OWASP Top 10']
    }
  ],

  skillCategories: [
    {
      id: 'skill-backend-systems',
      title: 'Backend & Distributed Systems',
      color: 'blue',
      tags: [
        'Node.js',
        'NestJS',
        'Express.js',
        'TypeScript',
        'BullMQ',
        'Redis',
        'RESTful APIs',
        'Microservices',
        'Webhook Architecture',
        'Event-Driven Systems'
      ]
    },
    {
      id: 'skill-db-infra',
      title: 'Databases & Data Architecture',
      color: 'purple',
      tags: [
        'PostgreSQL',
        'TypeORM',
        'UUIDv7',
        'Database Migrations',
        'Redis Caching',
        'Idempotency Nonces',
        'Multi-Tenancy',
        'Data Encryption (AES-256-GCM)'
      ]
    },
    {
      id: 'skill-frontend',
      title: 'Frontend & UI Architecture',
      color: 'green',
      tags: [
        'Next.js 16 (App Router)',
        'React 19',
        'Tailwind CSS',
        'Zod Validation',
        'React Hook Form',
        'Zustand',
        'Arabic RTL & English i18n',
        'Radix UI / shadcn'
      ]
    },
    {
      id: 'skill-web-security',
      title: 'Application Security & Systems',
      color: 'green',
      tags: [
        'OWASP Top 10 Auditing',
        'Web App Pentesting',
        'Secure Code Review',
        'RBAC & Access Control',
        'JWT / OAuth2 Strategies',
        'Burp Suite',
        'Nmap',
        'Kali Linux',
        'Red Hat Enterprise Linux'
      ]
    },
    {
      id: 'skill-devops-testing',
      title: 'DevOps, Testing & Observability',
      color: 'blue',
      tags: [
        'Docker Compose',
        'Jest',
        'Testcontainers',
        'Prometheus (prom-client)',
        'Structured Pino Logging',
        'Git & GitHub Workflows',
        'Linux Server Administration',
        'Nx Monorepo'
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
    email: 'a.abdelmonsef@kneraflow.com',
    secondaryEmail: 'abdelmonsef349@gmail.com',
    linkedIn: 'https://www.linkedin.com/in/abdelrhman-abdelmonsef-48aa281ab/',
    github: 'https://github.com/abdelrhmanabdelmonsef',
    location: 'Cairo, Egypt',
    militaryStatus: 'Completed / Exempted'
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
  Title:       Software Engineer | Full-Stack & Backend Systems
  Company:     Kneraflow (kneraflow.com)
  Specialty:   Full-Stack Systems, NestJS, Secure APIs & Web App Pentesting
  HTB Handle:  @0xMonsef (Pro Rank, 30+ Labs)
  THM Handle:  @0xTDS
  Clearance:   Level 1 Guest (Recruiter)
  Status:      Active — Software Engineer @ Kneraflow
  Objective:   Build resilient, scalable architectures & secure critical systems.`,

    skills: `[+] CONFIDENCE & CAPABILITY MAPPING [100pt Max]:
===================================================
  Web Application Pentesting   [████████████████░░░] 85%
  Vulnerability Assessment     [█████████████████░░] 90%
  Burp Suite & Nmap API        [█████████████████░░] 90%
  TypeScript & NestJS Dev      [████████████████░░░] 82%
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
  - Work Email: a.abdelmonsef@kneraflow.com
  - Personal:   abdelmonsef349@gmail.com
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
  1. Software Engineer @ Kneraflow (Sep 2026 – Present)
     - Full-Stack & Backend Systems, REST APIs, Asynchronous Worker Pipelines.
  2. Full-Stack Developer Intern @ Smaww (Jun 2026 – Sep 2026)
     - AI-Driven Workflow, Ocean67 Fulfillment Platform, NestJS & Next.js.
  3. Penetration Tester Intern @ Hackers For You (Feb 2024 – May 2024)
     - Web App & Network Pentesting, OWASP Top 10 Remediation.`,

    edu: `[+] ACADEMIC CREDENTIALS:
============================
  Degree:       B.Sc. Computers & Systems Engineering
  Institution:  Al-Azhar University, Faculty of Computers & Systems Engineering
  Duration:     Oct 2019 – Jun 2024 | Cairo, Egypt
  Grade:        Very Good (Grade A Equivalent)`
  },

  seo: {
    title: 'Abdel-Rahman Abdel-Monsef | Software Engineer | Full-Stack & Backend Systems',
    description:
      'Professional portfolio of Abdel-Rahman Abdel-Monsef — Software Engineer at Kneraflow specializing in modern full-stack development, distributed backend systems, and cybersecurity.',
    keywords:
      'Software Engineer, Kneraflow, TypeScript, JavaScript, Node.js, Express, NestJS, Next.js, Backend Developer, Cybersecurity, Egypt, Portfolio',
    ogUrl: 'https://github.com/abdelrhmanabdelmonsef/CV',
    ogImage: '/photo/pic.jpg',
    knowsAbout: [
      'Full-Stack Development',
      'Backend Architecture',
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
    updated: 'Updated: September 2026'
  }
};

export default cvData;
