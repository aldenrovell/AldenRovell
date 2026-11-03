import type {Metadata} from 'next';
import type {Product} from '@/lib/types';

export const SITE_URL='https://aldenrovell.com';
export const SITE_NAME='Alden Rovell';
export const SITE_DESCRIPTION='Explore Alden Rovell jewellery, footwear, women’s and men’s styles, and massage essentials in Pakistan. Free delivery on 2 or more items; Rs. 199 delivery for a single item.';

export function absoluteUrl(path:string):string{
 if(/^https?:\/\//i.test(path))return path;
 return SITE_URL+(path.startsWith('/')?path:'/'+path);
}
export function cleanDescription(value:string|undefined,fallback=SITE_DESCRIPTION):string{
 return (value?.replace(/\s+/g,' ').trim()||fallback).slice(0,170);
}
export function pageSeo({title,description,path,image='/brand/landscape-cover.png'}:{title:string;description:string;path:string;image?:string}):Metadata{
 const url=absoluteUrl(path);
 const clean=cleanDescription(description);
 const pageTitle=/\balden rovell\b/i.test(title)?title:`${title} | ${SITE_NAME}`;
 return {
  title:{absolute:pageTitle},
  description:clean,
  alternates:{canonical:url},
  openGraph:{type:'website',siteName:SITE_NAME,locale:'en_PK',title:pageTitle,description:clean,url,images:[{url:absoluteUrl(image),alt:SITE_NAME+' collections'}]},
  twitter:{card:'summary_large_image',title:pageTitle,description:clean,images:[absoluteUrl(image)]}
 };
}
export function serializeJsonLd(value:unknown):string {
 return JSON.stringify(value).replace(/</g,'\\u003c');
}
export const homeStructuredData={
 '@context':'https://schema.org',
 '@graph':[
  {'@type':'WebSite','@id':SITE_URL+'/#website',name:SITE_NAME,alternateName:'aldenrovell.com',url:SITE_URL+'/',inLanguage:'en-PK'},
  {'@type':'OnlineStore','@id':SITE_URL+'/#store',name:SITE_NAME,url:SITE_URL+'/',logo:absoluteUrl('/brand/primary-logo.png'),image:absoluteUrl('/brand/landscape-cover.png'),
    description:SITE_DESCRIPTION,
    sameAs:['https://www.facebook.com/aldenrovell/','https://www.instagram.com/aldenrovell/','https://www.tiktok.com/@aldenrovell','https://www.youtube.com/@AldenRovell','https://www.pinterest.com/aldenrovell/']}
 ]
};
export function productStructuredData(product:Product){
 const path='/product/'+encodeURIComponent(product.slug);
 const url=absoluteUrl(path);
 const images=product.images.map(i=>absoluteUrl(i.src)).filter(Boolean);
 const json:Record<string,unknown>={
  '@context':'https://schema.org','@type':'Product','@id':url+'#product',
  name:product.title,description:cleanDescription(product.description||product.shortDescription),
  image:images,url,brand:{'@type':'Brand',name:SITE_NAME}
 };
 if(product.sku&&!product.sku.startsWith('AR-DRAFT'))json.sku=product.sku;
 if(product.pricePkr!==null&&product.pricePkr>0&&product.salesUnitVerified&&product.imagesApproved){
  json.offers={'@type':'Offer',url,priceCurrency:'PKR',price:product.pricePkr,availability:product.stock!==null&&product.stock>0?'https://schema.org/InStock':'https://schema.org/OutOfStock',seller:{'@id':SITE_URL+'/#store'}};
 }
 return {'@context':'https://schema.org','@graph':[json,{
  '@type':'BreadcrumbList','@id':url+'#breadcrumb',
  itemListElement:[
   {'@type':'ListItem',position:1,name:'Home',item:SITE_URL+'/'},
   {'@type':'ListItem',position:2,name:'Shop',item:SITE_URL+'/shop'},
   {'@type':'ListItem',position:3,name:product.title,item:url}
  ]
 }]};
}
