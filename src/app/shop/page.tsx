import {pageSeo} from '@/lib/seo';
import {Suspense} from 'react';
import {getProducts} from '@/lib/store';
import {getCategories} from '@/lib/site-cms';
import {ShopExplorer} from '@/components/shop-explorer';
export const dynamic='force-dynamic';
export const metadata=pageSeo({title:'Shop Jewellery, Footwear & Massagers in Pakistan',description:'Explore Alden Rovell curated jewellery, footwear and wellness collections in Pakistan. Shop premium finds with free delivery on 2+ items.',path:'/shop'});
export default async function Shop(){
 const [products,categories]=await Promise.all([getProducts(),getCategories()]);
 return <Suspense fallback={<div className="container standard-page"><p>Loading collections…</p></div>}><ShopExplorer products={products.filter(p=>p.published)} categories={categories}/></Suspense>;
}
