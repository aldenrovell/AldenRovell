export function validatePkPhone(phone:string){return /^(?:\+92|0)3\d{9}$/.test(phone.replace(/[\s-]/g,''));}
export function validateOrderPayload(input:unknown):{ok:true;value:{customer:{name:string;phone:string;city:string;province:string;address:string;notes:string};items:{id:string;quantity:number}[];idempotencyKey:string}}|{ok:false;message:string}{
 if(!input||typeof input!=='object')return{ok:false,message:'Invalid order.'};const x=input as Record<string,unknown>;const c=x.customer as Record<string,unknown>|null;if(!c||typeof c!=='object')return{ok:false,message:'Customer details required.'};
 const str=(v:unknown)=>typeof v==='string'?v.trim():'';const customer={name:str(c.name),phone:str(c.phone).replace(/[\s-]/g,''),city:str(c.city),province:str(c.province),address:str(c.address),notes:str(c.notes)};
 if(customer.name.length<2||customer.name.length>100)return{ok:false,message:'Enter a valid name.'};if(!validatePkPhone(customer.phone))return{ok:false,message:'Enter a valid Pakistani mobile number.'};if(customer.address.length<10||customer.address.length>350)return{ok:false,message:'Enter a full delivery address.'};if(customer.city.length<2||customer.city.length>80||customer.province.length<2||customer.province.length>80)return{ok:false,message:'Enter your city and province.'};if(customer.notes.length>400)return{ok:false,message:'Notes too long.'};
 if(!Array.isArray(x.items)||x.items.length<1||x.items.length>15)return{ok:false,message:'Cart should have 1–15 products.'};const items=x.items.map((entry:unknown):{id:unknown;quantity:unknown}=>{if(!entry||typeof entry!=='object'||Array.isArray(entry))return{id:null,quantity:null};const item=entry as Record<string,unknown>;return{id:item.id,quantity:item.quantity};});
 if(items.some(item=>typeof item.id!=='string'||!/^P[A-Z0-9]{2,40}$/.test(item.id)||typeof item.quantity!=='number'||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>10))return{ok:false,message:'Cart items are invalid.'};
 if(new Set(items.map(item=>item.id)).size!==items.length)return{ok:false,message:'Duplicate cart items.'};
 const idempotencyKey=str(x.idempotencyKey);if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey))return{ok:false,message:'Order token missing.'};
 return{ok:true,value:{customer,items:items.map(item=>({id:item.id as string,quantity:item.quantity as number})),idempotencyKey}};
}
export type ContactPayload={customer_name:string;email:string;phone:string;subject:string;body:string};
export type ContactResult={ok:true;honeypot:boolean;value:ContactPayload}|{ok:false;message:string};
export function validateContactPayload(input:unknown):ContactResult{
 if(!input||typeof input!=='object'||Array.isArray(input))return {ok:false,message:'Invalid message.'};
 const x=input as Record<string,unknown>;
 const field=(k:string)=>typeof x[k]==='string'?(x[k] as string).trim():'';
 const data={customer_name:field('name'),email:field('email'),phone:field('phone'),subject:field('subject'),body:field('body')};
 if(field('website'))return {ok:true,honeypot:true,value:data};
 if(data.customer_name.length<2||data.customer_name.length>120||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||data.email.length>254||data.phone.length>40||data.subject.length<2||data.subject.length>160||data.body.length<10||data.body.length>5000)return {ok:false,message:'Please check your message details.'};
 return {ok:true,honeypot:false,value:data};
}
