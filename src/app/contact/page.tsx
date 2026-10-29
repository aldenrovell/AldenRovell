import {ArrowUpRight,Mail,Headset,Handshake} from 'lucide-react';
import styles from './contact.module.css';
export const metadata={title:'Contact Alden Rovell'};
const boxes=[
  {title:'General enquiries & collaborations',email:'contact@aldenrovell.com',description:'Brand enquiries, partnerships, collaborations, and proposals to sell your products through Alden Rovell.',tag:'LET’S CONNECT',icon:'collab'},
  {title:'Orders & customer support',email:'support@aldenrovell.com',description:'Existing orders, delivery updates, return requests, wrong items, and help with a purchase.',tag:'HERE TO HELP',icon:'support'}
] as const;
export default function Contact(){
 return <section className={styles.page}>
  <div className={styles.intro}><span className={styles.kicker}>CONTACT / ALDEN ROVELL</span><h1>Let's stay <span>connected.</span></h1><p>Two ways to reach the right team. Simple, personal and always clear.</p></div>
  <div className={styles.cards}>{boxes.map((box,i)=><article key={box.email} className={styles.card+' '+(i?styles.dark:styles.light)}>
    <div className={styles.icon}>{box.icon==='collab'?<Handshake size={28} strokeWidth={1.7}/>:<Headset size={28} strokeWidth={1.7}/>}</div>
    <span className={styles.tag}>{box.tag}</span><h2>{box.title}</h2><p>{box.description}</p>
    <a className={styles.mail} href={'mailto:'+box.email}><Mail size={18}/><span>{box.email}</span></a>
    <a className={styles.action} href={'mailto:'+box.email+'?subject='+encodeURIComponent('Alden Rovell enquiry')}>Send an email <ArrowUpRight size={18}/></a>
  </article>)}</div>
  <p className={styles.note}>These addresses are reserved for our business. Email delivery starts after both domain mailboxes are activated and verified.</p>
 </section>
}