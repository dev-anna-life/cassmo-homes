"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { faqs } from "@/components/data";

export default function FaqAccordion() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="mt-12 space-y-3">
      {faqs.map((faq, i) => (
        <Reveal key={i} delay={i * 50}>
          <div className="border border-ink/10 bg-white transition-all duration-300 hover:border-accent">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              aria-expanded={openFaq === i}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-display text-base font-semibold text-forest sm:text-lg">
                {faq.q}
              </span>
              <span
                className={`shrink-0 text-accent transition-transform duration-300 ${
                  openFaq === i ? "rotate-45" : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openFaq === i ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="border-t border-ink/10 px-6 py-5 text-sm leading-relaxed text-muted">
                {faq.a}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
