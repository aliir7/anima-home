"use client";
export default function VideoPlayer({ src }: { src: string }) {
  return (
    <video controls className="w-full rounded-lg border">
      {" "}
      <source src={src} type="video/mp4" /> مرورگر شما از پخش ویدیو پشتیبانی
      نمی‌کند.{" "}
    </video>
  );
}
