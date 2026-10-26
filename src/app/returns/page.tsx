import Link from 'next/link';
import {CalendarCheck2,PackageSearch,ShieldCheck,ArrowUpRight,Mail} from 'lucide-react';
export const metadata={title:'Returns & Exchanges'};
export default function Returns(){
 return <section className="container content-page ar-policy-page">
  <div className="ar-policy-head"><span className="eyebrow">THE ALDEN ROVELL EXPERIENCE / RETURNS</span><h1>Clear returns. <span className="ar-title-soft">Peace of mind.</span></h1><p className="content-lede">If something arrives wrong or incomplete, we want you to have a clear way to raise it.</p></div>
  <div className="ar-policy-hero ar-policy-hero-returns"><span className="ar-policy-label">RETURNS / CUSTOMER SUPPORT</span><div className="ar-policy-hero-icon"><CalendarCheck2 size={56} strokeWidth={1.2}/></div><h2>7 days to <span>request a return.</span></h2><p>Contact our team within 7 days of delivery if the order you received is incorrect, different from what you ordered, or incomplete.</p><span className="ar-policy-pill">Claim request window: 7 days</span></div>
  <div className="ar-policy-steps"><article><span className="ar-step-number">01</span><PackageSearch size={23}/><h3>Check your delivery</h3><p>Review the items you received against your order.</p></article><article><span className="ar-step-number">02</span><Mail size={23}/><h3>Contact us within 7 days</h3><p>Use our email and include your order reference and a description of the issue.</p></article><article><span className="ar-step-number">03</span><ShieldCheck size={23}/><h3>We review the request</h3><p>Our team reviews the details and explains the next applicable steps. Requests are subject to policy review.</p></article></div>
  <div className="ar-policy-bottom"><div><span className="eyebrow">REQUEST A RETURN</span><h2>Let's make it right.</h2><p>Send your order reference and details to our team.</p></div><Link href="/contact" className="btn btn-accent">Contact support <ArrowUpRight size={18}/></Link></div>
 </section>;
}