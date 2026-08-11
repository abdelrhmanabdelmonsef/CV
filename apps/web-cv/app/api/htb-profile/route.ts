import { getHtbProfileData } from '../../../lib/htb-profile';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getHtbProfileData();
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch HTB profile';
    return Response.json({ error: message }, { status: 502 });
  }
}
