import type {MetadataRoute} from 'next';
import {SITE_URL} from '@/lib/seo';

export default function robots():MetadataRoute.Robots{
 const preview=process.env.VERCEL_ENV==='preview';
 return {
  rules:preview
   ?[{userAgent:'*',disallow:'/'}]
   :[{userAgent:'*',allow:'/',disallow:['/admin','/cart','/checkout','/api/']}],
  sitemap:preview?undefined:SITE_URL+'/sitemap.xml',
  host:SITE_URL
 };
}
