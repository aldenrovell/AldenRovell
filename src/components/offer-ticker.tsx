'use client';
import {useEffect,useState} from 'react';
const offers=['BUY 2+ ITEMS & ENJOY FREE DELIVERY ACROSS PAKISTAN','ONE ITEM DELIVERY: RS. 199 ANYWHERE IN PAKISTAN','7-DAY RETURN REQUESTS FOR ELIGIBLE ORDER ISSUES'];
export function OfferTicker(){
 const [index,setIndex]=useState(0);
 useEffect(()=>{const timer=window.setInterval(()=>setIndex(i=>(i+1)%offers.length),5500);return ()=>window.clearInterval(timer);},[]);
 return <div className="announcement ar-rotating-offer" aria-label="Alden Rovell store offers"><span aria-live="off" key={index} className="ar-rotating-offer-text">{offers[index]}</span></div>;
}