import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import HoverCard from "@/components/HoverCard";
import CountUp from "@/components/CountUp";
import ParallaxImage from "@/components/ParallaxImage";
import { MarkWhite } from "@/components/Logo";
import { services, offerings, whyPoints, stats } from "@/components/data";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="orb orb-a h-72 w-72 bg-accent/20 top-10 -left-16" />
        <div className="orb orb-b h-96 w-96 bg-brand-green/15 bottom-0 left-1/3" />
        <div className="orb orb-c h-64 w-64 bg-accent/10 top-1/2 right-10" />

        <div className="pointer-events-none absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 opacity-[0.06] animate-float">
          <MarkWhite size={520} className="h-full w-full object-contain" />
        </div>

        <div className="container-c grid items-center gap-10 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24 relative z-10">
          <Reveal type="left" duration={0.8}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Real Estate - Abuja, Nigeria
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              Genuine land and
              <span className="block italic text-gradient-animate">
                a home you can trust.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/75">
              We sell and lease verified land with clean titles across Abuja.
              No fake plots, no documentary trouble. Just straight talk and
              solid ground.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-accent px-7 py-3.5 text-sm font-semibold text-forest-deep transition-all duration-300 hover:scale-[1.03] hover:bg-accent-dark active:scale-[0.97]"
              >
                Find Your Place
              </Link>
              <Link
                href="/services"
                className="border border-cream/30 px-7 py-3.5 text-sm font-semibold text-cream transition-all duration-300 hover:scale-[1.03] hover:bg-white/5 active:scale-[0.97]"
              >
                Our Services
              </Link>
            </div>
          </Reveal>

          <Reveal type="right" delay={150} duration={0.9} className="relative">
            <div className="bracket-frame">
              <ParallaxImage speed={0.12} className="relative aspect-[4/5] w-full sm:aspect-[3/4]">
                <Image
                  src="/images/hero-couple.png"
                  alt="A couple at home in front of a modern Abuja skyline"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </ParallaxImage>
            </div>
          </Reveal>
        </div>

        <div className="border-t border-cream/10 relative z-10">
          <div className="container-c grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, idx) => (
              <div
                key={s.label}
                className={`px-4 py-6 text-center md:py-7 transition-colors hover:bg-cream/5 border-cream/10
                  ${idx % 2 === 0 ? "border-r" : ""}
                  ${idx >= 2 ? "border-t" : ""}
                  md:border-t-0 md:border-r md:last:border-r-0
                `}
              >
                <div className="font-display text-3xl font-semibold text-brand-green">
                  <CountUp value={s.value} />
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-cream/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-c grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <Reveal type="left" duration={0.8}>
            <div className="bracket-frame">
              <ParallaxImage speed={0.1} className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/images/office.png"
                  alt="Cassmo Homes office"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </ParallaxImage>
            </div>
          </Reveal>
          <Reveal delay={150} type="right" duration={0.8}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">
              Who we are
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-forest sm:text-4xl">
              We sell land. We build homes. We manage properties.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Cassmo Homes is a real estate company based in Kurudu, Abuja. We
              help people find genuine land, build their homes, and manage their
              properties so they get peace of mind and real value.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Our team handles everything from title verification and survey
              work to construction and property management. No shortcuts, no
              hidden fees, no fake titles.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-forest hover:text-accent-dark transition-colors"
            >
              More about Cassmo <span aria-hidden>&#8594;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-white section">
        <div className="container-c">
          <Reveal className="max-w-2xl" type="up" duration={0.8}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">
              What we offer
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-forest sm:text-4xl">
              Three routes to ownership.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {offerings.map((o, i) => (
              <Reveal
                key={o.title}
                delay={i * 100}
                type={i === 0 ? "left" : i === 1 ? "up" : "right"}
                duration={0.8}
              >
                <HoverCard>
                  <article className="group flex h-full flex-col overflow-hidden border border-ink/10 bg-cream">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={o.img}
                        alt={o.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.1]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <span className="absolute left-4 top-4 bg-forest px-3 py-1 font-display text-sm font-semibold text-cream transition-colors group-hover:bg-accent">
                        {o.title}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="flex-1 text-sm leading-relaxed text-muted">
                        {o.body}
                      </p>
                      <Link
                        href="/contact"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest transition-colors group-hover:text-accent-dark"
                      >
                        {o.cta} <span aria-hidden>&#8594;</span>
                      </Link>
                    </div>
                  </article>
                </HoverCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-c">
          <Reveal className="max-w-2xl" type="up" duration={0.8}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">
              What we do
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-forest sm:text-4xl">
              End to end, under one roof.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal
                key={s.slug}
                delay={i * 100}
                type={i === 0 ? "left" : i === 1 ? "up" : "right"}
                duration={0.8}
              >
                <HoverCard>
                  <article className="group flex h-full flex-col border border-ink/10 bg-white p-7 transition-colors hover:border-accent">
                    <span className="font-display text-sm font-semibold text-accent-dark transition-colors group-hover:text-brand-green">
                      0{i + 1}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-semibold text-forest transition-colors group-hover:text-accent-dark">
                      {s.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {s.summary}
                    </p>
                    <ul className="mt-5 space-y-2 border-t border-ink/10 pt-5 text-sm text-forest">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 shrink-0 bg-brand-green" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </article>
                </HoverCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest text-cream section relative overflow-hidden">
        <div className="orb orb-b h-80 w-80 bg-brand-green/10 top-0 right-0" />
        <div className="orb orb-a h-60 w-60 bg-accent/10 bottom-0 left-10" />

        <div className="container-c grid gap-12 md:grid-cols-2 md:items-center relative z-10">
          <Reveal type="left" duration={0.8}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Why invest with us
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              A ride to financial freedom.
            </h2>
            <div className="mt-8 space-y-7">
              {whyPoints.map((w, i) => (
                <Reveal key={w.head} delay={i * 100} type="up" duration={0.7}>
                  <div className="border-l-2 border-accent pl-5 transition-all hover:border-l-4 hover:pl-4">
                    <h3 className="font-display text-xl font-semibold text-brand-green">
                      {w.head}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-cream/75">
                      {w.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150} type="right" duration={0.8} className="md:order-last">
            <div className="bracket-frame">
              <ParallaxImage speed={0.15} className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src="/images/lifestyle.png"
                  alt="Living well with Cassmo Homes"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </ParallaxImage>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-c max-w-4xl text-center">
          <Reveal type="up" duration={0.9}>
            <blockquote className="font-display text-2xl font-medium italic leading-snug text-forest sm:text-3xl lg:text-4xl">
              &ldquo;Owning a home is a keystone of wealth - both financial
              affluence and emotional security.&rdquo;
            </blockquote>
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-muted">
              - Suze Orman
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-c">
            <div className="relative grid overflow-hidden bg-brand-green md:grid-cols-2">
              <Reveal type="left" duration={0.8} className="relative min-h-[240px] md:min-h-full overflow-hidden group cursor-pointer active:scale-[0.96] transition-transform duration-300">
                <Image
                  src="/images/woman-smile.png"
                  alt="A Cassmo Homes client, at ease"
                  fill
                  className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Reveal>
              <Reveal type="right" duration={0.8} className="px-8 py-12 text-forest-deep sm:px-12">
                <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  Ready to buy land or build a home?
                </h2>
                <p className="mt-4 max-w-md text-base text-forest-deep/80">
                  Talk to us. We will help you find genuine land, manage your
                  property, or build the home you have in mind.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="bg-forest px-7 py-3.5 text-sm font-semibold text-cream transition-all duration-300 hover:scale-[1.03] hover:bg-forest-deep active:scale-[0.97]"
                  >
                    Book a Consultation
                  </Link>
                  <a
                    href="tel:+2349025737611"
                    className="border border-forest/30 px-7 py-3.5 text-sm font-semibold text-forest-deep transition-all duration-300 hover:scale-[1.03] hover:bg-forest/5 active:scale-[0.97]"
                  >
                    +234 902 573 7611
                  </a>
                </div>
              </Reveal>
            </div>
        </div>
      </section>
    </>
  );
}
