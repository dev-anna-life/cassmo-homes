import { MarkWhite } from "./Logo";

export default function PageHeader({ eyebrow, title, sub }) {
  return (
    <section className="relative overflow-hidden bg-forest text-cream">
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 opacity-[0.07]">
        <MarkWhite size={288} className="h-full w-full object-contain" />
      </div>
      <div className="container-c py-16 md:py-20">
        {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{eyebrow}</span>}
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          {title}
        </h1>
        {sub && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream/75">
            {sub}
          </p>
        )}
      </div>
    </section>
  );
}
