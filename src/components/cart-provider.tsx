'use client';
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {cartItemKey,type CartItem} from '@/lib/types';
type Selection=Pick<CartItem,'color'|'size'>;
type CartContextType={items:CartItem[];count:number;add:(id:string,quantity?:number,selection?:Selection)=>void;change:(line:CartItem,quantity:number)=>void;clear:()=>void};
const Context=createContext<CartContextType|null>(null);
const KEY='alden-rovell-cart-v1';
export function CartProvider({children}:{children:ReactNode}){
 const [items,setItems]=useState<CartItem[]>([]),[ready,setReady]=useState(false);
 useEffect(()=>{try{
  const stored=JSON.parse(localStorage.getItem(KEY)||'[]');
  if(Array.isArray(stored)){
   const valid=stored.filter(x=>x&&typeof x.id==='string'&&/^P[A-Z0-9]{2,40}$/.test(x.id)&&Number.isInteger(x.quantity)&&x.quantity>0&&x.quantity<=10&&(x.color===undefined||typeof x.color==='string')&&(x.size===undefined||typeof x.size==='string')).slice(0,15) as CartItem[];
   const merged:CartItem[]=[];
   for(const item of valid){const key=cartItemKey(item),existing=merged.find(i=>cartItemKey(i)===key);if(existing)existing.quantity=Math.min(10,existing.quantity+item.quantity);else merged.push(item);}
   setItems(merged);
  }
 }catch{}setReady(true);},[]);
 useEffect(()=>{if(ready)localStorage.setItem(KEY,JSON.stringify(items));},[items,ready]);
 const change=(line:CartItem,quantity:number)=>setItems(old=>quantity<=0?old.filter(x=>cartItemKey(x)!==cartItemKey(line)):old.map(x=>cartItemKey(x)===cartItemKey(line)?{...x,quantity:Math.min(Math.max(1,quantity),10)}:x));
 const add=(id:string,quantity=1,selection?:Selection)=>setItems(old=>{
  const next:CartItem={id,quantity:Math.min(Math.max(1,quantity),10),...(selection?.color?{color:selection.color}:{}),...(selection?.size?{size:selection.size}:{})};
  const key=cartItemKey(next),match=old.find(x=>cartItemKey(x)===key);
  return match?old.map(x=>cartItemKey(x)===key?{...x,quantity:Math.min(10,x.quantity+next.quantity)}:x):[...old,next];
 });
 return <Context.Provider value={{items,count:items.reduce((n,p)=>n+p.quantity,0),add,change,clear:()=>setItems([])}}>{children}</Context.Provider>;
}
export function useCart(){const ctx=useContext(Context);if(!ctx)throw new Error('CartProvider missing');return ctx;}
