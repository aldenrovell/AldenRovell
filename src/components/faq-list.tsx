import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';

export const storeFaqs=[
 {q:'Do you deliver across Pakistan?',a:'Yes. Alden Rovell offers free delivery across Pakistan. Orders are subject to product availability and confirmation before dispatch.'},
 {q:'How can I place an order?',a:'Choose a category, open the product you like and follow the checkout steps. Orders are reviewed and confirmed before dispatch.'},
 {q:'Can I request a return?',a:'A return request can be made within 7 days if your order is incorrect, different from what was ordered or incomplete. See our return policy for details.'},
 {q:'When will my order arrive?',a:'Delivery estimates depend on your location, product availability and dispatch confirmation. We will share the available delivery estimate when your order is confirmed.'},
 {q:'How do I contact your team?',a:'Use the contact page to find the store’s business email and other available contact details. There is no website contact form.'},
];
export function FaqList({compact=false}:{compact?:boolean}){
 const items=compact?storeFaqs.slice(0,4):storeFaqs;
 return <div className="ar-faq-list">{items.map((f,i)=><details key={f.q} className="ar-faq-item"><summary><span className="ar-faq-number">{String(i+1).padStart(2,'0')}</span><span className="ar-faq-question">{f.q}</span><span className="ar-faq-plus" aria-hidden="true">+</span></summary><div className="ar-faq-answer"><p>{f.a}</p>{f.q==='Can I request a return?'&&<Link href="/returns">Read return policy <ArrowUpRight size={14}/></Link>}</div></details>)}</div>;
}
