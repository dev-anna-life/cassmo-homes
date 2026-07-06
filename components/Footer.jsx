import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="container-c grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image
            src="/images/logo-white.png"
            alt="Cassmo Homes - Real Estate in Abuja, Nigeria"
            width={280}
            height={66}
            className="h-auto w-[240px]"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70">
            A real estate company in Abuja. We sell verified land, build homes,
            and manage properties. No fake titles, no empty promises.
          </p>
          <div className="mt-6 flex gap-3">
            <span className="h-1 w-10 bg-accent" />
            <span className="h-1 w-10 bg-brand-green" />
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg text-cream">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-accent transition-colors">Services</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-cream">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-cream/70">
            <li>
              <span className="block text-cream/50">Call / WhatsApp</span>
              <a href="tel:+2349025737611" className="hover:text-accent transition-colors">
                +234 902 573 7611
              </a>
            </li>
            <li>
              <span className="block text-cream/50">Email</span>
              <a href="mailto:johnadah657@gmail.com" className="hover:text-accent transition-colors">
                johnadah657@gmail.com
              </a>
            </li>
            <li>
              <span className="block text-cream/50">Office</span>
              Kurudu, Municipal Area Council, FCT Abuja
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-c flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Cassmo Homes. All rights reserved.</p>
          <p>Sales &amp; Lease of Lands - Property Management - Design &amp; Construction</p>
        </div>
      </div>
    </footer>
  );
}
