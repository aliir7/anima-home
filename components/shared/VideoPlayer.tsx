"use client";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  className?: string;
};

export default function VideoPlayer({
  src,
  poster,
  className,
}: VideoPlayerProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg border ${className}`}
    >
      <video
        controls
        preload="metadata"
        className="h-auto w-full rounded-lg"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
      </video>
    </div>
  );
}
