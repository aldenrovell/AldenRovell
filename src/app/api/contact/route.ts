import {NextResponse} from 'next/server';
import {adminDb} from '@/lib/store';
export const runtime='nodejs';
export async function POST(req:Request){
 const size=Number(req.headers.get('content-length')||0);if(size>10000)return NextResponse.json({error:'Message too large'},{status:413});
 let x:Record<string,unknown>;try{x=await req.json();}catch{return NextResponse.json({error:'Invalid JSON'},{status:400});}
 const s=(k:string)=>typeof x[k]==='string'?(x[k] as string).trim():'';
 if(s('website'))return NextResponse.json({ok:true});
 const name=s('name'),email=s('email'),phone=s('phone'),subject=s('subject'),body=s('body');
 if(name.length<2||name.length>120||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||phone.length>40||subject.length<2||subject.length>160||body.length<10||body.length>5000)return NextResponse.json({error:'Please check your message details.'},{status:400});
 const db=adminDb();if(!db)return NextResponse.json({error:'Contact service unavailable'},{status:503});
 const {error}=await db.from('store_messages').insert({customer_name:name,email,phone,subject,body});
 return error?NextResponse.json({error:'Message could not be saved'},{status:500}):NextResponse.json({ok:true},{status:201});
}
