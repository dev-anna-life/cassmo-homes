import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import FaqAccordion from "@/components/FaqAccordion";
import { services, capabilities } from "@/components/data";

export const metadata = {
  title: "Services - Cassmo Homes",
  description:
    "Cassmo Homes offers land sales, property management, and design & construction across Abuja and the FCT.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title="Land, construction, property management."
        sub="Three core services. One team that covers everything from site survey to handover of keys."
      />

      {/* Core services */}
      <section className="section">
        <div className="container-c space-y-6">
          {services.map((s, i) => (
            <Reveal
              key={s.slug}
              type={i === 0 ? "left" : i === 1 ? "scale" : "right"}
              duration={0.8}
            >
              <article className="card-lift grid gap-8 border border-ink/10 bg-white p-7 md:grid-cols-[auto_1fr_auto] md:items-center md:p-9">
                <div className="font-display text-5xl font-semibold text-accent">
                  0{i + 1}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-forest">
                    {s.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                    {s.summary}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-forest">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-brand-green" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/contact"
                  className="btn-pulse justify-self-start bg-forest px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep md:justify-self-end"
                >
                  Enquire
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-white section">
        <div className="container-c grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal type="left" duration={0.8}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">
              Full capability
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-forest sm:text-4xl">
              One team, six disciplines.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              We have people who handle every stage of the process. Surveyors,
              architects, builders, property managers, and interior designers
              working together so nothing falls through the cracks.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {capabilities.map((e) => (
                <li
                  key={e}
                  className="flex items-center gap-2 border border-ink/10 bg-cream px-4 py-3 text-sm font-medium text-forest transition-colors hover:border-accent hover:bg-white"
                >
                  <span className="h-2 w-2 bg-accent" />
                  {e}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80} type="right" duration={0.8}>
            <div className="bracket-frame">
              <div className="img-zoom img-float relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src="/images/skyline-woman.png"
                  alt="Cassmo Homes services team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-c max-w-3xl">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">
              FAQ
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-forest sm:text-4xl">
              Common questions.
            </h2>
          </Reveal>
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
