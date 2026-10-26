import Link from 'next/link';
import Image from 'next/image';
import {Facebook,Instagram,Youtube,MessageCircle,Phone} from 'lucide-react';
import {getSiteContent} from '@/lib/site-cms';

const socialHosts:Record<string,string[]>={
 social_facebook:['facebook.com','www.facebook.com'],
 social_instagram:['instagram.com','www.instagram.com'],
 social_tiktok:['tiktok.com','www.tiktok.com'],
 social_youtube:['youtube.com','www.youtube.com'],
 social_pinterest:['pinterest.com','www.pinterest.com']
};
function safeSocialUrl(value:string|undefined,key:string):string|null{
 if(!value||!socialHosts[key])return null;
 try{const url=new URL(value.trim());return url.protocol==='https:'&&socialHosts[key].includes(url.hostname.toLowerCase())?url.toString():null;}catch{return null;}
}
function TikTokMark(){return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M16.6 2c.15 1.56.94 2.89 2.3 3.74.87.55 1.78.84 2.84.91v3.55a9.4 9.4 0 0 1-5.05-1.57v6.23c0 4.02-3.04 7.12-6.9 7.12a6.9 6.9 0 0 1-6.92-6.96 6.9 6.9 0 0 1 6.93-6.88c.4 0 .76.03 1.11.1v3.56a3.4 3.4 0 0 0-1.07-.17 3.37 3.37 0 0 0-3.41 3.39 3.37 3.37 0 0 0 3.39 3.39c1.91 0 3.41-1.5 3.41-3.39V2h3.37Z"/></svg>}
function PinterestMark(){return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.7 19.3c0-.8.01-1.66.2-2.48l1.3-5.57s-.32-.63-.32-1.56c0-1.47.85-2.56 1.92-2.56.9 0 1.34.68 1.34 1.48 0 .9-.57 2.25-.87 3.49-.25 1.04.52 1.89 1.55 1.89 1.86 0 3.3-1.97 3.3-4.82 0-2.51-1.8-4.26-4.38-4.26-3 0-4.76 2.25-4.76 4.58 0 .9.35 1.89.78 2.4.09.1.11.19.08.29l-.29 1.18c-.05.2-.16.24-.36.14-1.29-.6-2.1-2.5-2.1-4.03 0-3.29 2.39-6.29 6.88-6.29 3.62 0 6.42 2.57 6.42 6.02 0 3.59-2.26 6.46-5.39 6.46-1.05 0-2.04-.55-2.4-1.2l-.65 2.44c-.24.93-.88 2.08-1.3 2.88A10 10 0 1 0 12 2Z"/></svg>}
function WhatsAppMark(){return <span className="footer-whatsapp-mark" aria-hidden="true"><MessageCircle size={22}/><Phone size={10}/></span>}

export async function Footer(){
 const [brand,content,contact]=await Promise.all([getSiteContent('brand'),getSiteContent('footer'),getSiteContent('contact')]);
 const icons=[
  {name:'Facebook',key:'social_facebook',icon:<Facebook size={19}/>},
  {name:'Instagram',key:'social_instagram',icon:<Instagram size={19}/>},
  {name:'TikTok',key:'social_tiktok',icon:<TikTokMark/>},
  {name:'YouTube',key:'social_youtube',icon:<Youtube size={20}/>},
  {name:'Pinterest',key:'social_pinterest',icon:<PinterestMark/>},
 ];
 const social=icons.map(i=>({...i,url:safeSocialUrl(content[i.key],i.key)})).filter(i=>i.url!==null);
 const rawPhone=(contact.whatsapp||'').replace(/\D/g,'');
 const internationalPhone=rawPhone.startsWith('0')?'92'+rawPhone.slice(1):rawPhone.startsWith('92')?rawPhone:'';
 if(/^92\d{10}$/.test(internationalPhone))social.push({name:'WhatsApp',key:'social_whatsapp',icon:<WhatsAppMark/>,url:'https://wa.me/'+internationalPhone});
 return <footer className="footer">
  <div className="container footer-grid">
   <div className="footer-brand"><Link href="/"><Image unoptimized src={brand.footer_logo||'/brand/primary-header-white.png'} width={228} height={60} alt="Alden Rovell" className="footer-logo"/></Link><p>{content.description||'Thoughtfully selected everyday essentials.'}</p></div>
   <div><h3>Explore</h3><Link href="/shop">Shop all</Link><Link href="/about">Our story</Link></div>
   <div><h3>Customer care</h3><Link href="/contact">Contact us</Link><Link href="/faq">FAQs</Link><Link href="/shipping">Shipping</Link><Link href="/returns">Returns</Link></div>
   <div><h3>Information</h3><Link href="/terms">Terms & conditions</Link><Link href="/privacy">Privacy policy</Link></div>
  </div>
  {social.length>0&&<section className="container footer-social" aria-label="Alden Rovell social media">
   <h3>CONNECT WITH ALDEN ROVELL</h3>
   <div className="footer-social-icons">{social.map(({name,url,icon})=><a key={name} className="footer-social-icon" href={url||'#'} target="_blank" rel="noopener noreferrer" aria-label={'Follow Alden Rovell on '+name} title={name}>{icon}</a>)}</div>
  </section>}
  <div className="container foot-bottom"><span>{content.copyright||'© Alden Rovell. All rights reserved.'}</span></div>
 </footer>;
}
