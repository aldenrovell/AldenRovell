'use client';
import Image from 'next/image';
import {useMemo,useState} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import {Search,SlidersHorizontal,X,ChevronRight,ArrowLeft,ArrowUpRight,Watch,Shirt,Truck,RefreshCcw,CreditCard} from 'lucide-react';
import type {Product} from '@/lib/types';
import {ProductCard} from './product-card';
type Category={id:string;name:string;slug:string;parent_id:string|null;visible:boolean;sort_order:number;image_url?:string|null};
const SHOW_CATEGORIES=['Massagers','Jewellery','Footwear'];
const COLLECTION_COVERS=[
{name:'Massagers',title:'Massagers',asset:'massagers',description:'Wellness & relaxation'},
{name:'Jewellery',title:'Jewellery',asset:'jewellery',description:'Everyday elegance'},
{name:'Footwear',title:"Men's Footwear",asset:'mens-footwear',audience:'men',description:'Styles coming soon'},
{name:'Footwear',title:"Women's Footwear",asset:'womens-footwear',audience:'women',description:'Explore our styles'},
{name:"Men's Watches",title:"Men's Watches",asset:'mens-watches',planned:true,description:'Coming soon'},
{name:"Women's Watches",title:"Women's Watches",asset:'womens-watches',planned:true,description:'Coming soon'},
{name:"Men's T-Shirts",title:"Men's T-Shirts",asset:'mens-tshirts',planned:true,description:'Coming soon'},
{name:"Women's T-Shirts",title:"Women's T-Shirts",asset:'womens-tshirts',planned:true,description:'Coming soon'}
] as const;
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
 const audience=parent?.name==='Footwear'?(params.get('audience')||''):'';
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
   const part=rest.join('/').trim();
   const audienceMatch=parent.name!=='Footwear'||Boolean(subcategory)||!audience||(audience==='women'?part.startsWith("Women's"):audience==='men'?part.startsWith("Men's"):true);
   return group.trim()===parent.name&&audienceMatch&&(!subcategory||part===subcategory)&&(p.title+' '+p.category+' '+p.shortDescription).toLowerCase().includes(search.trim().toLowerCase());
  });
  if(sort==='az')items=[...items].sort((a,b)=>a.title.localeCompare(b.title));
  if(sort==='za')items=[...items].sort((a,b)=>b.title.localeCompare(a.title));
  return items;
 },[products,parent,subcategory,audience,search,sort]);
 if(!parent)return <main className="ar-d1-home ar-d1-shop-landing" aria-label="Alden Rovell shop collections">
  <section className="ar-d1-width ar-d1-shop-opening"><span className="ar-d1-eyebrow">ALDEN ROVELL / THE EDIT</span><h1>Explore our <em>Collections.</em></h1><p>Discover our curated range of {products.length} real products, and what's coming next.</p>
   <div className="ar-d1-shop-hero"><Image src="/collection-covers/collections-hero.webp" fill priority unoptimized alt="Alden Rovell collections showcase: jewellery, footwear, wellness, watches, and shirts" sizes="(max-width:780px) 96vw,90vw"/><span className="ar-d1-banner-sheen" aria-hidden="true"/></div>
  </section>
  <section className="ar-d1-width ar-d1-categories" aria-label="Browse categories"><div className="ar-d1-category-grid">{COLLECTION_COVERS.map(c=>{
   const cat=parents.find(x=>x.name===c.name);
   const enabled=Boolean(cat&& !('planned' in c&&c.planned));
   const path='/collection-covers/'+c.asset+'.webp';
   return enabled?<button type="button" key={c.title} className="ar-d1-category-card" onClick={()=>{setSearch('');router.push('/shop?category='+encodeURIComponent(c.name)+('audience' in c?'&audience='+c.audience:''),{scroll:false})}}>
    <span className="ar-d1-category-image"><Image src={path} fill unoptimized alt={c.title+' category cover'} sizes="(max-width:700px) 46vw,15vw" className="object-cover"/></span><strong>{c.title}</strong><span>{c.description}</span>
   </button>:<div key={c.title} className="ar-d1-category-card ar-d1-category-upcoming"><span className="ar-d1-category-image ar-d1-planned-art"><Image src={path} fill unoptimized alt={c.title+' upcoming collection concept'} sizes="(max-width:700px) 46vw,15vw" className="object-cover"/><span className="ar-d1-coming">COMING SOON</span></span><strong>{c.title}</strong><span>{c.description}</span></div>
  })}</div></section>
  <section className="ar-d1-width ar-d1-policies" aria-label="Store policies"><div><Truck/><p><strong>1 Item Delivery <b>Rs. 199</b></strong><small>Across Pakistan</small></p></div><div><Truck/><p><strong>2+ Items <b>Free Delivery</b></strong><small>Across Pakistan</small></p></div><div><RefreshCcw/><p><strong>7 Day Returns</strong><small>Eligible requests</small></p></div><div><CreditCard/><p><strong>Cash on Delivery</strong><small>At checkout</small></p></div></section>
  <section className="ar-d1-width ar-d1-featured"><div className="ar-d1-titlebar"><div><span className="ar-d1-eyebrow">CURRENT CATALOGUE</span><h2>Shop the <em>Collection.</em></h2><p>All {products.length} products currently offered by Alden Rovell.</p></div></div><div className="ar-d1-product-grid">{products.map((p,i)=><a href={'/product/'+p.slug} className="ar-d1-product-card" key={p.id}><span className="ar-d1-product-image" style={{display:'block',position:'relative',width:'100%'}}><Image src={p.images[0]?.src||'/brand/mark-clean.png'} fill unoptimized alt={p.title} sizes="(max-width:600px) 48vw,(max-width:1000px) 30vw,17vw" className="object-contain"/><span className="ar-d1-card-index">{String(i+1).padStart(2,'0')}</span></span><span className="ar-d1-product-info"><small>{p.category.split('/')[0]}</small><strong>{p.title}</strong><b>{p.pricePkr===null?'Price pending':'Rs. '+p.pricePkr.toLocaleString('en-PK')}</b></span></a>)}</div></section>
 </main>;
 return <div className="container standard-page ar-shop-category-view">
  <div className="ar-shop-category-title"><span className="eyebrow">ALDEN ROVELL / {parent.name.toUpperCase()}</span><h1>{audience?(audience==='women'?"Women's Footwear":"Men's Footwear"):parent.name}<span className="heading-dot">.</span></h1><p>Discover the {audience?audience+"'s footwear":parent.name.toLowerCase()} collection.</p></div>
  {parent.name==='Footwear'&&<div className="ar-d1-gender-tabs" aria-label="Footwear selection"><button className={!audience?'selected':''} onClick={()=>choose('Footwear')}>All Footwear</button><button className={audience==='women'?'selected':''} onClick={()=>router.push('/shop?category=Footwear&audience=women')}>Women's Footwear</button><button className={audience==='men'?'selected':''} onClick={()=>router.push('/shop?category=Footwear&audience=men')}>Men's Footwear</button></div>}
  <div className="ar-shop-navigation"><button type="button" className="ar-back-categories" onClick={()=>choose('')}><ArrowLeft size={16}/> All categories</button><span className="eyebrow">{parent.name.toUpperCase()} COLLECTION</span></div>
  <div className="shop-tools"><div className="shop-search"><Search size={19}/><input type="search" aria-label="Search within this category" placeholder={'Search '+parent.name.toLowerCase()} value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button type="button" aria-label="Clear search" onClick={()=>setSearch('')}><X size={17}/></button>}</div><div className="sort-wrap"><SlidersHorizontal size={17}/><select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="az">Name: A to Z</option><option value="za">Name: Z to A</option></select></div></div>
  {grouped?<section className="ar-categories-grouped" aria-label="Explore Footwear">
    <div className="subcategory-heading"><strong>Explore Footwear</strong><span>Choose women's, men's or accessories</span></div>
    <div className="ar-footwear-group-links"><button className={!subcategory?'active':''} onClick={()=>choose(parent.name)}>All Footwear</button>{[['Women',grouped.women],['Men',grouped.men],['Accessories',grouped.other]].filter(([,items])=>(items as Category[]).length>0).map(([label,items])=><a key={String(label)} href={'#footwear-'+String(label).toLowerCase()}>{String(label)} <span>{(items as Category[]).length}</span></a>)}</div>
    {([['Women',grouped.women],['Men',grouped.men],['Accessories',grouped.other]] as [string,Category[]][]).filter(([,items])=>items.length).map(([label,items])=><div className="ar-category-group" key={label} id={'footwear-'+label.toLowerCase()}><h3>{label==='Accessories'?'Footwear Accessories':label+"'s Footwear"}</h3><div className="ar-category-grid"><div className="ar-category-grid-items">{items.map(c=><button type="button" key={c.id} className={'subcategory-choice '+(subcategory===c.name?'selected':'')} onClick={()=>choose(parent.name,c.name)}><span className="subcategory-icon">{c.image_url?<img src={c.image_url} alt="" loading="lazy" width={88} height={88} className="subcategory-photo"/>:<span aria-hidden="true">👟</span>}</span><span>{c.name}</span></button>)}</div></div></div>)}
  </section>:children.length>0&&<section className="shop-subcategories" aria-label={parent.name+' subcategories'}><div className="subcategory-heading"><strong>Explore {parent.name}</strong><span>{children.length} subcategories</span></div><div className="subcategory-scroll"><button type="button" className={'subcategory-choice '+(!subcategory?'selected':'')} onClick={()=>choose(parent.name)}><span className="subcategory-icon">✦</span><span>View All</span></button>{children.map(c=><button type="button" key={c.id} className={'subcategory-choice '+(subcategory===c.name?'selected':'')} onClick={()=>choose(parent.name,c.name)}><span className="subcategory-icon">{c.image_url?<img src={c.image_url} alt="" loading="lazy" width={88} height={88} className="subcategory-photo"/>:<span aria-hidden="true">{parent.name==='Jewellery'?'💍':'💆'}</span>}</span><span>{c.name}</span></button>)}</div></section>}
  <div className="results-line"><span aria-live="polite">{filtered.length} product{filtered.length===1?'':'s'}</span><span>{subcategory||parent.name}</span></div>
  {filtered.length?<div className="products-grid">{filtered.map((product,index)=><ProductCard key={product.id} product={product} index={index}/>)}</div>:<div className="empty-panel"><Search size={27}/><h2>{audience==='men'?"Men's footwear coming soon":'No matching products'}</h2><p>{audience==='men'?"We're preparing this collection. No men's footwear products are listed yet.":'Try another subcategory or explore the full collection.'}</p><button type="button" className="btn btn-dark" onClick={()=>choose(parent.name)}>View all in {parent.name} <ChevronRight size={16}/></button></div>}
 </div>;
}
