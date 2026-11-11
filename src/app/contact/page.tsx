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
  <div className={styles.cards}>
   <article className={styles.card+' '+styles.light}>
    <div className={styles.icons}><span className={styles.icon}><Headset size={25} strokeWidth={1.7}/></span><span className={styles.icon}><Handshake size={25} strokeWidth={1.7}/></span></div>
    <span className={styles.tag}>HERE TO HELP & COLLABORATE</span>
    <h2>Customer Support & Collaborations</h2>
    <p>For order enquiries, delivery updates, return requests, partnerships, business proposals and general assistance, reach our team using the email below.</p>
    <a className={styles.mail} href={'mailto:'+email}><Mail size={19}/><span>{email}</span></a>
    <a className={styles.action} href={'mailto:'+email+'?subject='+encodeURIComponent('Alden Rovell enquiry')}>Send an email <ArrowUpRight size={18}/></a>
   </article>
  </div>
 </section>;
}