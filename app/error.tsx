"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-destructive/10 text-destructive flex h-screen flex-col items-center justify-center p-6 text-center">
      <AlertTriangle className="mb-4 h-16 w-16" />
      <h1 className="mb-2 text-2xl font-bold">اوه! خطایی رخ داد.</h1>
      <p className="mb-6">مشکلی پیش آمده است. لطفاً بعدا دوباره امتحان کنید.</p>
      <button
        className="bg-primary hover:bg-primary/80 rounded-xl px-6 py-2 text-white transition"
        onClick={() => reset()}
      >
        تلاش دوباره
      </button>
    </div>
  );
}
