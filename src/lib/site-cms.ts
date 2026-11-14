import 'server-only';
import { adminDb } from '@/lib/store';
import previewData from '@/data/preview-store.json';
export async function getSiteContent(key:string) {const db=adminDb();if(!db)return {};const {data}=await db.from('site_content').select('data').eq('key',key).maybeSingle();return (data?.data??{}) as Record<string,string>;}

export async function getCategories(){const db=adminDb();if(!db)return process.env.VERCEL_ENV==='preview'?previewData.categories:[];const {data,error}=await db.from('site_categories').select('id,name,slug,parent_id,visible,sort_order,image_url').order('sort_order');if(error)return [];return data??[];}
