"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  className?: string;
};

export function CopyButton({ value, className }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!hasCopied) {
      return;
    }

    const timeout = window.setTimeout(() => setHasCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [hasCopied]);

  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      data-slot="copy-button"
      className={cn(
        "size-7 text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      aria-label={hasCopied ? "복사됨" : "코드 복사"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setHasCopied(true);
        } catch {
          setHasCopied(false);
        }
      }}
    >
      <span className="sr-only">{hasCopied ? "복사됨" : "코드 복사"}</span>
      {hasCopied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}
