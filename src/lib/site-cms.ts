import 'server-only';
import { adminDb } from '@/lib/store';
export async function getSiteContent(key:string) {const db=adminDb();if(!db)return {};const {data}=await db.from('site_content').select('data').eq('key',key).maybeSingle();return (data?.data??{}) as Record<string,string>;}
