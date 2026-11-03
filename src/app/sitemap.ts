import type {MetadataRoute} from 'next';
import {getProducts} from '@/lib/store';
import {SITE_URL} from '@/lib/seo';

export const revalidate=3600;
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 if(process.env.VERCEL_ENV==='preview')return[];
 const pages=[
  {path:'/',priority:1 as const,changeFrequency:'weekly' as const},
  {path:'/shop',priority:0.9 as const,changeFrequency:'daily' as const},
  {path:'/about',priority:0.7 as const,changeFrequency:'monthly' as const},
  {path:'/contact',priority:0.6 as const,changeFrequency:'monthly' as const},
  {path:'/faq',priority:0.6 as const,changeFrequency:'monthly' as const},
  {path:'/shipping',priority:0.6 as const,changeFrequency:'monthly' as const},
  {path:'/returns',priority:0.6 as const,changeFrequency:'monthly' as const},
  {path:'/privacy',priority:0.3 as const,changeFrequency:'yearly' as const},
  {path:'/terms',priority:0.3 as const,changeFrequency:'yearly' as const}
 ];
 const products=(await getProducts()).filter(p=>p.published&&p.slug);
 return [
  ...pages.map(({path,priority,changeFrequency})=>({url:SITE_URL+path,priority,changeFrequency})),
  ...products.map(p=>({url:SITE_URL+'/product/'+encodeURIComponent(p.slug),priority:0.7,changeFrequency:'weekly' as const}))
 ];
}
