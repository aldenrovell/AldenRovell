'use client';
import Image from 'next/image';
import {useMemo,useState} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import {Search,SlidersHorizontal,X,ChevronRight,ArrowLeft,ArrowUpRight} from 'lucide-react';
import type {Product} from '@/lib/types';
import {ProductCard} from './product-card';
type Category={id:string;name:string;slug:string;parent_id:string|null;visible:boolean;sort_order:number;image_url?:string|null};
const SHOW_CATEGORIES=['Massagers','Jewellery','Footwear'];
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
 if(!parent)return <section className="ar-shop-landing" aria-label="Shop by category">
  <div className="ar-shop-intro"><span className="eyebrow">CHOOSE YOUR COLLECTION</span><h2>Explore our categories<span className="heading-dot">.</span></h2><p>Start with a collection to discover its products.</p></div>
  <div className="ar-shop-category-grid">{parents.map(cat=>{
   const photo=cat.image_url||categories.find(child=>child.visible&&child.parent_id===cat.id&&child.image_url)?.image_url||products.find(p=>p.category.split('/')[0].trim()===cat.name)?.images[0]?.src;
   return <button key={cat.id} type="button" className="ar-shop-category-card" onClick={()=>choose(cat.name)} aria-label={'Browse '+cat.name}>
    <span className="ar-shop-card-image">{photo?<Image src={photo} fill unoptimized alt="" sizes="(max-width:680px) 85vw,33vw"/>:<span aria-hidden="true">{cat.name.slice(0,1)}</span>}</span>
    <span className="ar-shop-card-footer"><span><small>ALDEN ROVELL COLLECTION</small><strong>{cat.name}</strong></span><ArrowUpRight size={21}/></span>
   </button>;
  })}</div>
 </section>;
 return <>
  <div className="ar-shop-navigation"><button type="button" className="ar-back-categories" onClick={()=>choose('')}><ArrowLeft size={16}/> All categories</button><span className="eyebrow">{parent.name.toUpperCase()} COLLECTION</span></div>
  <div className="shop-tools"><div className="shop-search"><Search size={19}/><input type="search" aria-label="Search within this category" placeholder={'Search '+parent.name.toLowerCase()} value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button type="button" aria-label="Clear search" onClick={()=>setSearch('')}><X size={17}/></button>}</div><div className="sort-wrap"><SlidersHorizontal size={17}/><select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="az">Name: A to Z</option><option value="za">Name: Z to A</option></select></div></div>
  {grouped?<section className="ar-categories-grouped" aria-label="Explore Footwear">
    <div className="subcategory-heading"><strong>Explore Footwear</strong><span>Choose women's, men's or accessories</span></div>
    <div className="ar-footwear-group-links"><button className={!subcategory?'active':''} onClick={()=>choose(parent.name)}>All Footwear</button>{[['Women',grouped.women],['Men',grouped.men],['Accessories',grouped.other]].filter(([,items])=>(items as Category[]).length>0).map(([label,items])=><a key={String(label)} href={'#footwear-'+String(label).toLowerCase()}>{String(label)} <span>{(items as Category[]).length}</span></a>)}</div>
    {([['Women',grouped.women],['Men',grouped.men],['Accessories',grouped.other]] as [string,Category[]][]).filter(([,items])=>items.length).map(([label,items])=><div className="ar-category-group" key={label} id={'footwear-'+label.toLowerCase()}><h3>{label==='Accessories'?'Footwear Accessories':label+"'s Footwear"}</h3><div className="ar-category-grid"><div className="ar-category-grid-items">{items.map(c=><button type="button" key={c.id} className={'subcategory-choice '+(subcategory===c.name?'selected':'')} onClick={()=>choose(parent.name,c.name)}><span className="subcategory-icon">{c.image_url?<img src={c.image_url} alt="" loading="lazy" width={88} height={88} className="subcategory-photo"/>:<span aria-hidden="true">👟</span>}</span><span>{c.name}</span></button>)}</div></div></div>)}
  </section>:children.length>0&&<section className="shop-subcategories" aria-label={parent.name+' subcategories'}><div className="subcategory-heading"><strong>Explore {parent.name}</strong><span>{children.length} subcategories</span></div><div className="subcategory-scroll"><button type="button" className={'subcategory-choice '+(!subcategory?'selected':'')} onClick={()=>choose(parent.name)}><span className="subcategory-icon">✦</span><span>View All</span></button>{children.map(c=><button type="button" key={c.id} className={'subcategory-choice '+(subcategory===c.name?'selected':'')} onClick={()=>choose(parent.name,c.name)}><span className="subcategory-icon">{c.image_url?<img src={c.image_url} alt="" loading="lazy" width={88} height={88} className="subcategory-photo"/>:<span aria-hidden="true">{parent.name==='Jewellery'?'💍':'💆'}</span>}</span><span>{c.name}</span></button>)}</div></section>}
  <div className="results-line"><span aria-live="polite">{filtered.length} product{filtered.length===1?'':'s'}</span><span>{subcategory||parent.name}</span></div>
  {filtered.length?<div className="products-grid">{filtered.map((product,index)=><ProductCard key={product.id} product={product} index={index}/>)}</div>:<div className="empty-panel"><Search size={27}/><h2>No matching products</h2><p>Try another subcategory or explore the full collection.</p><button type="button" className="btn btn-dark" onClick={()=>choose(parent.name)}>View all in {parent.name} <ChevronRight size={16}/></button></div>}
 </>;
}
