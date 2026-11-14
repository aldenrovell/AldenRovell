import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,Truck,RefreshCcw,CreditCard,ShoppingBag,Gift} from 'lucide-react';
import {getProducts} from '@/lib/store';
import {getCategories} from '@/lib/site-cms';
import {FaqList} from '@/components/faq-list';
import {SITE_URL,SITE_DESCRIPTION,homeStructuredData,serializeJsonLd} from '@/lib/seo';
import {formatPrice,type Product} from '@/lib/types';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:{absolute:'Alden Rovell | Curated Jewellery, Footwear & Massagers in Pakistan'},description:SITE_DESCRIPTION,alternates:{canonical:SITE_URL+'/'},openGraph:{title:'Alden Rovell | The Curated Collection',description:SITE_DESCRIPTION,url:SITE_URL+'/',images:[{url:SITE_URL+'/brand/landscape-cover.png',alt:'Alden Rovell'}]}};
type Cat={name:string;label:string;description:string;kind:'existing'|'planned';cover:string;audience?:'men'|'women'};
const collections:Cat[]=[
{name:'Massagers',label:'Massagers',description:'Wellness & relaxation',kind:'existing',cover:'massagers'},
{name:'Jewellery',label:'Jewellery',description:'Timeless accents',kind:'existing',cover:'jewellery'},
{name:'Footwear',label:"Men's Footwear",description:'Discover the selection',kind:'existing',cover:'mens-footwear',audience:'men'},
{name:'Footwear',label:"Women's Footwear",description:'Refined everyday styles',kind:'existing',cover:'womens-footwear',audience:'women'},
{name:"Men's Watches",label:"Men's Watches",description:'Launching soon',kind:'planned',cover:'mens-watches'},
{name:"Women's Watches",label:"Women's Watches",description:'Launching soon',kind:'planned',cover:'womens-watches'},
{name:"Men's T-Shirts",label:"Men's T-Shirts",description:'Launching soon',kind:'planned',cover:'mens-tshirts'},
{name:"Women's T-Shirts",label:"Women's T-Shirts",description:'Launching soon',kind:'planned',cover:'womens-tshirts'}
];
const category=(p:Product)=>p.category.split('/')[0].trim();
export default async function Home(){
 const all=await getProducts();
 const products=all.filter(p=>p.published&&!('is_archived' in p&&p.is_archived)).filter(p=>p.images[0]?.src);
 const availableCollections=collections.filter(c=>c.kind==='existing'||products.some(p=>category(p)===c.name));
 const upcomingCollections=collections.filter(c=>!availableCollections.includes(c));
 const featuredIds=['P01','P02','P04','P05','PWOMWATCH01'];
 const featured=featuredIds.map(id=>products.find(p=>p.id===id)).filter((p):p is Product=>Boolean(p));
 const featuredProducts=[...featured,...products.filter(p=>!featured.some(f=>f.id===p.id))].slice(0,5);
 return <div className="ar-d1-home">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(homeStructuredData)}}/>
  <section className="ar-d1-hero" aria-label="Alden Rovell curated collection">
   <div className="ar-d1-hero-shell">
    <div className="ar-d1-hero-copy">
     <span className="ar-d1-eyebrow">THE ALDEN ROVELL COLLECTION</span>
     <h1>Luxury Finds<br/><em>for Every Style.</em></h1>
     <p>Explore our carefully selected jewellery, footwear, watches and everyday wellness essentials.</p>
     <div className="ar-luxe-hero-actions"><Link href="/shop" className="ar-d1-button">Shop Collection <ArrowUpRight size={19}/></Link><Link href="#ar-collections" className="ar-luxe-outline">Explore Categories</Link></div>
     <span className="ar-d1-smallnote">ALDEN ROVELL · THE CURATED EDIT</span>
    </div>
    <div className="ar-d1-hero-stage" aria-label="The Alden Rovell collections">
     <Image src="/collection-covers/collections-hero.webp" alt="Alden Rovell jewellery, footwear, watches and wellness collection" fill unoptimized priority sizes="(max-width:780px) 100vw, 58vw" className="ar-luxe-hero-art"/>
     <Image src="/collection-covers/womens-watches.webp" alt="Women's Watches luxury collection" fill unoptimized priority sizes="(max-width:780px) 55vw, 1px" className="ar-luxe-mobile-watch-art"/>
    </div>
   </div>
  </section>
  <section className="ar-d1-width ar-d1-policies" aria-label="Store policies">
   <div><Truck/><p><strong>1 Item Delivery <b>Rs. 199</b></strong><small>Across Pakistan</small></p></div>
   <div><Truck/><p><strong>2+ Items <b>Free Delivery</b></strong><small>Across Pakistan</small></p></div>
   <div><RefreshCcw/><p><strong>7 Day Returns</strong><small>For eligible requests</small></p></div>
   <div><CreditCard/><p><strong>Cash on Delivery</strong><small>Convenient checkout</small></p></div>
  </section>
  <section id="ar-collections" className="ar-d1-width ar-d1-categories" aria-label="Shop our collections">
   <div className="ar-luxe-section-heading"><span className="ar-d1-eyebrow">CURATED FOR YOU</span><h2>Shop by <em>Category</em></h2><p>Explore the Alden Rovell collections.</p></div>
   <div className="ar-d1-category-grid ar-luxe-active-categories">{availableCollections.map(c=>{
     const cover='/collection-covers/'+c.cover+'.webp';
     return <Link href={'/shop?category='+encodeURIComponent(c.name)+(c.audience?'&audience='+c.audience:'')} key={c.label} className="ar-d1-category-card">
      <div className="ar-d1-category-image"><Image src={cover} fill unoptimized alt={c.label+' collection cover'} sizes="(max-width:700px) 46vw, 18vw" className="object-cover"/></div>
      <strong>{c.label} <ArrowUpRight size={14}/></strong><span>{c.description}</span>
     </Link>;
   })}</div>
   {upcomingCollections.length>0&&<div className="ar-luxe-coming-row" aria-label="Upcoming collections">{upcomingCollections.map(c=><div className="ar-luxe-coming-item" key={c.label}>
    <div className="ar-luxe-coming-image"><Image src={'/collection-covers/'+c.cover+'.webp'} fill unoptimized alt={c.label+' collection preview'} sizes="85px"/></div>
    <div><strong>{c.label}</strong><span>Coming soon</span></div>
   </div>)}</div>}
  </section>
  <section className="ar-d1-width ar-d1-featured" aria-label="Alden Rovell products">
   <div className="ar-d1-titlebar"><div><span className="ar-d1-eyebrow">THE ALDEN ROVELL EDIT</span><h2>Featured <em>Collection</em></h2><p>Five highlights from our real, available catalogue.</p></div><Link href="/shop" className="ar-d1-viewall">Explore collections <ArrowUpRight size={17}/></Link></div>
   <div className="ar-d1-product-grid">{featuredProducts.map((p,i)=><Link className="ar-d1-product-card" href={'/product/'+p.slug} key={p.id}>
    <div className="ar-d1-product-image"><Image src={p.images[0].src} alt={p.images[0].alt||p.title} fill unoptimized sizes="(max-width:600px) 48vw,(max-width:1000px) 30vw,17vw" className="object-contain"/><span className="ar-luxe-card-icon"><ShoppingBag size={17}/></span></div>
    <div className="ar-d1-product-info"><small>{category(p)}</small><strong>{p.title}</strong><b>{formatPrice(p.pricePkr)}</b></div>
   </Link>)}</div>
  </section>
  <section className="ar-d1-width ar-luxe-promise-band" aria-label="The Alden Rovell promise"><span><Gift size={25}/> THE ALDEN ROVELL PROMISE</span><strong>Curated style. Thoughtful service. Everyday luxury.</strong></section><section className="ar-d1-width ar-luxe-story"><div className="ar-luxe-story-copy"><span className="ar-d1-eyebrow">ABOUT ALDEN ROVELL</span><h2>Style, Quality &amp; <em>Everyday Luxury.</em></h2><p>From jewellery and footwear to wellness essentials, explore a carefully selected collection designed for everyday discoveries.</p><Link href="/about" className="ar-d1-button">Our Story <ArrowUpRight size={17}/></Link></div><div className="ar-luxe-story-art"><Image src="/collection-covers/collections-hero.webp" fill unoptimized alt="Alden Rovell curated collections" sizes="(max-width:780px) 100vw,50vw"/></div></section>
  <section className="ar-d1-width ar-d1-faq"><div><span className="ar-d1-eyebrow">GOOD TO KNOW</span><h2>Questions, <em>answered.</em></h2></div><FaqList compact/></section>
 </div>;
}