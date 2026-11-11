import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,Truck,RefreshCcw,CreditCard,Watch,Shirt,ShieldCheck} from 'lucide-react';
import {getProducts} from '@/lib/store';
import {getCategories} from '@/lib/site-cms';
import {FaqList} from '@/components/faq-list';
import {SITE_URL,SITE_DESCRIPTION,homeStructuredData,serializeJsonLd} from '@/lib/seo';
import {formatPrice,type Product} from '@/lib/types';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:{absolute:'Alden Rovell | Curated Jewellery, Footwear & Massagers in Pakistan'},description:SITE_DESCRIPTION,alternates:{canonical:SITE_URL+'/'},openGraph:{title:'Alden Rovell | The Curated Collection',description:SITE_DESCRIPTION,url:SITE_URL+'/',images:[{url:SITE_URL+'/brand/landscape-cover.png',alt:'Alden Rovell'}]}};
type Cat={name:string;label:string;description:string;kind:'existing'|'planned';icon?:'watch'|'shirt'};
const collections:Cat[]=[
{name:'Massagers',label:'Massagers',description:'Wellness & relaxation',kind:'existing'},
{name:'Jewellery',label:'Jewellery',description:'Timeless accents',kind:'existing'},
{name:'Footwear',label:'Footwear',description:'Everyday elegance',kind:'existing'},
{name:"Men's Watches",label:"Men's Watches",description:'Launching soon',kind:'planned',icon:'watch'},
{name:"Women's Watches",label:"Women's Watches",description:'Launching soon',kind:'planned',icon:'watch'},
{name:"Men's T-Shirts",label:"Men's T-Shirts",description:'Launching soon',kind:'planned',icon:'shirt'},
{name:"Women's T-Shirts",label:"Women's T-Shirts",description:'Launching soon',kind:'planned',icon:'shirt'}
];
const category=(p:Product)=>p.category.split('/')[0].trim();
export default async function Home(){
 const [all,cats]=await Promise.all([getProducts(),getCategories()]);
 const products=all.filter(p=>p.published&&!('is_archived' in p&&p.is_archived)).filter(p=>p.images[0]?.src);
 const pick=(id:string)=>products.find(p=>p.id===id);
 const massager=pick('PNECK4D2026')||products.find(p=>category(p)==='Massagers');
 const necklace=pick('P07')||products.find(p=>category(p)==='Jewellery');
 const shoes=pick('P05')||products.find(p=>category(p)==='Footwear');
 const intro=[massager,necklace,shoes].filter((p):p is Product=>Boolean(p));
 const catImage=(name:string)=>cats.find(c=>c.name===name&&!c.parent_id)?.image_url||products.find(p=>category(p)===name)?.images[0]?.src;
 return <div className="ar-d1-home">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(homeStructuredData)}}/>
  <section className="ar-d1-hero" aria-label="Alden Rovell curated collection">
   <div className="ar-d1-hero-shell">
    <div className="ar-d1-hero-copy">
     <span className="ar-d1-eyebrow">THE ALDEN ROVELL COLLECTION</span>
     <h1>Everyday <em>Luxury</em><br/>Curated for You.</h1>
     <p>Wellness, style and essentials, all in one thoughtfully curated collection.</p>
     <Link href="/shop" className="ar-d1-button">Shop the Collection <ArrowUpRight size={19}/></Link>
     <span className="ar-d1-smallnote">DELIVERING ACROSS PAKISTAN</span>
    </div>
    <div className="ar-d1-hero-stage" aria-label="Selected Alden Rovell products">
     <span className="ar-d1-halo" aria-hidden="true"/>
     {intro.map((p,i)=><Link key={p.id} href={'/product/'+p.slug} className={'ar-d1-stage-item ar-d1-stage-item-'+i} aria-label={'View '+p.title}>
      <Image src={p.images[0].src} alt={p.title} fill unoptimized sizes="(max-width:750px) 40vw, 20vw" className="object-contain"/>
     </Link>)}
     <div className="ar-d1-stage-caption">CURATED FINDS <span>✦</span> ALDEN ROVELL</div>
    </div>
   </div>
  </section>
  <section className="ar-d1-width ar-d1-categories" aria-label="Shop our collections">
   <div className="ar-d1-sectionline"><span>DISCOVER OUR COLLECTIONS</span><span>01 / 07</span></div>
   <div className="ar-d1-category-grid">{collections.map((c,i)=>{
     const src=c.kind==='existing'?catImage(c.name):null;
     return c.kind==='existing'?<Link href={'/shop?category='+encodeURIComponent(c.name)} key={c.name} className="ar-d1-category-card">
      <div className="ar-d1-category-image">{src&&<Image src={src} fill unoptimized alt={c.name} sizes="(max-width:700px) 46vw, 14vw" className="object-contain"/>}</div>
      <strong>{c.label}</strong><span>{c.description}</span>
     </Link>:<div className="ar-d1-category-card ar-d1-category-upcoming" key={c.name}>
      <div className="ar-d1-category-image ar-d1-planned-art">{c.icon==='watch'?<Watch size={52} strokeWidth={1.1}/>:<Shirt size={52} strokeWidth={1.1}/>}<span className="ar-d1-coming">COMING SOON</span></div>
      <strong>{c.label}</strong><span>{c.description}</span>
     </div>;
   })}</div>
  </section>
  <section className="ar-d1-width ar-d1-policies" aria-label="Store policies">
   <div><Truck/><p><strong>1 Item Delivery <b>Rs. 199</b></strong><small>Across Pakistan</small></p></div>
   <div><Truck/><p><strong>2+ Items <b>Free Delivery</b></strong><small>Across Pakistan</small></p></div>
   <div><RefreshCcw/><p><strong>7 Day Returns</strong><small>For eligible requests</small></p></div>
   <div><CreditCard/><p><strong>Cash on Delivery</strong><small>Convenient checkout</small></p></div>
  </section>
  <section className="ar-d1-width ar-d1-featured" aria-label="Alden Rovell products">
   <div className="ar-d1-titlebar"><div><span className="ar-d1-eyebrow">HANDPICKED FOR YOU</span><h2>Featured <em>Products</em></h2><p>Every item currently available at Alden Rovell.</p></div><Link href="/shop" className="ar-d1-viewall">Shop by category <ArrowUpRight size={17}/></Link></div>
   <div className="ar-d1-product-grid">{products.map((p,i)=><Link className="ar-d1-product-card" href={'/product/'+p.slug} key={p.id}>
    <div className="ar-d1-product-image"><Image src={p.images[0].src} alt={p.images[0].alt||p.title} fill unoptimized sizes="(max-width:600px) 48vw,(max-width:1000px) 30vw,17vw" className="object-contain"/><span className="ar-d1-card-index">{String(i+1).padStart(2,'0')}</span></div>
    <div className="ar-d1-product-info"><small>{category(p)}</small><strong>{p.title}</strong><b>{formatPrice(p.pricePkr)}</b></div>
   </Link>)}</div>
  </section>
  <section className="ar-d1-width ar-d1-ending"><div><span className="ar-d1-eyebrow">THE ALDEN ROVELL PROMISE</span><h2>A little more <em>extraordinary.</em></h2><p>Curated selections, thoughtful service, and elegant discoveries.</p></div><div className="ar-d1-promise"><span><ShieldCheck size={25}/> Carefully curated catalogue</span><span><Truck size={25}/> Nationwide delivery</span><span><RefreshCcw size={25}/> 7-day eligible returns</span></div></section>
  <section className="ar-d1-width ar-d1-faq"><div><span className="ar-d1-eyebrow">GOOD TO KNOW</span><h2>Questions, <em>answered.</em></h2></div><FaqList compact/></section>
 </div>;
}