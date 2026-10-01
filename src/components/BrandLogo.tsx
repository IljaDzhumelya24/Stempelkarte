import Image from "next/image";

export default function BrandLogo({
  className = "",
  markClassName = "w-14 sm:w-16",
  variant = "default",
}: {
  className?: string;
  markClassName?: string;
  variant?: "default" | "footer";
}) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}>
      <Image
        src={variant === "footer" ? "/brand/stampnow-logo-footer.png" : "/brand/stampnow-logo.svg"}
        alt=""
        width={variant === "footer" ? 512 : 1194}
        height={variant === "footer" ? 312 : 745}
        sizes="(min-width: 640px) 64px, 56px"
        className={`h-auto shrink-0 ${variant === "footer" ? "" : "rounded-md bg-white"} ${markClassName}`}
      />
      <span className="font-extrabold tracking-[-0.05em]">StampNow</span>
    </span>
  );
}
