'use client';

import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';

const MOTION_STORAGE_KEY = 'alden-rovell-motion-v1';
const REVEAL_SELECTORS = [
  '.ar-category-section .ar-section-intro',
  '.ar-category-tile',
  '.ar-benefit-item',
  '.ar-depth-copy',
  '.ar-depth-visual',
  '.ar-faq-intro',
  '.ar-faq-item',
  '.ar-invite-panel',
  '.ar-about-pillars article',
  '.ar-contact-panel',
  '.ar-faq-page-header',
  '.section-heading',
  '.products-grid > .product-card',
  '.signature-banner',
  '.final-cta',
  '.collection-heading',
  '.shop-tools',
  '.shop-subcategories',
  '.results-line',
  '.detail-gallery',
  '.detail-panel'
].join(',');

export function StoreMotion(){
  const pathname=usePathname();
  const [enabled,setEnabled]=useState(true);
  const [mounted,setMounted]=useState(false);
  const [systemReduced,setSystemReduced]=useState(false);

  useEffect(()=>{
    try{setEnabled(window.localStorage.getItem(MOTION_STORAGE_KEY)!=='off');}catch{}
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setSystemReduced(media.matches);
    update();
    media.addEventListener('change',update);
    setMounted(true);
    return ()=>media.removeEventListener('change',update);
  },[]);

  useEffect(()=>{
    if(!mounted)return;
    document.documentElement.dataset.arMotion=enabled&&!systemReduced?'on':'off';
    try{window.localStorage.setItem(MOTION_STORAGE_KEY,enabled?'on':'off');}catch{}
    return ()=>{delete document.documentElement.dataset.arMotion;};
  },[enabled,systemReduced,mounted]);

  useEffect(()=>{
    if(!mounted||!enabled||systemReduced||!('IntersectionObserver' in window))return;
    const main=document.querySelector<HTMLElement>('.ar-public-main');
    if(!main)return;
    const nodes=Array.from(main.querySelectorAll<HTMLElement>(REVEAL_SELECTORS));
    const observer=new IntersectionObserver((entries)=>{
      for(const entry of entries){
        if(entry.isIntersecting){
          entry.target.classList.add('ar-in-view');
          observer.unobserve(entry.target);
        }
      }
    },{rootMargin:'0px 0px -35px 0px',threshold:0.06});

    for(const [index,node] of nodes.entries()){
      if(node.getBoundingClientRect().top<window.innerHeight*.88){
        node.classList.add('ar-in-view');
        continue;
      }
      node.style.setProperty('--ar-stagger',String((index%4)*55)+'ms');
      node.classList.add('ar-reveal-target');
      observer.observe(node);
    }
    return ()=>{
      observer.disconnect();
      for(const node of nodes){
        node.classList.remove('ar-in-view','ar-reveal-target');
        node.style.removeProperty('--ar-stagger');
      }
    };
  },[pathname,enabled,systemReduced,mounted]);

  return <div className="ar-motion-prefs">
    <button type="button" className="ar-motion-toggle" aria-pressed={enabled&&!systemReduced}
      onClick={()=>setEnabled(current=>!current)} disabled={!mounted||systemReduced}
      title={systemReduced?'Animations disabled by your device accessibility settings':'Toggle decorative animations'}>
      <span className="ar-motion-indicator" aria-hidden="true"/>
      Motion: {enabled&&!systemReduced?'On':'Off'}
    </button>
  </div>;
}
