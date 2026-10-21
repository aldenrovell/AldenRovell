import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/store';
export const runtime='nodejs';
export async function POST(req:Request){
 const a=await requireAdmin(req);if(!a.ok)return NextResponse.json({error:a.message},{status:a.status});
 let form:FormData;try{form=await req.formData();}catch{return NextResponse.json({error:'Invalid upload'},{status:400});}
 const file=form.get('file');if(!(file instanceof File))return NextResponse.json({error:'Choose an image'},{status:400});
 const valid=['image/jpeg','image/png','image/webp'];if(!valid.includes(file.type)||file.size>5*1024*1024||file.size===0)return NextResponse.json({error:'Only JPG, PNG or WebP files up to 5MB are allowed.'},{status:400});
 const id=String(form.get('productId')||'');if(!/^P[A-Z0-9]{2,40}$/.test(id))return NextResponse.json({error:'Invalid product ID'},{status:400});
 const bytes=new Uint8Array(await file.arrayBuffer());
 const png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
 const jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 const webp=bytes[0]===82&&bytes[1]===73&&bytes[2]===70&&bytes[3]===70&&bytes[8]===87&&bytes[9]===69&&bytes[10]===66&&bytes[11]===80;
 if(!(file.type==='image/png'&&png||file.type==='image/jpeg'&&jpeg||file.type==='image/webp'&&webp))return NextResponse.json({error:'File does not match image type'},{status:400});
 const ext=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
 const path=id.toLowerCase()+'/'+crypto.randomUUID()+'.'+ext;
 const {error}=await a.db.storage.from('product-images').upload(path,bytes,{contentType:file.type,cacheControl:'31536000',upsert:false});
 if(error)return NextResponse.json({error:'Storage upload failed'},{status:500});
 const {data}=a.db.storage.from('product-images').getPublicUrl(path);
 return NextResponse.json({src:data.publicUrl});
}
