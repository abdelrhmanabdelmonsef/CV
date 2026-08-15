export type CvPersonal = {
  name: string;
  title: string;
  location: string;
  phones: string[];
  email: string;
  secondaryEmail?: string;
  linkedIn: string;
  github: string;
  htb?: string;
  tryHackMe?: string;
};

export type CvEducation = {
  degree: string;
  institution: string;
  duration: string;
  location: string;
  grade: string;
  highlights: string[];
  certificateUrl?: string;
  certificateTitle?: string;
};

export type CvExperience = {
  id: string;
  role: string;
  organization: string;
  duration: string;
  durationMonths?: string;
  status?: string;
  statusVariant?: 'green' | 'amber';
  highlights: string[];
  certificateUrl?: string;
  certificateTitle?: string;
};

export type CvProject = {
  id: string;
  title: string;
  link?: string;
  isPrivate?: boolean;
  description: string;
  tags: string[];
  featuredTags?: string[];
};

export type SkillColor = 'green' | 'blue' | 'purple' | 'gray';

export type SkillProgress = {
  name: string;
  label: string;
  width: number;
};

export type SkillCategory = {
  id: string;
  title: string;
  color: SkillColor;
  tags: string[];
  progress?: SkillProgress[];
};

export type CvCertification = {
  id: string;
  name: string;
  issuer: string;
  status: 'verified' | 'completed' | 'in_progress';
  documents?: { label: string; url: string; title: string }[];
};

export type CvPlatformBadge = {
  name: string;
  imageUrl: string;
};

export type CvPlatform = {
  id: string;
  name: string;
  emoji: string;
  handle: string;
  url: string;
  badgeUrl?: string;
  badges?: CvPlatformBadge[];
  stats?: { label: string; value: string }[];
  transcriptUrl?: string;
  transcriptTitle?: string;
};

export type CvVolunteer = {
  id: string;
  icon: string;
  role: string;
  org: string;
  period: string;
  description: string;
};

export type CvLanguage = {
  id: string;
  name: string;
  level: string;
  proficiency: number;
};

export type TerminalOutputs = Record<string, string>;

export type CvSeo = {
  title: string;
  description: string;
  keywords: string;
  ogUrl: string;
  ogImage: string;
  knowsAbout: string[];
};

export type CvResume = {
  summary: string;
  skills: string[];
  platformLine?: string;
};

export type CvData = {
  personal: CvPersonal;
  summary: string;
  resume: CvResume;
  learningHighlights: string[];
  education: CvEducation[];
  experience: CvExperience[];
  projects: CvProject[];
  skillCategories: SkillCategory[];
  certifications: CvCertification[];
  platforms: CvPlatform[];
  volunteer: CvVolunteer[];
  languages: CvLanguage[];
  contact: {
    phones: string[];
    email: string;
    secondaryEmail?: string;
    linkedIn: string;
    github: string;
    location: string;
  };
  terminal: TerminalOutputs;
  seo: CvSeo;
  footer: {
    status: string;
    location: string;
    updated: string;
  };
};
