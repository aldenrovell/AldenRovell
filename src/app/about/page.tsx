import {pageSeo} from '@/lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight, PackageCheck, Truck, HeartHandshake, Sparkles} from 'lucide-react';
import styles from './about.module.css';

export const metadata=pageSeo({title:"Our Story | Discover Alden Rovell",description:"Discover the story behind Alden Rovell, an online store offering thoughtfully selected jewellery, footwear and everyday essentials across Pakistan.",path:"/about"});
const pillars=[
 {number:'01',title:'A more thoughtful edit',description:'Discover jewellery, footwear and everyday essentials through a simple, considered shopping experience.',icon:Sparkles},
 {number:'02',title:'Confidence in the details',description:'Explore clear product information and place an order without unnecessary steps.',icon:PackageCheck},
 {number:'03',title:'Connected across Pakistan',description:'Delivery for one item costs Rs. 199. Add two or more items in one order to unlock free delivery.',icon:Truck}
];
export default function About(){
 return <div className={styles.about}>
  <section className={styles.hero}>
   <div className={styles.copy}><span className={styles.eyebrow}>THE ALDEN ROVELL STORY</span>
    <h1>Style, quality &amp;<br/><span>Everyday luxury.</span></h1>
    <p>We believe the joy of shopping lives in the details. Alden Rovell brings together carefully selected collections and makes exploring them feel effortless.</p>
    <Link href="/shop" className={styles.primary}>Discover the collections <ArrowUpRight size={18}/></Link>
   </div>
   <div className={styles.brandPanel}>
    <Image src="/collection-covers/collections-hero.webp" fill unoptimized priority alt="Alden Rovell curated fashion and accessories collection" sizes="(max-width:780px) 100vw, 45vw" className={styles.storyImage}/>
    <span className={styles.panelCaption}>THE ALDEN ROVELL EDIT</span>
   </div>
  </section>
  <section className={styles.manifesto}>
   <div className={styles.manifestoInner}><span className={styles.eyebrow}>WHY WE'RE HERE</span>
    <h2>Less searching.<br/><em>More discovering.</em></h2>
    <p>It's not about offering everything. It's about making each collection easier to explore, so you can find something that feels right for you.</p>
   </div>
  </section>
  <section className={styles.values}>
   <div className={styles.valuesIntro}><span className={styles.eyebrow}>OUR APPROACH</span><h2>Designed around <span>the little things.</span></h2></div>
   <div className={styles.grid}>{pillars.map(({number,title,description,icon:Icon})=><article className={styles.card} key={number}>
    <div className={styles.cardTop}><span>{number}</span><Icon size={25} strokeWidth={1.65}/></div>
    <h3>{title}</h3><p>{description}</p>
   </article>)}</div>
  </section>
  <section className={styles.end}>
   <div><span className={styles.eyebrow}>ALDEN ROVELL COLLECTIONS</span><h2>Your next favourite <span>starts here.</span></h2></div>
   <Link href="/shop">Explore the edit <ArrowUpRight size={19}/></Link>
  </section>
 </div>;
}