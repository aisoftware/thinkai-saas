"use client";

import clsx from "clsx";

export function SparklesDemo({ from, to }: { from: string; to: string }) {
  return (
    <div className="hidden flex-col items-center justify-center overflow-hidden md:flex">
      <div className="relative h-5 w-full">
        {/* Gradients */}
        <div className={clsx("absolute inset-x-0 top-0 h-[2px] w-3/4 bg-linear-to-r from-transparent to-transparent blur-xs", from)} />
        <div className={clsx("absolute inset-x-1/4 top-0 h-px w-3/4 bg-linear-to-r from-transparent to-transparent", from)} />
        <div className={clsx("absolute inset-x-1/4 top-0 h-[5px] w-2/4 bg-linear-to-r from-transparent to-transparent blur-xs", to)} />
        <div className={clsx("absolute inset-x-1/4 top-0 h-px w-1/4 bg-linear-to-r from-transparent to-transparent", to)} />
      </div>
    </div>
  );
}
