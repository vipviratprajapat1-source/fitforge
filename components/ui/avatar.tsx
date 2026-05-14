import Image from "next/image";

import { cn, getInitials } from "@/lib/utils";

export function Avatar({
  name,
  image,
  className,
}: {
  name: string;
  image?: string | null;
  className?: string;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={44}
        height={44}
        unoptimized
        className={cn("h-11 w-11 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(61,137,255,0.95),rgba(20,217,166,0.85),rgba(255,142,79,0.85))] text-sm font-bold text-white",
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
