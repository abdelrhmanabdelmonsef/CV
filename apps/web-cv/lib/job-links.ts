/**
 * Link utilities and platform registry for external job application and resilient search fallbacks.
 * Supports 18+ global, regional, remote, and freelance platforms.
 */

export interface PlatformBrand {
  name: string;
  arabicName?: string;
  domain: string;
  category: 'corporate' | 'remote' | 'freelance';
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  buildSearchUrl: (title: string, company?: string) => string;
}

export const SUPPORTED_PLATFORMS: Record<string, PlatformBrand> = {
  glassdoor: {
    name: 'Glassdoor',
    arabicName: 'جلاس دور',
    domain: 'glassdoor.com',
    category: 'corporate',
    badgeBg: 'bg-[#0caa41]/10',
    badgeBorder: 'border-[#0caa41]/40',
    badgeText: 'text-[#0caa41]',
    buildSearchUrl: (title, company) =>
      `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent([title, company].filter(Boolean).join(' '))}`
  },
  nafezly: {
    name: 'Nafezly',
    arabicName: 'نفذلي',
    domain: 'nafezly.com',
    category: 'freelance',
    badgeBg: 'bg-[#8b5cf6]/10',
    badgeBorder: 'border-[#8b5cf6]/40',
    badgeText: 'text-[#a78bfa]',
    buildSearchUrl: (title) =>
      `https://nafezly.com/projects?q=${encodeURIComponent(title)}`
  },
  forasna: {
    name: 'Forasna',
    arabicName: 'فرصنا',
    domain: 'forasna.com',
    category: 'corporate',
    badgeBg: 'bg-[#f57c00]/10',
    badgeBorder: 'border-[#f57c00]/40',
    badgeText: 'text-[#fb923c]',
    buildSearchUrl: (title) =>
      `https://forasna.com/jobs?search_keyword=${encodeURIComponent(title)}`
  },
  ureed: {
    name: 'Ureed',
    arabicName: 'أريد',
    domain: 'ureed.com',
    category: 'freelance',
    badgeBg: 'bg-[#ec4899]/10',
    badgeBorder: 'border-[#ec4899]/40',
    badgeText: 'text-[#f472b6]',
    buildSearchUrl: (title) =>
      `https://ureed.com/projects?keyword=${encodeURIComponent(title)}`
  },
  baeed: {
    name: 'Baeed',
    arabicName: 'بعيد',
    domain: 'baeed.com',
    category: 'remote',
    badgeBg: 'bg-[#0284c7]/10',
    badgeBorder: 'border-[#0284c7]/40',
    badgeText: 'text-[#38bdf8]',
    buildSearchUrl: (title) =>
      `https://baeed.com/jobs?q=${encodeURIComponent(title)}`
  },
  bahr: {
    name: 'Bahr',
    arabicName: 'بحر',
    domain: 'bahr.910ths.sa',
    category: 'freelance',
    badgeBg: 'bg-[#15803d]/10',
    badgeBorder: 'border-[#15803d]/40',
    badgeText: 'text-[#4ade80]',
    buildSearchUrl: (title) =>
      `https://www.google.com/search?q=${encodeURIComponent(`site:bahr.910ths.sa ${title}`)}`
  },
  wellfound: {
    name: 'Wellfound (AngelList)',
    arabicName: 'أنجل ليست',
    domain: 'wellfound.com',
    category: 'remote',
    badgeBg: 'bg-[#ef4444]/10',
    badgeBorder: 'border-[#ef4444]/40',
    badgeText: 'text-[#f87171]',
    buildSearchUrl: (title) =>
      `https://wellfound.com/jobs?query=${encodeURIComponent(title)}`
  },
  indeed: {
    name: 'Indeed',
    arabicName: 'إنديد',
    domain: 'indeed.com',
    category: 'corporate',
    badgeBg: 'bg-[#2164f3]/10',
    badgeBorder: 'border-[#2164f3]/40',
    badgeText: 'text-[#60a5fa]',
    buildSearchUrl: (title, company) =>
      `https://www.indeed.com/jobs?q=${encodeURIComponent([title, company].filter(Boolean).join(' '))}`
  },
  khamsat: {
    name: 'Khamsat',
    arabicName: 'خمسات',
    domain: 'khamsat.com',
    category: 'freelance',
    badgeBg: 'bg-[#ea580c]/10',
    badgeBorder: 'border-[#ea580c]/40',
    badgeText: 'text-[#fb923c]',
    buildSearchUrl: (title) =>
      `https://khamsat.com/community/requests?q=${encodeURIComponent(title)}`
  },
  bayt: {
    name: 'Bayt',
    arabicName: 'بيت.كوم',
    domain: 'bayt.com',
    category: 'corporate',
    badgeBg: 'bg-[#00838f]/10',
    badgeBorder: 'border-[#00838f]/40',
    badgeText: 'text-[#22d3ee]',
    buildSearchUrl: (title, company) =>
      `https://www.bayt.com/en/international/jobs/?keyword=${encodeURIComponent([title, company].filter(Boolean).join(' '))}`
  },
  parttime: {
    name: 'Part-Time',
    arabicName: 'بارتايم',
    domain: 'part-time.com',
    category: 'corporate',
    badgeBg: 'bg-[#eab308]/10',
    badgeBorder: 'border-[#eab308]/40',
    badgeText: 'text-[#fde047]',
    buildSearchUrl: (title, company) =>
      `https://www.google.com/search?q=${encodeURIComponent(`part-time ${title} ${company || ''} jobs apply`)}`
  },
  workana: {
    name: 'Workana',
    arabicName: 'وركانا',
    domain: 'workana.com',
    category: 'freelance',
    badgeBg: 'bg-[#6366f1]/10',
    badgeBorder: 'border-[#6366f1]/40',
    badgeText: 'text-[#818cf8]',
    buildSearchUrl: (title) =>
      `https://www.workana.com/jobs?query=${encodeURIComponent(title)}`
  },
  freelancer: {
    name: 'Freelancer',
    arabicName: 'فريلانسر',
    domain: 'freelancer.com',
    category: 'freelance',
    badgeBg: 'bg-[#06b6d4]/10',
    badgeBorder: 'border-[#06b6d4]/40',
    badgeText: 'text-[#38bdf8]',
    buildSearchUrl: (title) =>
      `https://www.freelancer.com/jobs?keyword=${encodeURIComponent(title)}`
  },
  kafiil: {
    name: 'Kafiil',
    arabicName: 'كفيل',
    domain: 'kafiil.com',
    category: 'freelance',
    badgeBg: 'bg-[#10b981]/10',
    badgeBorder: 'border-[#10b981]/40',
    badgeText: 'text-[#34d399]',
    buildSearchUrl: (title) =>
      `https://kafiil.com/contests?q=${encodeURIComponent(title)}`
  },
  linkedin: {
    name: 'LinkedIn',
    arabicName: 'لينكد إن',
    domain: 'linkedin.com',
    category: 'corporate',
    badgeBg: 'bg-[#0a66c2]/10',
    badgeBorder: 'border-[#0a66c2]/40',
    badgeText: 'text-[#38bdf8]',
    buildSearchUrl: (title, company) =>
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent([title, company].filter(Boolean).join(' '))}`
  },
  wuzzuf: {
    name: 'Wuzzuf',
    arabicName: 'وظف',
    domain: 'wuzzuf.net',
    category: 'corporate',
    badgeBg: 'bg-[#1e88e5]/10',
    badgeBorder: 'border-[#1e88e5]/40',
    badgeText: 'text-[#60a5fa]',
    buildSearchUrl: (title) =>
      `https://wuzzuf.net/search/jobs/?q=${encodeURIComponent(title)}`
  },
  remoteok: {
    name: 'RemoteOK',
    domain: 'remoteok.com',
    category: 'remote',
    badgeBg: 'bg-[#f43f5e]/10',
    badgeBorder: 'border-[#f43f5e]/40',
    badgeText: 'text-[#fb7185]',
    buildSearchUrl: (title) =>
      `https://remoteok.com/remote-${encodeURIComponent(title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}-jobs`
  },
  weworkremotely: {
    name: 'WeWorkRemotely',
    domain: 'weworkremotely.com',
    category: 'remote',
    badgeBg: 'bg-[#ec4899]/10',
    badgeBorder: 'border-[#ec4899]/40',
    badgeText: 'text-[#f472b6]',
    buildSearchUrl: (title) =>
      `https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(title)}`
  }
};

