'use client';
import Image from 'next/image';
import {useMemo,useState} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import {Search,SlidersHorizontal,X,ChevronRight,ArrowLeft,ArrowUpRight,Watch,Shirt,Truck,RefreshCcw,CreditCard} from 'lucide-react';
import type {Product} from '@/lib/types';
import {ProductCard} from './product-card';
type Category={id:string;name:string;slug:string;parent_id:string|null;visible:boolean;sort_order:number;image_url?:string|null};
const SHOW_CATEGORIES=['Massagers','Jewellery','Footwear'];
function LuxuryFlorals({corner}:{corner:'top'|'bottom'}){
 const spots=corner==='top'?[[51,105,1],[126,64,.88],[159,140,.69],[234,88,.58]]:[[66,109,.88],[145,157,.95],[214,84,.73],[281,135,.53]];
 return <svg className={'ar-luxury-flowers ar-luxury-flowers-'+corner} viewBox="0 0 350 245" role="presentation" aria-hidden="true" focusable="false">
  <defs>
   <radialGradient id={'ar-flower-'+corner}><stop offset="0" stopColor="#a91530"/><stop offset=".58" stopColor="#860d20"/><stop offset="1" stopColor="#3f0612"/></radialGradient>
   <linearGradient id={'ar-branch-'+corner} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a27137"/><stop offset=".5" stopColor="#e9bd66"/><stop offset="1" stopColor="#7b4920"/></linearGradient>
  </defs>
  <g fill="none" stroke={'url(#ar-branch-'+corner+')'} strokeWidth="2.6" strokeLinecap="round">
   <path d="M-15 30 C55 72 102 95 174 100 S296 123 353 167"/>
   <path d="M77 84 Q87 41 148 18"/><path d="M161 99 Q191 34 263 27"/><path d="M194 114 Q202 159 254 196"/>
  </g>
  {spots.map(([x,y,scale],i)=><g key={i} transform={`translate(${x} ${y}) scale(${scale})`}>
   {[0,72,144,216,288].map(angle=><ellipse key={angle} transform={`rotate(${angle})`} cy="-19" rx="17" ry="29" fill={'url(#ar-flower-'+corner+')'} stroke="#c75056" strokeWidth=".8"/>)}
   <circle r="9" fill="#f1c777"/><circle r="5" fill="#ab712c"/>
   {[0,60,120,180,240,300].map(deg=><circle key={deg} cx={Math.cos(deg*Math.PI/180)*5} cy={Math.sin(deg*Math.PI/180)*5} r="1.25" fill="#fff2af"/>)}
  </g>)}
  {[ [89,47],[177,70],[276,124],[305,155],[248,196] ].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%2?4:6} fill="#a11c2a" stroke="#e1a75d" strokeWidth="2"/>)}
 </svg>;
}
export function ShopExplorer({products,categories=[]}:{products:Product[];categories?:Category[]}){
 const router=useRouter(),params=useSearchParams();
 const parents=categories.filter(c=>c.visible&&!c.parent_id&&SHOW_CATEGORIES.includes(c.name));
 const parent=parents.find(c=>c.name===(params.get('category')||''));
 const children=parent?categories.filter(c=>c.visible&&c.parent_id===parent.id):[];
 const requestedSub=params.get('subcategory')||'';
 const subcategory=children.some(c=>c.name===requestedSub)?requestedSub:'';
 const [search,setSearch]=useState(''),[sort,setSort]=useState('featured');
 const choose=(name:string,sub='')=>{
  setSearch('');
  router.push(!name?'/shop':'/shop?category='+encodeURIComponent(name)+(sub?'&subcategory='+encodeURIComponent(sub):''),{scroll:false});
 };
 const grouped=parent?.name==='Footwear'?{women:children.filter(c=>c.name.startsWith("Women's")),men:children.filter(c=>c.name.startsWith("Men's")),other:children.filter(c=>!c.name.startsWith("Women's")&&!c.name.startsWith("Men's"))}:null;
 const filtered=useMemo(()=>{
  if(!parent)return [];
  let items=products.filter(p=>{
   const [group,...rest]=p.category.split('/');
   return group.trim()===parent.name&&(!subcategory||rest.join('/').trim()===subcategory)&&(p.title+' '+p.category+' '+p.shortDescription).toLowerCase().includes(search.trim().toLowerCase());
  });
  if(sort==='az')items=[...items].sort((a,b)=>a.title.localeCompare(b.title));
  if(sort==='za')items=[...items].sort((a,b)=>b.title.localeCompare(a.title));
  return items;
 },[products,parent,subcategory,search,sort]);
 if(!parent)return <main className="ar-d1-home ar-d1-shop-landing" aria-label="Alden Rovell shop collections">
  <section className="ar-d1-width ar-d1-shop-opening"><span className="ar-d1-eyebrow">ALDEN ROVELL / THE EDIT</span><h1>Explore our <em>Collections.</em></h1><p>Discover our curated range, with ten products available to shop today.</p></section>
  <section className="ar-d1-width ar-d1-categories" aria-label="Browse categories"><div className="ar-d1-category-grid">{['Massagers','Jewellery','Footwear',"Men's Watches","Women's Watches","Men's T-Shirts","Women's T-Shirts"].map(name=>{
   const cat=parents.find(c=>c.name===name);
   const src=cat?.image_url||products.find(p=>p.category.split('/')[0].trim()===name)?.images[0]?.src;
   const ready=Boolean(cat&&['Massagers','Jewellery','Footwear'].includes(name));
   return ready?<button key={name} className="ar-d1-category-card" onClick={()=>choose(name)}><span className="ar-d1-category-image">{src?<Image src={src} fill unoptimized alt={name} sizes="(max-width:700px) 46vw, 14vw" className="object-contain"/>:<span aria-hidden="true">✧</span>}</span><strong>{name}</strong><span>Explore collection</span></button>:<div key={name} className="ar-d1-category-card ar-d1-category-upcoming"><span className="ar-d1-category-image ar-d1-planned-art">{name.includes('Watches')?<Watch size={50} strokeWidth={1.1}/>:<Shirt size={50} strokeWidth={1.1}/>}<span className="ar-d1-coming">COMING SOON</span></span><strong>{name}</strong><span>Collection in preparation</span></div>
  })}</div></section>
  <section className="ar-d1-width ar-d1-policies" aria-label="Store policies"><div><Truck/><p><strong>1 Item Delivery <b>Rs. 199</b></strong><small>Across Pakistan</small></p></div><div><Truck/><p><strong>2+ Items <b>Free Delivery</b></strong><small>Across Pakistan</small></p></div><div><RefreshCcw/><p><strong>7 Day Returns</strong><small>Eligible requests</small></p></div><div><CreditCard/><p><strong>Cash on Delivery</strong><small>At checkout</small></p></div></section>
  <section className="ar-d1-width ar-d1-featured"><div className="ar-d1-titlebar"><div><span className="ar-d1-eyebrow">CURRENT CATALOGUE</span><h2>Shop the <em>Collection.</em></h2><p>All {products.length} products currently offered by Alden Rovell.</p></div></div><div className="ar-d1-product-grid">{products.map((p,i)=><a href={'/product/'+p.slug} className="ar-d1-product-card" key={p.id}><span className="ar-d1-product-image"><Image src={p.images[0]?.src||'/brand/mark-clean.png'} fill unoptimized alt={p.title} sizes="(max-width:600px) 48vw,(max-width:1000px) 30vw,17vw" className="object-contain"/><span className="ar-d1-card-index">{String(i+1).padStart(2,'0')}</span></span><span className="ar-d1-product-info"><small>{p.category.split('/')[0]}</small><strong>{p.title}</strong><b>{p.pricePkr===null?'Price pending':'Rs. '+p.pricePkr.toLocaleString('en-PK')}</b></span></a>)}</div></section>
 </main>;
 return <div className="container standard-page ar-shop-category-view">
  <div className="ar-shop-category-title"><span className="eyebrow">ALDEN ROVELL / {parent.name.toUpperCase()}</span><h1>{parent.name}<span className="heading-dot">.</span></h1><p>Discover the {parent.name.toLowerCase()} collection.</p></div>
  <div className="ar-shop-navigation"><button type="button" className="ar-back-categories" onClick={()=>choose('')}><ArrowLeft size={16}/> All categories</button><span className="eyebrow">{parent.name.toUpperCase()} COLLECTION</span></div>
  <div className="shop-tools"><div className="shop-search"><Search size={19}/><input type="search" aria-label="Search within this category" placeholder={'Search '+parent.name.toLowerCase()} value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button type="button" aria-label="Clear search" onClick={()=>setSearch('')}><X size={17}/></button>}</div><div className="sort-wrap"><SlidersHorizontal size={17}/><select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="az">Name: A to Z</option><option value="za">Name: Z to A</option></select></div></div>
  {grouped?<section className="ar-categories-grouped" aria-label="Explore Footwear">
    <div className="subcategory-heading"><strong>Explore Footwear</strong><span>Choose women's, men's or accessories</span></div>
    <div className="ar-footwear-group-links"><button className={!subcategory?'active':''} onClick={()=>choose(parent.name)}>All Footwear</button>{[['Women',grouped.women],['Men',grouped.men],['Accessories',grouped.other]].filter(([,items])=>(items as Category[]).length>0).map(([label,items])=><a key={String(label)} href={'#footwear-'+String(label).toLowerCase()}>{String(label)} <span>{(items as Category[]).length}</span></a>)}</div>
    {([['Women',grouped.women],['Men',grouped.men],['Accessories',grouped.other]] as [string,Category[]][]).filter(([,items])=>items.length).map(([label,items])=><div className="ar-category-group" key={label} id={'footwear-'+label.toLowerCase()}><h3>{label==='Accessories'?'Footwear Accessories':label+"'s Footwear"}</h3><div className="ar-category-grid"><div className="ar-category-grid-items">{items.map(c=><button type="button" key={c.id} className={'subcategory-choice '+(subcategory===c.name?'selected':'')} onClick={()=>choose(parent.name,c.name)}><span className="subcategory-icon">{c.image_url?<img src={c.image_url} alt="" loading="lazy" width={88} height={88} className="subcategory-photo"/>:<span aria-hidden="true">👟</span>}</span><span>{c.name}</span></button>)}</div></div></div>)}
  </section>:children.length>0&&<section className="shop-subcategories" aria-label={parent.name+' subcategories'}><div className="subcategory-heading"><strong>Explore {parent.name}</strong><span>{children.length} subcategories</span></div><div className="subcategory-scroll"><button type="button" className={'subcategory-choice '+(!subcategory?'selected':'')} onClick={()=>choose(parent.name)}><span className="subcategory-icon">✦</span><span>View All</span></button>{children.map(c=><button type="button" key={c.id} className={'subcategory-choice '+(subcategory===c.name?'selected':'')} onClick={()=>choose(parent.name,c.name)}><span className="subcategory-icon">{c.image_url?<img src={c.image_url} alt="" loading="lazy" width={88} height={88} className="subcategory-photo"/>:<span aria-hidden="true">{parent.name==='Jewellery'?'💍':'💆'}</span>}</span><span>{c.name}</span></button>)}</div></section>}
  <div className="results-line"><span aria-live="polite">{filtered.length} product{filtered.length===1?'':'s'}</span><span>{subcategory||parent.name}</span></div>
  {filtered.length?<div className="products-grid">{filtered.map((product,index)=><ProductCard key={product.id} product={product} index={index}/>)}</div>:<div className="empty-panel"><Search size={27}/><h2>No matching products</h2><p>Try another subcategory or explore the full collection.</p><button type="button" className="btn btn-dark" onClick={()=>choose(parent.name)}>View all in {parent.name} <ChevronRight size={16}/></button></div>}
 </div>;
}
