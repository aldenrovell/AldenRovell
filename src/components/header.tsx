"use client";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {Search, ShoppingBag, Menu, X, ArrowUpRight} from "lucide-react";
import {useState, useEffect} from "react";
import {useCart} from "./cart-provider";
const pages = [
  {title:"Shop all",href:"/shop"},
  {title:"Lifestyle",href:"/shop?category=Lifestyle"},
  {title:"Accessories",href:"/shop?category=Accessories"},
  {title:"Footwear",href:"/shop?category=Footwear"},
  {title:"Our story",href:"/about"}
];
export function Header(){
 const [open,setOpen]=useState(false);
 const pathname=usePathname();
 const {count}=useCart();
 const active=pathname;
 useEffect(()=>setOpen(false),[pathname]);
 useEffect(()=>{
   if(!open)return;
   const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};
   window.addEventListener("keydown",close);
   return()=>window.removeEventListener("keydown",close);
 },[open]);
 return <>
  <div className="announcement"><span>ALDEN ROVELL</span><span aria-hidden="true" className="announcement-diamond">◆</span><span>Pakistan collection preview</span></div>
  <header className="site-header">
   <div className="container header-inner">
    <button type="button" className="icon-button mobile-only" onClick={()=>setOpen(!open)} aria-label={open?"Close navigation":"Open navigation"} aria-controls="mobile-site-nav" aria-expanded={open}>{open?<X size={23}/>:<Menu size={23}/>}</button>
    <Link href="/" className="brand" aria-label="Alden Rovell, home page" onClick={()=>setOpen(false)}><Image src="/brand/primary-header-white.png" alt="Alden Rovell" width={1160} height={250} priority className="brand-image" sizes="(max-width: 640px) 152px, 210px"/></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{pages.map(p=><Link key={p.href} className={active===p.href?"nav-active":undefined} href={p.href} aria-current={active===p.href?"page":undefined}>{p.title}</Link>)}</nav>
    <div className="header-actions"><Link href="/shop" className="icon-button search-action" aria-label="Search products"><Search size={20}/></Link><Link href="/cart" className="cart-button" aria-label={`Shopping bag: ${count} items`}><ShoppingBag size={21}/>{count>0&&<span className="cart-count">{count}</span>}</Link></div>
   </div>
  </header>
  {open&&<div className="mobile-nav-backdrop" onClick={()=>setOpen(false)} aria-hidden="true"/>}
  <div className={`mobile-nav ${open?"mobile-nav-open":""}`} id="mobile-site-nav" hidden={!open}>
   <nav aria-label="Mobile navigation">{pages.map(p=><Link href={p.href} key={p.href} onClick={()=>setOpen(false)} aria-current={active===p.href?"page":undefined}>{p.title}<ArrowUpRight size={18}/></Link>)}</nav>
   <div className="mobile-nav-foot">Curated lifestyle • Accessories • Footwear</div>
  </div>
 </>;
}
