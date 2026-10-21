import {NextResponse} from 'next/server';
import {requireAdmin,getProducts} from '@/lib/store';
const invalid=(error:string,status=400)=>NextResponse.json({error},{status});
export async function GET(req:Request){const a=await requireAdmin(req);if(!a.ok)return invalid(a.message,a.status);return NextResponse.json({products:await getProducts()});}
export async function POST(req:Request){return save(req,true);}
export async function PATCH(req:Request){return save(req,false);}
async function save(req:Request,creating:boolean){
 const a=await requireAdmin(req);if(!a.ok)return invalid(a.message,a.status);
 let x:Record<string,unknown>;try{x=await req.json();}catch{return invalid('Invalid JSON');}
 const id=x.id;if(typeof id!=='string'||!/^P[A-Z0-9]{2,40}$/.test(id))return invalid('Invalid product ID');
 const integerOrNull=(v:unknown)=>v===null||(typeof v==='number'&&Number.isSafeInteger(v)&&v>=0&&v<=100000000);
 if(!integerOrNull(x.pricePkr)||!integerOrNull(x.stock)||typeof x.published!=='boolean'||typeof x.imagesApproved!=='boolean'||typeof x.salesUnitVerified!=='boolean')return invalid('Invalid stock, price or approval flags');
 const details=x.details;
 if(!details||typeof details!=='object'||Array.isArray(details))return invalid('Product details required');
 const d=details as Record<string,unknown>;
 for(const field of ['title','slug','category','shortDescription','description','sku'])if(typeof d[field]!=='string'||!(d[field] as string).trim()||(d[field] as string).length>5000)return invalid('Invalid '+field);
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug as string))return invalid('Use a URL-safe slug');
 if(!Array.isArray(d.features)||d.features.length>30||d.features.some(v=>typeof v!=='string'||v.length>400))return invalid('Invalid features');
 const images=x.images;if(!Array.isArray(images)||images.length>12||images.some(v=>!v||typeof v!=='object'||typeof v.src!=='string'||v.src.length>1500||!(v.src.startsWith('/products/')||v.src.startsWith('https://vgwrvdgenovgegejsxbv.supabase.co/storage/v1/object/public/product-images/'))||typeof v.alt!=='string'||v.alt.length>300||typeof v.role!=='string'||v.role.length>80))return invalid('Invalid image gallery');
 if(x.published&&(!x.imagesApproved||!x.salesUnitVerified||x.pricePkr===null||x.stock===null||images.length===0))return invalid('Verify photos, stock, selling unit and price before publishing');
 const record={id,price_pkr:x.pricePkr,stock:x.stock,is_published:x.published,images_approved:x.imagesApproved,sales_unit_verified:x.salesUnitVerified,details:{title:d.title,slug:d.slug,category:d.category,shortDescription:d.shortDescription,description:d.description,features:d.features,sku:d.sku,reviewNote:typeof d.reviewNote==='string'?d.reviewNote:'',seoTitle:typeof d.seoTitle==='string'?d.seoTitle:d.title,metaDescription:typeof d.metaDescription==='string'?d.metaDescription:d.shortDescription},images,is_archived:false,updated_at:new Date().toISOString()};
 const duplicate=await a.db.from('store_products').select('id').neq('id',id).contains('details',{slug:d.slug}).limit(1);if(duplicate.error)return invalid('Could not validate slug',500);if(duplicate.data?.length)return invalid('Another product uses this URL slug',409);
 const q=creating?await a.db.from('store_products').insert(record):await a.db.from('store_products').update(record).eq('id',id).select('id');
 if(q.error)return invalid('Could not save product: '+q.error.message,409);
 if(!creating&&(!q.data||q.data.length===0))return invalid('Product not found',404);
 return NextResponse.json({ok:true,id});
}
export async function DELETE(req:Request){const a=await requireAdmin(req);if(!a.ok)return invalid(a.message,a.status);let body:unknown;try{body=await req.json();}catch{return invalid('Invalid JSON');}const id=(body as {id?:unknown})?.id;if(typeof id!=='string'||!/^P[A-Z0-9]{2,40}$/.test(id))return invalid('Invalid product ID');const {error}=await a.db.from('store_products').update({is_archived:true,is_published:false}).eq('id',id);return error?invalid('Could not archive product',500):NextResponse.json({ok:true});}
