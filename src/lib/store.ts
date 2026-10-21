import 'server-only';
import {createClient,type SupabaseClient} from '@supabase/supabase-js';
import draftData from '@/data/catalog.json';
import type {Product,StoreSettings} from '@/lib/types';
const draft=draftData as Product[];
export function adminDb():SupabaseClient|null {const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;return url&&key?createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}):null;}
export function publicAuth(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;return url&&key?createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}):null;}
export async function getProducts():Promise<Product[]>{
 const db=adminDb();if(!db)return draft;
 const {data,error}=await db.from('store_products').select('id,price_pkr,stock,is_published,images_approved,sales_unit_verified,details,images,is_archived').order('id');
 if(error){console.error('Catalog unavailable',error.message);return draft;}
 const original=new Map(draft.map(p=>[p.id,p]));
 return (data??[]).filter(r=>!r.is_archived).map(r=>{
   const defaults=original.get(r.id);
   const details=r.details&&typeof r.details==='object'&&!Array.isArray(r.details)?r.details as Partial<Product>:{};
   const images=Array.isArray(r.images)&&r.images.length?r.images:(defaults?.images??[]);
   return {...(defaults??{id:r.id,slug:r.id.toLowerCase(),title:r.id,category:'Lifestyle',shortDescription:'',description:'',features:[],reviewNote:'',sku:r.id,seoTitle:r.id,metaDescription:''}),...details,id:r.id,images,pricePkr:r.price_pkr,stock:r.stock,published:r.is_published,imagesApproved:r.images_approved,salesUnitVerified:r.sales_unit_verified} as Product;
 });
}
export async function getSettings():Promise<StoreSettings>{const db=adminDb();if(!db)return {codEnabled:false,shippingFeePkr:null,notice:null};const {data}=await db.from('store_settings').select('cod_enabled,shipping_fee_pkr,notice').eq('id',1).maybeSingle();return data?{codEnabled:data.cod_enabled,shippingFeePkr:data.shipping_fee_pkr,notice:data.notice}:{codEnabled:false,shippingFeePkr:null,notice:null};}
export async function requireAdmin(req:Request):Promise<{ok:true;db:SupabaseClient}|{ok:false;status:number;message:string}>{
 const db=adminDb(),auth=publicAuth();if(!db||!auth||!process.env.ADMIN_EMAIL)return {ok:false,status:503,message:'Admin backend is not configured.'};
 const token=req.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];if(!token)return {ok:false,status:401,message:'Sign in required.'};
 const {data,error}=await auth.auth.getUser(token);
 if(error||!data.user?.email||!data.user.email_confirmed_at)return{ok:false,status:403,message:'Not authorized.'};
 const email=data.user.email.toLowerCase();
 if(email!==process.env.ADMIN_EMAIL.toLowerCase()){
  const resource=new URL(req.url).pathname.split('/api/admin/')[1]?.split('/')[0];
  const permission=resource==='upload'?'media':resource;
  if(!['products','orders','messages','settings','media'].includes(permission))return{ok:false,status:403,message:'Permission denied.'};
  const {data:member}=await db.from('site_team').select('active,permissions').eq('email',email).maybeSingle();
  if(!member?.active||!Array.isArray(member.permissions)||!member.permissions.includes(permission))return{ok:false,status:403,message:'Permission denied.'};
 }
 return {ok:true,db};
}
