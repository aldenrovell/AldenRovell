import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,Truck,RefreshCcw,CreditCard,ShieldCheck,ShoppingBag,Gift,ArrowRight} from 'lucide-react';
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
{name:"Men's Watches",label:"Men's Watches",description:'Modern everyday classics',kind:'planned',cover:'mens-watches'},
{name:"Women's Watches",label:"Women's Watches",description:'Timeless designs',kind:'planned',cover:'womens-watches'},
{name:"Men's T-Shirts",label:"Men's T-Shirts",description:'Launching soon',kind:'planned',cover:'mens-tshirts'},
{name:"Women's T-Shirts",label:"Women's T-Shirts",description:'Launching soon',kind:'planned',cover:'womens-tshirts'}
];
const category=(p:Product)=>p.category.split('/')[0].trim();
export default async function Home(){
 const all=await getProducts();
 const products=all.filter(p=>p.published&&!('is_archived' in p&&p.is_archived)).filter(p=>p.images[0]?.src);
 const pick=(id:string)=>products.find(p=>p.id===id);
 const massager=pick('PNECK4D2026')||products.find(p=>category(p)==='Massagers');
 const necklace=pick('P07')||products.find(p=>category(p)==='Jewellery');
 const shoes=pick('P05')||products.find(p=>category(p)==='Footwear');
 const intro=[massager,necklace,shoes].filter((p):p is Product=>Boolean(p));
 const featuredWatch=products.find(p=>category(p)==="Women's Watches")||products.find(p=>category(p)==="Men's Watches");
 const availableCategories=new Set(products.map(p=>category(p)));
 return <div className="ar-d1-home">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(homeStructuredData)}}/>
  <section className="ar-luxe-hero ar-d1-hero" aria-label="Alden Rovell luxury collection">
   <div className="ar-luxe-hero-media"><Image src="/collection-covers/collections-hero.webp" fill unoptimized priority alt="Alden Rovell curated fashion, jewellery, footwear, watches and wellness collection" sizes="100vw" /></div>
   <div className="ar-luxe-hero-veil" aria-hidden="true"/>
   <div className="ar-luxe-hero-inner">
    <div className="ar-luxe-hero-copy">
     <span className="ar-luxe-kicker">THE ALDEN ROVELL EDIT</span>
     <h1>Luxury finds,<br/><em>Everyday elegance.</em></h1>
     <p>Thoughtfully selected jewellery, footwear, watches and wellness essentials for your everyday style.</p>
     <div className="ar-luxe-hero-cta"><Link href="/shop" className="ar-luxe-primary"><ShoppingBag size={17}/> Shop Collections <ArrowUpRight size={17}/></Link><Link href="/about" className="ar-luxe-outline">Our Story <ArrowRight size={17}/></Link></div>
     <span className="ar-luxe-hero-note">CURATED FOR PAKISTAN · DESIGNED TO BE DISCOVERED</span>
    </div>
   </div>
   <span className="ar-luxe-hero-edge" aria-hidden="true"/>
  </section>
  <section className="ar-d1-width ar-d1-policies ar-luxe-policies" aria-label="Store policies">
   <div><Truck/><p><strong>1 Item Delivery <b>Rs. 199</b></strong><small>Across Pakistan</small></p></div>
   <div><Truck/><p><strong>2+ Items <b>Free Delivery</b></strong><small>Across Pakistan</small></p></div>
   <div><RefreshCcw/><p><strong>7 Day Returns</strong><small>For eligible requests</small></p></div>
   <div><CreditCard/><p><strong>Cash on Delivery</strong><small>Convenient checkout</small></p></div>
  </section>
  <section className="ar-d1-width ar-d1-categories ar-luxe-categories" aria-label="Shop by category">
   <div className="ar-luxe-section-heading"><span className="ar-luxe-kicker">DISCOVER YOUR STYLE</span><h2>Shop by <em>Category</em></h2><p>Find the collection that feels like you.</p></div>
   <div className="ar-d1-category-grid">{collections.map(c=>{
     const cover='/collection-covers/'+c.cover+'.webp';
     const live=c.kind==='existing'||availableCategories.has(c.name);
     return live?<Link href={'/shop?category='+encodeURIComponent(c.name)+(c.audience?'&audience='+c.audience:'')} key={c.label} className="ar-d1-category-card">
      <div className="ar-d1-category-image"><Image src={cover} fill unoptimized alt={c.label+' collection'} sizes="(max-width:700px) 46vw, 15vw" className="object-cover"/></div>
      <strong>{c.label} <ArrowUpRight size={13}/></strong><span>{c.description}</span>
     </Link>:<div className="ar-d1-category-card ar-d1-category-upcoming" key={c.label}>
      <div className="ar-d1-category-image ar-d1-planned-art"><Image src={cover} fill unoptimized alt={c.label+' planned collection'} sizes="(max-width:700px) 46vw, 15vw" className="object-cover"/><span className="ar-d1-coming">COMING SOON</span></div>
      <strong>{c.label}</strong><span>Coming soon</span>
     </div>;
   })}</div>
  </section>
  {featuredWatch&&<section className="ar-d1-width ar-luxe-watch-feature" aria-label="Discover Alden Rovell watches">
   <div className="ar-luxe-watch-copy"><span className="ar-luxe-kicker">THE WATCH EDIT</span><h2>Time, beautifully <em>considered.</em></h2><p>Discover refined watches chosen to complete your everyday look.</p><Link href={'/product/'+featuredWatch.slug} className="ar-luxe-primary">Explore the Watch <ArrowUpRight size={17}/></Link></div>
   <div className="ar-luxe-watch-visual"><Image src={featuredWatch.images[0].src} alt={featuredWatch.title} fill unoptimized sizes="(max-width:700px) 85vw, 37vw" className="object-contain"/></div>
  </section>}
  <section className="ar-d1-width ar-d1-featured ar-luxe-featured" aria-label="Alden Rovell products">
   <div className="ar-d1-titlebar"><div><span className="ar-d1-eyebrow">THE CURATED EDIT</span><h2>Featured <em>Collection</em></h2><p>A selection of pieces from our current catalogue.</p></div><Link href="/shop" className="ar-d1-viewall">View all collections <ArrowUpRight size={17}/></Link></div>
   <div className="ar-d1-product-grid">{products.slice(0,10).map((p,i)=><Link className="ar-d1-product-card" href={'/product/'+p.slug} key={p.id}>
    <div className="ar-d1-product-image"><Image src={p.images[0].src} alt={p.images[0].alt||p.title} fill unoptimized sizes="(max-width:600px) 48vw,(max-width:1000px) 30vw,17vw" className="object-contain"/><span className="ar-luxe-card-bag" aria-hidden="true"><ShoppingBag size={15}/></span></div>
    <div className="ar-d1-product-info"><small>{category(p)}</small><strong>{p.title}</strong><b>{formatPrice(p.pricePkr)}</b></div>
   </Link>)}</div>
  </section>
  <section className="ar-d1-width ar-luxe-promise" aria-label="The Alden Rovell promise">
   <span className="ar-luxe-promise-symbol"><Gift size={35}/></span>
   <div><span className="ar-luxe-kicker">THE ALDEN ROVELL PROMISE</span><h2>Every detail matters.</h2><p>Carefully selected products · Considered service · Confident shopping</p></div>
   <span className="ar-luxe-promise-art" aria-hidden="true">✧</span>
  </section>
  <section className="ar-d1-width ar-luxe-story" aria-label="About Alden Rovell">
   <div className="ar-luxe-story-copy"><span className="ar-luxe-kicker">ABOUT ALDEN ROVELL</span><h2>Style, quality &amp;<br/><em>everyday luxury.</em></h2><p>Alden Rovell brings together carefully chosen lifestyle essentials, from wellness to fashion, designed to make every discovery feel special.</p><Link className="ar-luxe-primary" href="/about">Explore Our Story <ArrowUpRight size={17}/></Link></div>
   <div className="ar-luxe-story-art"><Image src="/collection-covers/jewellery.webp" fill unoptimized alt="Alden Rovell jewellery collection photographed in our warm beige visual theme" sizes="(max-width:700px) 90vw, 45vw"/><span>ALDEN ROVELL · THE COLLECTION</span></div>
  </section>
  <section className="ar-d1-width ar-d1-faq"><div><span className="ar-d1-eyebrow">GOOD TO KNOW</span><h2>Questions, <em>answered.</em></h2></div><FaqList compact/></section>
 </div>;
}