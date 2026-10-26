'use client';
import Link from 'next/link';
import {useId,useState} from 'react';
import {ArrowUpRight,Plus} from 'lucide-react';
export const storeFaqs=[
 {q:'Do you deliver across Pakistan?',a:'Yes. Alden Rovell offers free delivery across Pakistan. The delivery fee is Rs. 0. Orders are subject to product availability and confirmation before dispatch.'},
 {q:'How do I place an order?',a:'Choose a collection, open the product you like and follow the checkout steps. Our team reviews and confirms your order before dispatch.'},
 {q:'Can I request a return?',a:'Contact our team within 7 days of delivery if your order is incorrect, different from what you ordered, or incomplete. Every request is reviewed according to our return policy.'},
 {q:'When will my order arrive?',a:'Delivery timing depends on your destination, product availability and dispatch confirmation. Your available delivery estimate is shared with your order.'},
 {q:'How do I reach Alden Rovell?',a:'Email aldenrovell@gmail.com with your question or order reference. There is no website contact form.'},
];
export function FaqList({compact=false}:{compact?:boolean}){
 const id=useId(),[open,setOpen]=useState<number|null>(null);
 return <div className="ar-faq-list ar-faq-controlled">{(compact?storeFaqs.slice(0,4):storeFaqs).map((f,i)=><div key={f.q} className={'ar-faq-item ar-faq-accordion '+(open===i?'is-open':'')}>
  <h3><button type="button" id={id+'-tab-'+i} aria-controls={id+'-panel-'+i} aria-expanded={open===i} onClick={()=>setOpen(current=>current===i?null:i)} className="ar-faq-trigger">
    <span className="ar-faq-number">{String(i+1).padStart(2,'0')}</span><span className="ar-faq-question">{f.q}</span><span className="ar-faq-plus" aria-hidden="true"><Plus size={21}/></span>
  </button></h3>
  <div id={id+'-panel-'+i} role="region" aria-labelledby={id+'-tab-'+i} className="ar-faq-drawer" inert={open!==i}><div className="ar-faq-drawer-inner"><div className="ar-faq-answer"><p>{f.a}</p>{f.q==='Can I request a return?'&&<Link href="/returns">Read our return policy <ArrowUpRight size={14}/></Link>}</div></div></div>
 </div>)}</div>;
}