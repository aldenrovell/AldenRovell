'use client';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,ChevronLeft,ChevronRight} from 'lucide-react';
import {useEffect,useState} from 'react';
type Slide={id:string;title:string;category:string;src:string;href:string};
export function HeroProductCarousel({products}:{products:Slide[]}){
 const [current,setCurrent]=useState(0),[motion,setMotion]=useState(false),[paused,setPaused]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>setMotion(!media.matches&&document.documentElement.dataset.arMotion!=='off');
  sync();const observer=new MutationObserver(sync);
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-ar-motion']});
  media.addEventListener('change',sync);
  return ()=>{observer.disconnect();media.removeEventListener('change',sync)};
 },[]);
 useEffect(()=>{
  if(!motion||paused||products.length<2)return;
  const timer=window.setInterval(()=>{if(document.visibilityState==='visible')setCurrent(x=>(x+1)%products.length)},4800);
  return ()=>window.clearInterval(timer);
 },[motion,paused,products.length]);
 if(!products.length)return <div className="ar-hero-fallback"><strong>Curated collections</strong><Link href="/shop">Explore categories <ArrowUpRight size={16}/></Link></div>;
 const selected=products[current%products.length];
 const next=(direction:number)=>setCurrent(x=>(x+direction+products.length)%products.length);
 return <div className="ar-hero-carousel" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setPaused(false)}}>
  <div className="ar-hero-slides">{products.map((p,i)=><div key={p.id} className={'ar-hero-slide '+(current===i?'is-active':'')} aria-hidden={current!==i}><Image src={p.src} alt={current===i?p.title:''} fill unoptimized priority={i===0} sizes="(max-width:850px) 100vw,49vw" className="ar-hero-product-image"/></div>)}</div>
  <div className="ar-hero-carousel-meta"><div className="ar-hero-carousel-caption"><span>FEATURED COLLECTION</span><strong>{selected.category}</strong><Link href={selected.href} className="ar-hero-product-link">Explore product <ArrowUpRight size={14}/></Link></div>{products.length>1&&<div className="ar-carousel-nav"><button type="button" onClick={()=>next(-1)} aria-label="Previous featured product"><ChevronLeft size={17}/></button><span className="ar-carousel-position">{String(current+1).padStart(2,'0')} / {String(products.length).padStart(2,'0')}</span><button type="button" onClick={()=>next(1)} aria-label="Next featured product"><ChevronRight size={17}/></button></div>}</div>
  {products.length>1&&<div className="ar-carousel-dots" aria-label="Featured products">{products.map((p,i)=><button type="button" key={p.id} onClick={()=>setCurrent(i)} aria-label={'Show '+p.title} aria-current={current===i?'true':undefined} className={current===i?'active':''}/>)}</div>}
 </div>;
}
