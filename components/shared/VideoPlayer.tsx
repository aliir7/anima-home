"use client";

type VideoPlayerProps = {
  src: string | string[];
  poster?: string;
  className?: string;
};

export default function VideoPlayer({
  src,
  poster,
  className,
}: VideoPlayerProps) {
  const sources = Array.isArray(src) ? src : [src];

  return (
    <div className="space-y-6">
      {sources.map((videoSrc, index) => (
        <div
          key={index}
          className={`relative w-full overflow-hidden rounded-lg border ${className}`}
        >
          <video
            controls
            preload="metadata"
            className="h-auto w-full rounded-lg"
            poster={poster}
          >
            <source src={videoSrc} type="video/mp4" />
            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
          </video>
        </div>
      ))}
    </div>
  );
}
