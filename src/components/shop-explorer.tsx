"use client";
import {useMemo,useState} from "react";
import {useSearchParams,useRouter} from "next/navigation";
import {Search,SlidersHorizontal,X,ChevronRight} from "lucide-react";
import type {Product} from "@/lib/types";
import {ProductCard} from "./product-card";
type Category={id:string;name:string;slug:string;parent_id:string|null;visible:boolean;sort_order:number;image_url?:string|null;image_tile?:number|null};
export function ShopExplorer({products,categories=[]}:{products:Product[];categories?:Category[]}){
 const router=useRouter(),params=useSearchParams();
 const parentCategories=categories.filter(c=>c.visible&&!c.parent_id);
 const cats=["All",...parentCategories.map(c=>c.name)];
 const requested=params.get("category")||"All";
 const category=cats.includes(requested)?requested:"All";
 const parent=parentCategories.find(c=>c.name===category);
 const children=categories.filter(c=>c.visible&&c.parent_id===parent?.id);
 const requestedSub=params.get("subcategory")||"";
 const subcategory=children.some(c=>c.name===requestedSub)?requestedSub:"";
 const [search,setSearch]=useState(""),[sort,setSort]=useState("featured");
 const filtered=useMemo(()=>{
  let arr=products.filter(p=>(category==="All"||p.category.split("/")[0].trim()===category)&&(!subcategory||p.category.split("/").slice(1).join("/").trim()===subcategory)&&(p.title+" "+p.category+" "+p.shortDescription).toLowerCase().includes(search.trim().toLowerCase()));
  if(sort==="az")arr=[...arr].sort((a,b)=>a.title.localeCompare(b.title));
  if(sort==="za")arr=[...arr].sort((a,b)=>b.title.localeCompare(a.title));
  return arr;
 },[products,category,subcategory,search,sort]);
 const choose=(c:string,child="")=>router.replace(c==="All"?"/shop":"/shop?category="+encodeURIComponent(c)+(child?"&subcategory="+encodeURIComponent(child):""),{scroll:false});
 return <>
 <div className="shop-tools"><div className="shop-search"><Search size={19}/><input type="search" aria-label="Search products and categories" placeholder="Search products and categories" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button type="button" aria-label="Clear search" onClick={()=>setSearch("")}><X size={17}/></button>}</div><div className="sort-wrap"><SlidersHorizontal size={17}/><select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="az">Name: A to Z</option><option value="za">Name: Z to A</option></select></div></div>
 <div className="category-tabs" role="group" aria-label="Browse categories">{cats.map(c=><button type="button" key={c} className={category===c?"selected":""} aria-pressed={category===c} onClick={()=>choose(c)}>{c}</button>)}</div>
 {parent&&children.length>0&&<section className="shop-subcategories" aria-label={category+" subcategories"}><div className="subcategory-heading"><strong>Explore {category}</strong><span>{children.length} categories</span></div><div className="subcategory-scroll"><button className={"subcategory-choice "+(!subcategory?"selected":"")} onClick={()=>choose(category)}><span className="subcategory-icon">✦</span><span>View All</span></button>{children.map((c,i)=><button key={c.id} className={"subcategory-choice "+(subcategory===c.name?"selected":"")} onClick={()=>choose(category,c.name)}><span className="subcategory-icon">{c.image_url?<img src={c.image_url} alt="" loading="lazy" width={88} height={88} className="subcategory-photo"/>:<span aria-hidden="true">{category==="Footwear"?"👟":category==="Jewellery"?"💍":"💆"}</span>}</span><span>{c.name}</span></button>)}</div></section>}
 <div className="results-line"><span aria-live="polite">{filtered.length} product{filtered.length===1?"":"s"}</span><span>{category==="All"?"Explore our collection":subcategory||category}</span></div>
 {filtered.length?<div className="products-grid">{filtered.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>:<div className="empty-panel"><Search size={27}/><h2>Products coming soon</h2><p>We are adding products to {subcategory||category==="All"?"this category":category}. Explore another category in the meantime.</p><button className="btn btn-dark" onClick={()=>{setSearch("");choose("All")}}>View all products <ChevronRight size={16}/></button></div>}
 </>;
}
