'use client';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";


function WatchContent() {
  const videoPrefix = 'https://storage.googleapis.com/yk-youtube-processed-videos/';
  const videoSrc = useSearchParams().get('v');

  return (
    <div>
      <h1>Watch Page</h1>
      <video controls src={`${videoPrefix}${videoSrc}`} />
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WatchContent />
    </Suspense>
  );
}
