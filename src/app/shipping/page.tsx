import Link from 'next/link';
import {Truck,MapPin,PackageCheck,ArrowUpRight,Mail} from 'lucide-react';
export const metadata={title:'Shipping & Delivery'};
export default function Shipping(){
 return <section className="container content-page ar-policy-page">
  <div className="ar-policy-head"><span className="eyebrow">THE ALDEN ROVELL EXPERIENCE / SHIPPING</span><h1>Good finds, <span className="ar-title-soft">delivered.</span></h1><p className="content-lede">A clear and simple delivery experience from the moment you place an order.</p></div>
  <div className="ar-policy-hero ar-policy-hero-shipping"><span className="ar-policy-label">DELIVERY / PAKISTAN</span><div className="ar-policy-hero-icon"><Truck size={57} strokeWidth={1.15}/></div><h2>Buy 2+, <span>delivery is FREE.</span></h2><p>One item: Rs. 199 delivery. Two or more items in the same order: FREE delivery across Pakistan, subject to availability and confirmation.</p><span className="ar-policy-pill">1 item: Rs. 199 · 2+ items: FREE</span></div>
  <div className="ar-policy-steps"><article><span className="ar-step-number">01</span><PackageCheck size={23}/><h3>Place your order</h3><p>Explore the collection, choose your product and complete the checkout request.</p></article><article><span className="ar-step-number">02</span><Mail size={23}/><h3>Order confirmation</h3><p>We confirm availability and the applicable dispatch details before sending your order.</p></article><article><span className="ar-step-number">03</span><MapPin size={23}/><h3>Delivery to your address</h3><p>Timing depends on your destination and dispatch confirmation. Your delivery estimate is shared with the order.</p></article></div>
  <div className="ar-policy-bottom"><div><span className="eyebrow">NEED SOME HELP?</span><h2>Questions about delivery?</h2><p>Our team can help with shipping and order enquiries.</p></div><Link href="/contact" className="btn btn-accent">Contact us <ArrowUpRight size={18}/></Link></div>
 </section>;
}