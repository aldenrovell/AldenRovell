import 'server-only';
import {adminDb,publicAuth} from '@/lib/store';
export const MODULES=['products','prices','orders','messages','categories','content','media','contact','settings'] as const;
export type StaffSession={db:NonNullable<ReturnType<typeof adminDb>>;email:string;role:'owner'|'manager'|'editor';permissions:string[]};
export async function staff(req:Request):Promise<StaffSession|null>{
 const db=adminDb(),auth=publicAuth();if(!db||!auth)return null;
 const token=req.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];if(!token)return null;
 const {data,error}=await auth.auth.getUser(token);
 const email=data.user?.email?.toLowerCase();
 if(error||!email||!data.user?.email_confirmed_at)return null;
 if(email===process.env.ADMIN_EMAIL?.toLowerCase())return {db,email,role:'owner',permissions:[...MODULES]};
 const {data:member,error:lookup}=await db.from('site_team').select('role,active,permissions').eq('email',email).maybeSingle();
 if(lookup||!member?.active||!['manager','editor'].includes(member.role))return null;
 return {db,email,role:member.role as 'manager'|'editor',permissions:(member.permissions??[]) as string[]};
}
export function permitted(a:StaffSession,module:string){return a.role==='owner'||a.permissions.includes(module);}
