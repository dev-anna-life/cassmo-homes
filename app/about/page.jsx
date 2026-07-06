import Image from "next/image";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "About - Cassmo Homes",
  description:
    "Cassmo Homes is a real estate company in Abuja, Nigeria. We sell and lease genuine land with clean titles, manage properties, and build homes.",
};

const values = [
  {
    title: "Trust & Transparency",
    body: "We verify every title before we list a plot. No hidden details, no surprises. We want you to buy with confidence, not pressure.",
  },
  {
    title: "Strength & Class",
    body: "Our work is built on quality. From land documentation to finished buildings, we do things properly so they last.",
  },
  {
    title: "Client Understanding",
    body: "We listen to what you need and give you straight answers. Real estate is a big decision, and we help you make it with your eyes open.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Cassmo Homes"
        title="Real estate services across Abuja and the FCT."
        sub="We help people buy land, build homes, and manage properties. No fake titles, no empty promises."
      />

      {/* Mission */}
      <section className="section">
        <div className="container-c grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <div className="bracket-frame">
              <div className="img-zoom img-float relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src="/images/woman-profile.png"
                  alt="Our mission at Cassmo Homes"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">Our Mission</p>
            <p className="mt-5 font-display text-2xl leading-snug text-forest sm:text-[1.65rem]">
              Our mission is simple: help you find and secure genuine land,
              build a quality home, and manage your property with honesty.
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted">
              We are based in Kurudu, Abuja, and we serve clients across the
              FCT. Every plot we sell has a verified title. Every building we
              construct meets the standard we would want for ourselves. And
              every property we manage gets the attention it deserves.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-forest text-cream section">
        <div className="container-c grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal className="md:order-2">
            <div className="bracket-frame">
              <div className="img-zoom img-float relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src="/images/couple.png"
                  alt="Building a future together with Cassmo Homes"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={80} className="md:order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Our Vision</p>
            <p className="mt-5 font-display text-3xl leading-snug sm:text-4xl">
              To create spaces where people can actually live well.
            </p>
            <p className="mt-5 text-base leading-relaxed text-cream/75">
              Not every house is a home. Not every plot is a good investment.
              We are here to make sure you get the real thing - land you can
              build on, homes you can live in, and property that works for you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container-c">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">What we stand for</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-forest sm:text-4xl">
              The ground we build on.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 90} type="scale">
                <div className="card-lift h-full border-t-2 border-accent bg-white p-7">
                  <h3 className="font-display text-xl font-semibold text-forest">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