/**
 * Normalizes and matches an arbitrary platform string to supported metadata.
 */
export function getPlatformMeta(platformName?: string): PlatformBrand {
  if (!platformName) {
    return {
      name: 'Web',
      domain: 'google.com',
      category: 'corporate',
      badgeBg: 'bg-[#162438]',
      badgeBorder: 'border-[#24354d]',
      badgeText: 'text-[#94a3b8]',
      buildSearchUrl: (title, company) => buildFallbackSearchUrl(title, company || '')
    };
  }

  const clean = platformName.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (SUPPORTED_PLATFORMS[clean]) {
    return SUPPORTED_PLATFORMS[clean];
  }

  // Substring matching
  for (const [key, brand] of Object.entries(SUPPORTED_PLATFORMS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return brand;
    }
  }

  return {
    name: platformName,
    domain: 'google.com',
    category: 'corporate',
    badgeBg: 'bg-[#162438]',
    badgeBorder: 'border-[#24354d]',
    badgeText: 'text-[#cbd5e1]',
    buildSearchUrl: (title, company) => buildFallbackSearchUrl(title, company || '', undefined, platformName)
  };
}

/**
 * Validates and normalizes direct job application URLs.
 * Ensures the URL begins with http:// or https:// and is structurally valid.
 */
export function sanitizeJobUrl(rawUrl?: string): string | undefined {
  if (!rawUrl || typeof rawUrl !== 'string') return undefined;
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Generates a pre-composed Google search fallback query URL.
 * Scoped with the source platform to guarantee high-precision retrieval.
 */
export function buildFallbackSearchUrl(
  title: string,
  company: string,
  location?: string,
  platform?: string
): string {
  const cleanTitle = (title || '').trim();
  const cleanCompany = (company || '').trim();
  const cleanLocation = (location || '').trim();
  const cleanPlatform = (platform || '').trim();

  const queryParts = [cleanTitle, cleanCompany, cleanLocation, cleanPlatform, 'careers', 'apply', 'job'].filter(Boolean);
  const query = queryParts.join(' ');

  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/**
 * Standard safe external anchor attributes preventing tab-nabbing vulnerabilities.
 */
export const EXTERNAL_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer'
} as const;
