import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { MarkColor } from "@/components/Logo";

export const metadata = {
  title: "Contact - Cassmo Homes",
  description:
    "Get in touch with Cassmo Homes in Abuja. Call, email, or send a message to buy land, build a home, or manage a property.",
};

const details = [
  {
    label: "Call / WhatsApp",
    value: "+234 902 573 7611",
    href: "tel:+2349025737611",
  },
  {
    label: "Email",
    value: "johnadah657@gmail.com",
    href: "mailto:johnadah657@gmail.com",
  },
  {
    label: "Office",
    value: "Kurudu, Municipal Area Council, FCT Abuja",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your next property."
        sub="Send us a message or call directly. We usually respond within one business day."
      />

      <section className="section">
        <div className="container-c grid gap-14 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-dark">Reach us directly</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-forest">
              Adah John
            </h2>
            <p className="text-sm uppercase tracking-widest text-muted">
              CEO, Cassmo Homes
            </p>

            <ul className="mt-8 space-y-5">
              {details.map((d) => (
                <li key={d.label} className="border-b border-ink/10 pb-5 transition-all hover:border-accent">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-accent-dark">
                    {d.label}
                  </span>
                  {d.href ? (
                    <a
                      href={d.href}
                      className="mt-1 block font-display text-lg text-forest hover:text-accent-dark transition-colors"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <span className="mt-1 block font-display text-lg text-forest">
                      {d.value}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-3 text-muted">
              <MarkColor size={32} className="h-8 w-auto" />
              <span className="text-sm">
                Sales &amp; Lease - Management - Construction
              </span>
            </div>

            {/* Map */}
            <div className="mt-10 overflow-hidden border border-ink/10">
              <iframe
                title="Cassmo Homes office location — Kurudu, Abuja"
                src="https://maps.google.com/maps?q=Kurudu,%20Abuja,%20Nigeria&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="220"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="card-lift border border-ink/10 bg-cream p-6 sm:p-9">
            <h3 className="font-display text-xl font-semibold text-forest">
              Send a message
            </h3>
            <p className="mt-1 text-sm text-muted">
              We usually respond within one business day.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
