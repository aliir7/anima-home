"use client";

import React from "react";
import ReactPlayer from "react-player";

type VideoPlayerProps = {
  src: string | string[];
  className?: string;
};

export default function VideoPlayer({ src, className }: VideoPlayerProps) {
  const sources = Array.isArray(src) ? src : [src];

  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className || ""}`}>
      {sources.map((videoSrc, index) => (
        <div
          key={index}
          className="relative aspect-video w-full overflow-hidden rounded-xl border shadow"
        >
          <ReactPlayer
            src={videoSrc} // توجه: باید url باشه
            controls
            width="100%"
            height="100%"
          />
        </div>
      ))}
    </div>
  );
}
