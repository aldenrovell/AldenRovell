import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {getProducts,getSettings} from '@/lib/store';
import {ProductDetail} from '@/components/product-detail';
import {SITE_URL,absoluteUrl,cleanDescription,productStructuredData,serializeJsonLd} from '@/lib/seo';
export const dynamic='force-dynamic';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const p=(await getProducts()).find(x=>x.slug===slug&&x.published);
 if(!p)return{title:'Product not found',robots:{index:false,follow:false}};
 const url=SITE_URL+'/product/'+encodeURIComponent(p.slug);
 const description=cleanDescription(p.metaDescription||p.shortDescription||p.description);
 const title=p.seoTitle?.replace(/\s*[|–-]\s*Alden Rovell\s*$/i,'').trim()||p.title;
 const images=p.images.slice(0,4).map(i=>absoluteUrl(i.src));
 return {
  title,description,alternates:{canonical:url},
  openGraph:{title:title+' | Alden Rovell',description,url,type:'website',siteName:'Alden Rovell',images:images.map(i=>({url:i,alt:p.title}))},
  twitter:{card:images.length?'summary_large_image':'summary',title:title+' | Alden Rovell',description,images}
 };
}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const p=(await getProducts()).find(x=>x.slug===slug&&x.published);
 if(!p)notFound();
 const settings=await getSettings();
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(productStructuredData(p))}}/><ProductDetail product={p} settings={settings}/></>;
}
