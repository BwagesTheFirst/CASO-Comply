import Image from "next/image";

export default function Logo({ className = "", size = "default" }: { className?: string; size?: "default" | "small" }) {
  const h = size === "small" ? "h-7" : "h-9";
  const textSize = size === "small" ? "text-[1.4rem]" : "text-[1.75rem]";

  return (
    <span className={`inline-flex items-baseline gap-0 ${className}`}>
      <Image
        src="/caso-logo.png"
        alt=""
        width={164}
        height={57}
        className={`${h} w-auto brightness-0 invert`}
        priority
      />
      <span
        className={`${textSize} -ml-1 font-extrabold leading-none text-caso-blue`}
        style={{
          fontFamily: "var(--font-raleway), sans-serif",
          letterSpacing: "-0.03em",
        }}
      >
        comply
      </span>
    </span>
  );
}
