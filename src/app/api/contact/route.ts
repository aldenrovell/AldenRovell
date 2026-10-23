import {NextResponse} from 'next/server';
import {adminDb} from '@/lib/store';
import {validateContactPayload} from '@/lib/validate';
export const runtime='nodejs';
export async function POST(req:Request){
 const size=Number(req.headers.get('content-length')||0);
 if(size>10000)return NextResponse.json({error:'Message too large'},{status:413});
 let payload:unknown;
 try{payload=await req.json();}catch{return NextResponse.json({error:'Invalid JSON'},{status:400});}
 const result=validateContactPayload(payload);
 if(!result.ok)return NextResponse.json({error:result.message},{status:400});
 if(result.honeypot)return NextResponse.json({ok:true});
 const db=adminDb();
 if(!db)return NextResponse.json({error:'Contact service unavailable'},{status:503});
 const {error}=await db.from('store_messages').insert(result.value);
 return error?NextResponse.json({error:'Message could not be saved'},{status:500}):NextResponse.json({ok:true},{status:201});
}
