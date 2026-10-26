import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,ArrowDownRight,MoveUpRight,Truck,RefreshCcw,ShieldCheck} from 'lucide-react';
import {getProducts} from '@/lib/store';
import {getSiteContent,getCategories} from '@/lib/site-cms';
import {HeroProductCarousel} from '@/components/hero-product-carousel';
import {FaqList} from '@/components/faq-list';

export const dynamic='force-dynamic';
const visibleCategories=['Massagers','Jewellery','Footwear'];

export default async function Home(){
 const [allProducts,c,categories]=await Promise.all([getProducts(),getSiteContent('home'),getCategories()]);
 const products=allProducts.filter(p=>p.published);
 const featuredCategories=categories.filter(cat=>cat.visible&&!cat.parent_id&&visibleCategories.includes(cat.name)).sort((a,b)=>visibleCategories.indexOf(a.name)-visibleCategories.indexOf(b.name)).map(cat=>({...cat,thumbnail:cat.image_url||categories.find(child=>child.visible&&child.parent_id===cat.id&&child.image_url)?.image_url||products.find(p=>p.category.split('/')[0].trim()===cat.name)?.images[0]?.src||''}));
 const featuredIds=['P07','P05','P06','P02'];
 const showcase=featuredIds.map(id=>products.find(p=>p.id===id)).filter((p):p is (typeof products)[number]=>Boolean(p&&p.images[0]?.src)).map(p=>({id:p.id,title:p.title,category:p.category.split('/')[0].trim(),src:p.images[0].src,href:'/product/'+p.slug}));
 const editorial=products.find(p=>p.id==='P07')||products.find(p=>p.images?.[0]?.src);
 const second=products.find(p=>p.id==='P06')||products.find(p=>p.id!==editorial?.id&&p.images?.[0]?.src);
 return <>
  <section className="hero cp-public-hero ar-editorial-hero"><div className="container hero-grid">
   <div className="hero-content">
    <div className="hero-kicker"><span className="kicker-line"/>{c.eyebrow||'ALDEN ROVELL / THE CURATED EDIT'}</div>
    <h1>{c.title||'Essential finds. Elevated everyday.'}<span className="heading-dot">.</span></h1>
    <p>{c.subtitle||'Thoughtful discoveries in jewellery, footwear and everyday essentials. Curated for the way you live.'}</p>
    <div className="hero-buttons"><Link href={c.button_url?.startsWith('/')?c.button_url:'/shop'} className="btn btn-accent">{c.button_label||'Explore the collections'}<ArrowUpRight size={18}/></Link><Link href="/about" className="link-underline">Discover our story <ArrowUpRight size={15}/></Link></div>
    <div className="hero-bottom"><span>DESIGNED TO BE DISCOVERED</span><div className="hero-count">{featuredCategories.length.toString().padStart(2,'0')}<small>curated categories</small></div></div>
   </div>
   <div className="hero-visual ar-multi-product-visual"><div className="hero-photo"><HeroProductCarousel products={showcase}/></div><div className="hero-artline"><span>THE ALDEN ROVELL EDIT</span><span>MADE TO BE DISCOVERED</span></div></div>
  </div></section>
  <div className="ar-marquee" aria-label="Our collections"><div className="ar-marquee-track" aria-hidden="true">{[0,1].map(copy=><div className="ar-marquee-group" key={copy}>{['JEWELLERY','✦','FOOTWEAR','✦','MASSAGERS','✦','THOUGHTFULLY CURATED','✦'].map((label,i)=><span key={i}>{label}</span>)}</div>)}</div></div>
  <div className="container ar-service-strip" aria-label="Store highlights">
   <div className="ar-benefit-item"><Truck size={23} strokeWidth={1.6}/><div><strong>Delivery on us</strong><span>Free shipping across Pakistan</span></div></div>
   <div className="ar-benefit-item"><RefreshCcw size={22} strokeWidth={1.6}/><div><strong>7-day return requests</strong><span>For eligible order issues</span></div></div>
   <div className="ar-benefit-item"><ShieldCheck size={22} strokeWidth={1.6}/><div><strong>Considered selections</strong><span>Discover products by collection</span></div></div>
  </div>
  <section className="ar-category-section container" aria-label="Shop store categories">
   <div className="ar-section-intro"><div><span className="eyebrow">EXPLORE THE EDIT</span><h2>Find your next <span className="ar-title-soft">favorite.</span></h2></div><p>Three collections. A world of details.</p></div>
   <div className="ar-category-tiles">{featuredCategories.map((cat,i)=><Link key={cat.id} href={'/shop?category='+encodeURIComponent(cat.name)} className={'ar-category-tile ar-category-tile-'+i}>
    <div className="ar-category-info"><span className="ar-category-label">COLLECTION / {String(i+1).padStart(2,'0')}</span><h3>{cat.name}</h3><span className="ar-category-action">Discover the collection <ArrowUpRight size={17}/></span></div>
    <div className="ar-category-photo">{cat.thumbnail?<Image src={cat.thumbnail} alt={cat.name+' curated collection'} fill unoptimized sizes="(max-width:720px) 100vw, 33vw" className="ar-category-product"/>:<span aria-hidden="true">{cat.name.charAt(0)}</span>}</div>
   </Link>)}</div>
  </section>
  <section className="ar-depth-section" aria-label="A closer look at Alden Rovell">
   <div className="container ar-depth-layout">
    <div className="ar-depth-copy"><span className="eyebrow">THE FINER DETAILS</span><h2>A little more <span className="ar-title-soft">extraordinary.</span></h2><p>Thoughtful style lives in the details. Explore a carefully arranged mix of jewellery, footwear and essentials, at your own pace.</p><Link href="/shop" className="ar-text-cta">Discover what’s new <ArrowUpRight size={20}/></Link><div className="ar-depth-index"><span>01 / 03</span><span>A CLOSER LOOK AT THE COLLECTION</span></div></div>
    <div className="ar-depth-visual">
     <div className="ar-depth-ring" aria-hidden="true"></div>
     {editorial&&<Link href={'/product/'+editorial.slug} className="ar-depth-card ar-depth-card-primary" aria-label={'Explore '+editorial.title}><Image fill unoptimized src={editorial.images[0]?.src||'/brand/mark-clean.png'} alt={editorial.title} sizes="(max-width:700px) 65vw, 30vw"/><span>JEWELLERY <MoveUpRight size={18}/></span></Link>}
     {second&&<Link href={'/product/'+second.slug} className="ar-depth-card ar-depth-card-secondary" aria-label={'Explore '+second.title}><Image fill unoptimized src={second.images[0]?.src||'/brand/mark-clean.png'} alt={second.title} sizes="(max-width:700px) 44vw, 18vw"/><span>FOOTWEAR <MoveUpRight size={15}/></span></Link>}
     <div className="ar-depth-stamp">ALDEN ROVELL <span>✳</span> CURATED FINDS</div>
    </div>
   </div>
  </section>
  <section className="container ar-faq-section"><div className="ar-faq-intro"><div><span className="eyebrow">GOOD TO KNOW</span><h2>Questions, <span className="ar-title-soft">answered.</span></h2><p>All the essentials about shopping with Alden Rovell.</p><Link href="/faq" className="ar-text-cta">Visit our FAQ page <ArrowUpRight size={18}/></Link></div><span className="ar-faq-decor" aria-hidden="true">?</span></div><FaqList compact/></section>
  <section className="ar-invite-section"><div className="container ar-invite-panel"><div><span className="eyebrow">ALDEN ROVELL</span><h2>Something worth <span>discovering.</span></h2><p>Explore our collections, with delivery across Pakistan on us.</p></div><Link href="/shop" className="btn btn-light">Browse collections <ArrowDownRight size={20}/></Link></div></section>
 </>;
}
