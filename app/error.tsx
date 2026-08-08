"use client";

import { catchError, type ErrorInfo } from "next/error";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

function ErrorFallback(props: { title?: string }, { error, retry }: ErrorInfo) {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";

  return (
    <main
      dir="rtl"
      className="bg-background flex min-h-screen items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-md text-center">
        <div className="bg-destructive/10 text-destructive mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
          <AlertTriangle className="size-8" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {props.title ?? "اوه! مشکلی پیش آمد"}
          </h1>

          <p className="text-muted-foreground text-sm leading-7 sm:text-base">
            در پردازش درخواست شما مشکلی پیش آمده است.
            <br />
            لطفاً دوباره تلاش کنید.
          </p>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="bg-muted/50 text-muted-foreground mt-6 rounded-lg border p-3 text-left text-xs">
            <p className="mb-1 font-medium">Error</p>
            <code className="break-all">{errorMessage}</code>
          </div>
        )}

        <div className="mt-8">
          <Button
            onClick={() => retry()}
            size="lg"
            className="gap-2 rounded-full px-6"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            تلاش دوباره
          </Button>
        </div>
      </div>
    </main>
  );
}

export default catchError(ErrorFallback);
