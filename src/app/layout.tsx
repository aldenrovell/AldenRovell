import type {Metadata} from 'next';
import '@/app/globals.css';
import '@/app/storefront-polish.css';
import '@/app/category-groups.css';
import '@/app/offer-ticker.css';
import {CartProvider} from '@/components/cart-provider';
import {SiteFrame} from '@/components/site-frame';
import {SiteHeader} from '@/components/site-header';
import {Footer} from '@/components/footer';
import {SITE_URL,SITE_NAME,SITE_DESCRIPTION} from '@/lib/seo';

const preview=process.env.VERCEL_ENV==='preview';
export const metadata:Metadata={
 metadataBase:new URL(SITE_URL),
 title:{default:'Alden Rovell | Jewellery, Footwear & Massagers in Pakistan',template:'%s | Alden Rovell'},
 description:SITE_DESCRIPTION,
 applicationName:SITE_NAME,
 robots:{index:!preview,follow:!preview,googleBot:{index:!preview,follow:!preview,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
 icons:{
  icon:[{url:'/favicon.ico',type:'image/x-icon'},{url:'/icon-64.png',sizes:'64x64',type:'image/png'},{url:'/icon-256.png',sizes:'256x256',type:'image/png'}],
  apple:[{url:'/apple-touch-icon.png',sizes:'180x180'}],
  shortcut:'/favicon.ico'
 },
 openGraph:{type:'website',locale:'en_PK',siteName:SITE_NAME,title:'Alden Rovell | Jewellery, Footwear & Massagers in Pakistan',description:SITE_DESCRIPTION,url:SITE_URL+'/',images:[{url:'/brand/landscape-cover.png',alt:'Alden Rovell collections'}]},
 twitter:{card:'summary_large_image',title:'Alden Rovell | Curated Finds in Pakistan',description:SITE_DESCRIPTION,images:['/brand/landscape-cover.png']}
};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body><CartProvider><SiteFrame header={<SiteHeader/>} footer={<Footer/>}>{children}</SiteFrame></CartProvider></body></html>;
}
