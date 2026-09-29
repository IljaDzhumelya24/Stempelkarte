import Image from "next/image";

export default function BrandLogo({
  className = "",
  markClassName = "w-14 sm:w-16",
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}>
      <Image
        src="/brand/stampnow-logo.svg"
        alt=""
        width={1194}
        height={745}
        className={`h-auto shrink-0 rounded-md bg-white ${markClassName}`}
      />
      <span className="font-extrabold tracking-[-0.05em]">StampNow</span>
    </span>
  );
}
