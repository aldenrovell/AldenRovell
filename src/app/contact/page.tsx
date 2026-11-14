import {pageSeo} from '@/lib/seo';
import {ArrowUpRight,Mail,Headset,Handshake} from 'lucide-react';
import styles from './contact.module.css';

export const metadata=pageSeo({title:'Contact Alden Rovell | Customer Support & Collaborations',description:'Reach Alden Rovell for customer support, orders, returns, partnerships and collaborations at aldenrovell@gmail.com.',path:'/contact'});

const email='aldenrovell@gmail.com';

export default function Contact(){
 return <section className={styles.page}>
  <div className={styles.intro}>
   <span className={styles.kicker}>CONTACT / ALDEN ROVELL</span>
   <h1>Let's stay <span>connected.</span></h1>
   <p>One direct email for customer support, orders and collaborations. Simple, personal and always clear.</p>
  </div>
  <article className={styles.panel} aria-label="Contact Alden Rovell">
   <div className={styles.panelInfo}>
    <div className={styles.icons} aria-hidden="true">
     <span className={styles.icon}><Headset size={23} strokeWidth={1.7}/></span>
     <span className={styles.icon}><Handshake size={23} strokeWidth={1.7}/></span>
    </div>
    <span className={styles.tag}>HERE TO HELP &amp; COLLABORATE</span>
    <h2>Customer Support <span>&amp; Collaborations</span></h2>
    <p>For order enquiries, delivery updates, return requests, partnerships, business proposals and general assistance, reach our team using the email alongside.</p>
   </div>
   <div className={styles.contactBox}>
    <span className={styles.directLabel}>ONE DIRECT CONTACT</span>
    <span className={styles.mailSymbol} aria-hidden="true"><Mail size={26} strokeWidth={1.7}/></span>
    <h3>We're here to help.</h3>
    <p>Customer support, order questions and collaborations, all in one place.</p>
    <a className={styles.email} href={'mailto:'+email}><Mail size={18} aria-hidden="true"/><span>{email}</span></a>
    <a className={styles.action} href={'mailto:'+email+'?subject='+encodeURIComponent('Alden Rovell enquiry')}>Send an email <ArrowUpRight size={18} aria-hidden="true"/></a>
   </div>
  </article>
 </section>;
}
