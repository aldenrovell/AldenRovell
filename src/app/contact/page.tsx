import {Mail,ArrowUpRight,ShieldCheck} from 'lucide-react';
export const metadata={title:'Contact Alden Rovell'};
export default function Contact(){
 const email='aldenrovell@gmail.com';
 return <section className="container content-page ar-contact-simple">
  <div className="ar-contact-top"><span className="eyebrow">CONTACT / ALDEN ROVELL</span><h1>Every connection <span className="ar-title-soft">matters.</span></h1><p className="content-lede">Questions about a product, your order or our collections? Reach us directly by email.</p></div>
  <div className="ar-contact-single ar-reveal-entrance">
   <div className="ar-contact-orbit" aria-hidden="true"><span/><span/></div>
   <div className="ar-contact-mail-symbol"><Mail size={34} strokeWidth={1.55}/></div>
   <span className="eyebrow">THE ALDEN ROVELL INBOX</span>
   <h2>Let's talk.</h2>
   <a className="ar-contact-single-link" href={'mailto:'+email}>{email}<ArrowUpRight size={23}/></a>
   <p>Send us your question with the product or order reference, if you have one.</p>
   <a href={'mailto:'+email+'?subject=Alden%20Rovell%20Enquiry'} className="btn btn-accent">Write an email <ArrowUpRight size={18}/></a>
  </div>
  <div className="ar-contact-note"><ShieldCheck size={19}/><span>One direct contact. No forms, no unnecessary steps.</span></div>
 </section>;
}