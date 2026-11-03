import type {MetadataRoute} from 'next';
export default function manifest():MetadataRoute.Manifest{
 return {
  name:'Alden Rovell | Online Store Pakistan',
  short_name:'Alden Rovell',
  description:'Shop jewellery, footwear and massagers in Pakistan.',
  start_url:'/',
  display:'standalone',
  background_color:'#fcfaf7',
  theme_color:'#181617',
  icons:[
   {src:'/icon-64.png',sizes:'64x64',type:'image/png'},
   {src:'/icon-256.png',sizes:'256x256',type:'image/png'},
   {src:'/apple-touch-icon.png',sizes:'180x180',type:'image/png'}
  ]
 };
}
