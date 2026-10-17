import Image from 'next/image';
export default function Loading(){return <div className="page-loader" role="status" aria-label="Loading Alden Rovell"><div className="loader-logo-frame"><Image src="/brand/loader-black.png" alt="" width={1050} height={220} className="loader-logo" priority/></div><div className="loader-line"/><span>Preparing your collection</span></div>}
