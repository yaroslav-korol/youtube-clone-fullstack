'use client';

import { useSearchParams } from "next/navigation";


export default function WatchPage() {
    const videoPrefix = 'https://storage.googleapis.com/yk-youtube-processed-videos/';
    const videoSrc = useSearchParams().get('v');

    return (
        <div>
            <h1>Watch Page</h1>
            <video controls src={`${videoPrefix}${videoSrc}`}/>
        </div>
    );
}

export const revalidate = 30;
