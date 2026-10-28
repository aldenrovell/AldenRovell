'use client';
import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight,ArrowLeft,CheckCircle2,ShieldCheck,Truck,LockKeyhole,Check} from 'lucide-react';
import {useCart} from './cart-provider';
import type {Product,StoreSettings} from '@/lib/types';
import {canPurchase,formatPrice,getDeliveryFee} from '@/lib/types';
import {validatePkPhone} from '@/lib/validate';
const provinces=['Sindh','Punjab','Khyber Pakhtunkhwa','Balochistan','Islamabad Capital Territory','Gilgit-Baltistan','Azad Jammu & Kashmir'];
type Receipt={reference:string;subtotalPkr:number;totalPkr:number|null;shippingPkr:number|null};
export function CheckoutView({products,settings}:{products:Product[];settings:StoreSettings}){
 const {items,clear}=useCart();
 const [form,setForm]=useState({name:'',phone:'',city:'',province:'Sindh',address:'',notes:''});
 const [agree,setAgree]=useState(false),[sending,setSending]=useState(false),[error,setError]=useState(''),[receipt,setReceipt]=useState<Receipt|null>(null),[idempotency,setIdempotency]=useState('');
 const lines=items.map(x=>({...x,product:products.find(p=>p.id===x.id)}));
 const eligible=items.length>0&&lines.every(x=>x.product&&canPurchase(x.product)&&x.quantity<=(x.product.stock??0));
 const subtotal=lines.reduce((a,x)=>a+(x.product?.pricePkr??0)*x.quantity,0);
 const quantity=items.reduce((sum,x)=>sum+x.quantity,0),shipping=getDeliveryFee(quantity);
 const feeKnown=settings.codEnabled;
 async function submit(e:React.FormEvent){
  e.preventDefault();setError('');
  if(!eligible){setError('An item is unavailable. Please check your bag.');return;}
  if(!validatePkPhone(form.phone)){setError('Enter a valid Pakistan mobile number, for example 03XXXXXXXXX.');return;}
  if(!agree){setError('Please accept the order request and privacy terms.');return;}
  setSending(true);
  let key=idempotency;if(!key){key=crypto.randomUUID();setIdempotency(key);}
  try{
   const response=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customer:form,items:items.map(({id,quantity})=>({id,quantity})),idempotencyKey:key})});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||'Your request could not be saved.');
   setReceipt({reference:data.reference,subtotalPkr:data.subtotalPkr,shippingPkr:data.shippingPkr,totalPkr:data.totalPkr});clear();
  }catch(err){setError(err instanceof Error?err.message:'Unable to place order.');}finally{setSending(false);}
 }
 if(receipt)return <div className="container ar-easy-success"><div className="ar-success-icon"><Check size={36}/></div><span className="eyebrow">ALDEN ROVELL / ORDER RECEIVED</span><h1>You're all set.</h1><p>Your order request <strong>{receipt.reference}</strong> has been saved. We will confirm stock and dispatch details before the order is accepted.</p><div className="ar-success-breakdown"><div><span>Items</span><b>{formatPrice(receipt.subtotalPkr)}</b></div><div><span>Delivery</span><b>{receipt.shippingPkr===null?'Confirm with store':receipt.shippingPkr===0?'FREE':formatPrice(receipt.shippingPkr)}</b></div><div><span>Payable on confirmation</span><b>{receipt.totalPkr===null?'To be confirmed':formatPrice(receipt.totalPkr)}</b></div></div><p className="ar-tiny-note">Please save your order reference. This is not a shipment confirmation.</p><Link href="/shop" className="btn btn-accent">Continue exploring <ArrowRight size={18}/></Link></div>;
 if(!items.length)return <div className="container ar-easy-success"><h1>Your bag is empty.</h1><p>Choose something you love, then come back to checkout.</p><Link href="/shop" className="btn btn-accent">Browse collections <ArrowRight size={18}/></Link></div>;
 return <div className="container ar-easy-checkout">
  <div className="ar-checkout-back"><Link href="/cart"><ArrowLeft size={15}/> Back to bag</Link><span>SECURE ORDER REQUEST</span></div>
  <div className="ar-checkout-heading"><span className="eyebrow">ALDEN ROVELL / SIMPLE CHECKOUT</span><h1>Almost <span>yours.</span></h1><p>Just your delivery details. No online payment or account required.</p></div>
  <div className="ar-checkout-grid">
   <form className="ar-easy-form" onSubmit={submit}>
    <div className="ar-step-header"><span className="ar-step-chip">01</span><div><h2>Where should we deliver?</h2><p>Only the details needed to arrange your order.</p></div></div>
    <div className="ar-quick-fields">
     <label>Full name <input autoComplete="name" required minLength={2} maxLength={100} placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
     <label>Mobile number <input autoComplete="tel-national" inputMode="tel" type="tel" required maxLength={16} placeholder="03XXXXXXXXX" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>
     <label>City <input autoComplete="address-level2" required minLength={2} maxLength={80} placeholder="Your city" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></label>
     <label>Province / Region <select autoComplete="address-level1" value={form.province} onChange={e=>setForm({...form,province:e.target.value})}>{provinces.map(p=><option key={p}>{p}</option>)}</select></label>
     <label className="ar-full">Complete delivery address <textarea autoComplete="street-address" required minLength={10} maxLength={350} rows={2} placeholder="House, street, area and nearest landmark" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label>
    </div>
    <details className="ar-optional-notes"><summary>+ Add delivery instructions <span>(optional)</span></summary><textarea rows={2} maxLength={400} value={form.notes} placeholder="Landmark, preferred contact time, etc." onChange={e=>setForm({...form,notes:e.target.value})}/></details>
    <div className="ar-checkout-bottom"><label className="ar-easy-agree"><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)}/><span>I understand this is an order request pending store confirmation. I agree to the <Link href="/terms" target="_blank">Terms</Link> and <Link href="/privacy" target="_blank">Privacy Policy</Link>.</span></label>
    {error&&<p role="alert" className="form-error">{error}</p>}
    {eligible?<button className="btn btn-accent ar-order-submit" type="submit" disabled={sending}>{sending?'Saving your order…':'Place order request'}<ArrowRight size={19}/></button>:<div className="checkout-locked">An item is unavailable or exceeds stock. <Link href="/cart">Review your bag</Link>.</div>}
    <p className="ar-checkout-privacy"><ShieldCheck size={17}/> Private order details. No payment charged online.</p></div>
   </form>
   <aside className="ar-easy-review" aria-label="Your order summary"><div className="ar-review-top"><span className="eyebrow">02 / ORDER SUMMARY</span><h2>Your selection</h2><p>{quantity} {quantity===1?'item':'items'} in your bag</p></div>
    <div className="ar-review-products">{lines.map(({id,quantity:qty,product})=><div className="ar-review-item" key={id}><div className="ar-review-thumb">{product?.images[0]?.src&&<Image src={product.images[0].src} alt="" fill sizes="65px" unoptimized/>}</div><div><strong>{product?.title||id}</strong><span>Qty: {qty}</span></div><b>{formatPrice((product?.pricePkr??0)*qty)}</b></div>)}</div>
    <div className="ar-review-totals"><div><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div><span>Delivery</span><b className={shipping===0?'ar-free':''}>{feeKnown?(shipping===0?'FREE':formatPrice(shipping)):'To be confirmed'}</b></div><div className="ar-review-final"><span>Estimated total</span><strong>{feeKnown?formatPrice(subtotal+shipping):'To be confirmed'}</strong></div></div>
    <div className="ar-review-offer"><Truck size={21}/><div><strong>{quantity>=2?'Free delivery unlocked':'One more item = FREE delivery'}</strong><span>{quantity>=2?'2+ items ship free across Pakistan.':'Single-item delivery Rs. 199.'}</span></div></div>
    <Link href="/cart" className="ar-edit-bag">Edit shopping bag <ArrowRight size={15}/></Link>
   </aside>
  </div>
 </div>;
}