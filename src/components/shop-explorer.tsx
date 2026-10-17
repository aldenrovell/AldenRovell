"use client";
import {useMemo,useState} from "react";
import {useSearchParams,useRouter} from "next/navigation";
import {Search,SlidersHorizontal,X} from "lucide-react";
import type {Product} from "@/lib/types";
import {ProductCard} from "./product-card";
const cats=["All","Lifestyle","Accessories","Footwear"];
export function ShopExplorer({products}:{products:Product[]}){
 const router=useRouter(); const params=useSearchParams();
 const requested=params.get("category")||"All";
 const category=cats.includes(requested)?requested:"All";
 const [search,setSearch]=useState(""); const [sort,setSort]=useState("featured");
 const filtered=useMemo(()=>{
  let arr=products.filter(p=>(category==="All"||p.category.startsWith(category))&&(p.title+" "+p.category+" "+p.shortDescription).toLowerCase().includes(search.trim().toLowerCase()));
  if(sort==="az")arr=[...arr].sort((a,b)=>a.title.localeCompare(b.title));
  if(sort==="za")arr=[...arr].sort((a,b)=>b.title.localeCompare(a.title));
  return arr;
 },[products,category,search,sort]);
 const choose=(c:string)=>router.replace(c==="All"?"/shop":`/shop?category=${encodeURIComponent(c)}`,{scroll:false});
 return <>
  <div className="shop-tools"><div className="shop-search"><Search size={19}/><input type="search" aria-label="Search products" placeholder="Search products and categories" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button type="button" aria-label="Clear search" onClick={()=>setSearch("")}><X size={17}/></button>}</div><div className="sort-wrap"><SlidersHorizontal size={17}/><select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="az">Name: A to Z</option><option value="za">Name: Z to A</option></select></div></div>
  <div className="category-tabs" role="group" aria-label="Filter products by category">{cats.map(c=><button type="button" key={c} className={category===c?"selected":""} aria-pressed={category===c} onClick={()=>choose(c)}>{c}</button>)}</div>
  <div className="results-line"><span aria-live="polite">{filtered.length} design{filtered.length===1?"":"s"}</span><span>All listings are currently previews</span></div>
  {filtered.length?<div className="products-grid">{filtered.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>:<div className="empty-panel"><Search size={27}/><h2>No products found</h2><p>Try a different product name or category.</p><button className="btn btn-dark" type="button" onClick={()=>{setSearch("");choose("All")}}>Clear filters</button></div>}
 </>;
}
