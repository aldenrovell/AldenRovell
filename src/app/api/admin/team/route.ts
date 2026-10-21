import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { staff, MODULES } from '@/lib/permissions';
export const runtime='nodejs';
const error=(message:string,status=400)=>NextResponse.json({error:message},{status});
export async function GET(req:Request){
 const actor=await staff(req);if(!actor||actor.role!=='owner')return error('Owner access required',403);
 const {data,error:dbError}=await actor.db.from('site_team').select('email,role,active,permissions,created_at').order('created_at',{ascending:false});
 return dbError?error('Cannot load team',500):NextResponse.json({members:data??[]});
}
export async function POST(req:Request){
 const actor=await staff(req);if(!actor||actor.role!=='owner')return error('Owner access required',403);
 const body:unknown=await req.json().catch(()=>null);
 if(!body||typeof body!=='object'||Array.isArray(body))return error('Invalid form');
 const x=body as Record<string,unknown>,email=typeof x.email==='string'?x.email.trim().toLowerCase():'';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)return error('Enter a valid email');
 if(email===actor.email)return error('Owner credentials cannot be changed here');
 if(x.role!=='manager'&&x.role!=='editor')return error('Invalid role');
 if(!Array.isArray(x.permissions)||x.permissions.length>MODULES.length||x.permissions.some(v=>typeof v!=='string'||!MODULES.includes(v as typeof MODULES[number])))return error('Invalid permissions');
 if(typeof x.active!=='boolean')return error('Invalid account status');
 const {data:existing, error:lookup}=await actor.db.from('site_team').select('email').eq('email',email).maybeSingle();
 if(lookup)return error('Could not check existing account',500);
 let temporaryPassword:string|undefined,createdId:string|undefined;
 if(!existing){
  temporaryPassword=randomBytes(24).toString('base64url');
  const {data:created,error:createError}=await actor.db.auth.admin.createUser({email,password:temporaryPassword,email_confirm:true});
  if(createError)return error(createError.message,409);
  createdId=created.user?.id;
 }
 const {error:saveError}=await actor.db.from('site_team').upsert({email,role:x.role,active:x.active,permissions:[...new Set(x.permissions as string[])]});
 if(saveError){
  if(createdId)await actor.db.auth.admin.deleteUser(createdId);
  return error('Unable to save staff permissions',500);
 }
 await actor.db.from('site_audit').insert({actor_email:actor.email,action:existing?'update-staff':'create-staff',resource:email});
 return NextResponse.json({ok:true,email,created:!existing,...(temporaryPassword?{temporaryPassword}:{})});
}