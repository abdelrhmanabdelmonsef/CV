export const HTB_PROFILE_ID = '019e8056-cb46-73e2-a8ce-09c8b8aceb7d';
export const HTB_PROFILE_URL = `https://profile.hackthebox.com/profile/${HTB_PROFILE_ID}`;

const HTB_PUBLIC_API = `https://profile.hackthebox.com/api/v1/public/profile/${HTB_PROFILE_ID}`;

export type HtbBadge = {
  name: string;
  imageUrl: string;
};

export type HtbProfileData = {
  handle: string;
  fullName: string;
  country: string;
  avatar: string | null;
  badges: HtbBadge[];
  stats: {
    academy: number;
    labs: number;
  };
  profileUrl: string;
};

type HtbPublicApiResponse = {
  data: {
    name: string;
    full_name: string;
    country?: { name: string };
    avatar?: string;
    avatar_thumb?: string;
  };
};

function normalizeImageUrl(url: string): string {
  return url.replace(/\\u002F/g, '/');
}

export function parseHtbBadgesFromHtml(html: string): HtbBadge[] {
  const badges: HtbBadge[] = [];
  const seen = new Set<string>();

  const imgTagRegex = /<img[^>]*>/gi;
  const tags = html.match(imgTagRegex) ?? [];

  for (const tag of tags) {
    const altMatch = tag.match(/alt="([^"]+)"/i);
    const srcMatch = tag.match(/src="([^"]+)"/i);
    if (!altMatch || !srcMatch) continue;

    const alt = altMatch[1].trim();
    if (!alt.endsWith(' avatar') || alt === 'User avatar') continue;

    const name = alt.replace(/ avatar$/, '').trim();
    const imageUrl = normalizeImageUrl(srcMatch[1].trim());
    if (!imageUrl.includes('hackthebox.com/storage/badges')) continue;

    const key = `${name}|${imageUrl}`;
    if (seen.has(key)) continue;
    seen.add(key);
    badges.push({ name, imageUrl });
  }

  return badges;
}

export function parseHtbLabsCountFromHtml(html: string): number {
  const summaryMatch = html.match(
    /\{"total_badges":\d+,"total_awarded":\d+,"categories":\d+\},(\d+),\[\],\{"total_badges":\d+,"total_awarded":\d+,"categories":\d+\},\[\]/
  );
  if (summaryMatch) return parseInt(summaryMatch[1], 10);

  const labsBlockMatch = html.match(
    /\$slabs-badges[\s\S]{0,8000}?\{"total_badges":\d+,"total_awarded":\d+,"categories":\d+\},(\d+),\[\]/
  );
  if (labsBlockMatch) return parseInt(labsBlockMatch[1], 10);

  return 0;
}

export async function fetchHtbPublicProfile(): Promise<HtbPublicApiResponse['data']> {
  const response = await fetch(HTB_PUBLIC_API, {
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`HTB profile API returned ${response.status}`);
  }

  const json = (await response.json()) as HtbPublicApiResponse;
  return json.data;
}

export async function fetchHtbProfileHtml(): Promise<string> {
  const response = await fetch(HTB_PROFILE_URL, {
    headers: { 'User-Agent': 'cv-web-cv/1.0' },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`HTB profile page returned ${response.status}`);
  }

  return response.text();
}

export async function getHtbProfileData(): Promise<HtbProfileData> {
  const [profile, html] = await Promise.all([fetchHtbPublicProfile(), fetchHtbProfileHtml()]);

  const badges = parseHtbBadgesFromHtml(html);
  const labs = parseHtbLabsCountFromHtml(html);

  return {
    handle: `@${profile.name}`,
    fullName: profile.full_name,
    country: profile.country?.name ?? '',
    avatar: profile.avatar ?? profile.avatar_thumb ?? null,
    badges,
    stats: {
      academy: badges.length,
      labs
    },
    profileUrl: HTB_PROFILE_URL
  };
}
