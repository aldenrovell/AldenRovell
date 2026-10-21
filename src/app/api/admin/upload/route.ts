import {NextResponse} from 'next/server';
import {staff,permitted} from '@/lib/permissions';
export const runtime='nodejs';
export async function POST(req:Request){
 const a=await staff(req);if(!a||!permitted(a,'media'))return NextResponse.json({error:'Media permission required'},{status:403});
 const form=await req.formData().catch(()=>null),file=form?.get('file'),id=String(form?.get('productId')||'');
 if(!(file instanceof File)||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size<1||file.size>5*1024*1024||!/^P[A-Z0-9]{2,40}$/.test(id))return NextResponse.json({error:'Choose a JPG, PNG or WebP under 5MB'},{status:400});
 const bytes=new Uint8Array(await file.arrayBuffer());
 const valid=file.type==='image/png'?bytes[0]===137&&bytes[1]===80:file.type==='image/jpeg'?bytes[0]===255&&bytes[1]===216:bytes[0]===82&&bytes[1]===73&&bytes[8]===87;
 if(!valid)return NextResponse.json({error:'Invalid image file'},{status:400});
 const path=id.toLowerCase()+'/'+crypto.randomUUID()+'.'+(file.type==='image/jpeg'?'jpg':file.type.split('/')[1]);
 const {error}=await a.db.storage.from('product-images').upload(path,bytes,{contentType:file.type,upsert:false});
 if(error)return NextResponse.json({error:'Upload failed'},{status:500});
 const {data}=a.db.storage.from('product-images').getPublicUrl(path);
 return NextResponse.json({src:data.publicUrl});
}
