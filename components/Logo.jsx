import Image from "next/image";

export function MarkColor({ className = "", size = 40 }) {
  return (
    <Image
      src="/images/logo-mark-color.png"
      alt="Cassmo Homes mark"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function MarkWhite({ className = "", size = 40 }) {
  return (
    <Image
      src="/images/logo-white-stacked.png"
      alt="Cassmo Homes mark"
      width={size}
      height={Math.round((size * 199) / 336)}
      className={className}
    />
  );
}

export default function Logo({ withText = true, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <MarkColor size={38} className="h-[38px] w-auto shrink-0" />
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.05rem] font-semibold tracking-[0.14em] text-forest">
            CASSMO HOMES
          </span>
          <span className="mt-1 text-[0.58rem] uppercase tracking-[0.24em] text-muted">
            Real Estate - Abuja, Nigeria
          </span>
        </span>
      )}
    </span>
  );
}
