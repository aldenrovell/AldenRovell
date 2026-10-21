import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/store';
import { validateOrderPayload } from '@/lib/validate';
export const runtime='nodejs';
export async function POST(request:Request){
 let input:unknown;try{input=await request.json();}catch{return NextResponse.json({error:'Invalid JSON.'},{status:400});}
 const checked=validateOrderPayload(input);if(!checked.ok)return NextResponse.json({error:checked.message},{status:400});
 const db=adminDb();if(!db)return NextResponse.json({error:'Order service unavailable.'},{status:503});
 const {customer,items,idempotencyKey}=checked.value;
 const {data,error}=await db.rpc('place_order_request',{p_customer:customer,p_lines:items,p_idempotency:idempotencyKey});
 if(error){console.error('Order request failed',error.code,error.message);return NextResponse.json({error:'Unable to save request. Check product availability and retry.'},{status:409});}
 if(!data?.reference)return NextResponse.json({error:'Order reference missing'},{status:500});
 let notificationSent=false;
 const key=process.env.RESEND_API_KEY,to=process.env.ORDER_NOTIFY_EMAIL,from=process.env.ORDER_FROM_EMAIL;
 if(key&&to&&from&&!data.already_received){try{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],subject:'New Alden Rovell order request '+data.reference,text:'New order request: '+data.reference+'\nCustomer: '+customer.name+'\nPhone: '+customer.phone+'\nCity: '+customer.city+'\nItems: '+items.map(i=>i.id+' x '+i.quantity).join(', ')+'\nSubtotal: Rs. '+data.subtotal_pkr+'\nDelivery and COD terms require confirmation.'})});notificationSent=r.ok;}catch(e){console.error('Order email failed',e);}}
 return NextResponse.json({reference:data.reference,subtotalPkr:data.subtotal_pkr,shippingPkr:data.shipping_pkr??null,totalPkr:data.total_pkr??null,status:'pending_confirmation',notificationSent},{status:201});
}