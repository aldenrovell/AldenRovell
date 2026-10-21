import {NextResponse} from 'next/server';
import {staff,permitted} from '@/lib/permissions';
import {getProducts} from '@/lib/store';
const fail=(message:string,status=400)=>NextResponse.json({error:message},{status});
export async function GET(req:Request){const a=await staff(req);if(!a||!permitted(a,'products'))return fail('Products access required',403);return NextResponse.json({products:await getProducts()});}
export async function POST(req:Request){return save(req,true);}
export async function PATCH(req:Request){return save(req,false);}
async function save(req:Request,creating:boolean){
 const a=await staff(req);if(!a||!permitted(a,'products'))return fail('Products access required',403);
 const x:unknown=await req.json().catch(()=>null);
 if(!x||typeof x!=='object'||Array.isArray(x))return fail('Invalid form');
 const p=x as Record<string,unknown>,id=p.id;
 if(typeof id!=='string'||!/^P[A-Z0-9]{2,40}$/.test(id))return fail('Invalid ID');
 const validNumber=(n:unknown)=>n===null||(typeof n==='number'&&Number.isSafeInteger(n)&&n>=0&&n<=100000000);
 if(!validNumber(p.pricePkr)||!validNumber(p.stock)||typeof p.published!=='boolean'||typeof p.imagesApproved!=='boolean'||typeof p.salesUnitVerified!=='boolean')return fail('Invalid price, stock or flags');
 const d=p.details;if(!d||typeof d!=='object'||Array.isArray(d))return fail('Product details required');
 const details=d as Record<string,unknown>;
 for(const field of ['title','slug','category','shortDescription','description','sku'])if(typeof details[field]!=='string'||!(details[field] as string).trim()||(details[field] as string).length>5000)return fail('Invalid '+field);
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(details.slug as string))return fail('Invalid slug');
 if(!Array.isArray(details.features)||details.features.length>30||details.features.some(v=>typeof v!=='string'||v.length>400))return fail('Invalid features');
 const images=p.images;
 if(!Array.isArray(images)||images.length>12||images.some(v=>!v||typeof v!=='object'||typeof v.src!=='string'||!(v.src.startsWith('/products/')||v.src.startsWith('https://vgwrvdgenovgegejsxbv.supabase.co/storage/v1/object/public/product-images/'))||typeof v.alt!=='string'||typeof v.role!=='string'))return fail('Invalid images');
 if(p.published&&(!p.imagesApproved||!p.salesUnitVerified||p.pricePkr===null||p.stock===null||images.length===0))return fail('Verify photographs, prices and stock before publishing');
 const {data:old}=await a.db.from('store_products').select('price_pkr').eq('id',id).maybeSingle();
 if(!permitted(a,'prices')&&p.pricePkr!==(old?.price_pkr??null))return fail('Price editing permission required',403);
 const record={id,price_pkr:p.pricePkr,stock:p.stock,is_published:p.published,images_approved:p.imagesApproved,sales_unit_verified:p.salesUnitVerified,details:{title:details.title,slug:details.slug,category:details.category,shortDescription:details.shortDescription,description:details.description,sku:details.sku,features:details.features,seoTitle:typeof details.seoTitle==='string'?details.seoTitle:details.title,metaDescription:typeof details.metaDescription==='string'?details.metaDescription:details.shortDescription,reviewNote:typeof details.reviewNote==='string'?details.reviewNote:''},images,is_archived:false,updated_at:new Date().toISOString()};
 const {data:duplicate}=await a.db.from('store_products').select('id').neq('id',id).contains('details',{slug:details.slug}).limit(1);
 if(duplicate?.length)return fail('This URL slug already exists',409);
 const response=creating?await a.db.from('store_products').insert(record):await a.db.from('store_products').update(record).eq('id',id).select('id');
 if(response.error)return fail(response.error.message,409);
 if(!creating&&!response.data?.length)return fail('Product not found',404);
 return NextResponse.json({ok:true});
}
export async function DELETE(req:Request){const a=await staff(req);if(!a||!permitted(a,'products'))return fail('Products permission required',403);const x=await req.json().catch(()=>null);if(!x||typeof x.id!=='string')return fail('Invalid ID');const {error}=await a.db.from('store_products').update({is_archived:true,is_published:false}).eq('id',x.id);return error?fail('Archive failed',500):NextResponse.json({ok:true});}
