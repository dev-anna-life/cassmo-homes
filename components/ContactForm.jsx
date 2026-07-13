"use client";

import { useState } from "react";

const interests = [
  "Buy / Lease Land",
  "Property Management",
  "Design & Construction",
  "General Enquiry",
];

const PHONE = "2349025737611";

export default function ContactForm() {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: interests[0],
    message: "",
  });

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
    }

    const body = [
      `*Name:* ${form.name}`,
      `*Email:* ${form.email}`,
      `*Phone:* ${form.phone || ""}`,
      `*Interest:* ${form.interest}`,
      `*Message:* ${form.message}`,
    ].join("%0A");
    window.open(`https://wa.me/${PHONE}?text=${body}`, "_blank");

    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="animate-bounce-in border border-brand-green/40 bg-brand-green/10 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-brand-green text-cream">
          &check;
        </div>
        <h3 className="font-display text-xl font-semibold text-forest">
          Thank you, {form.name.split(" ")[0] || "friend"}.
        </h3>
        <p className="mt-2 text-sm text-muted">
          Message sent to WhatsApp and email. We will get back to you shortly.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setForm({ name: "", email: "", phone: "", interest: interests[0], message: "" });
          }}
          className="mt-6 text-sm font-semibold text-forest underline hover:text-accent-dark transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required>
          <input
            type="text"
            value={form.name}
            onChange={update("name")}
            placeholder="Adah John"
            className="input"
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder="+234 902 573 7611"
            className="input"
          />
        </Field>
      </div>

      <Field label="Email" required>
        <input
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder="you@email.com"
          className="input"
        />
      </Field>

      <Field label="I'm interested in">
        <select value={form.interest} onChange={update("interest")} className="input">
          {interests.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </Field>

      <Field label="Message" required>
        <textarea
          value={form.message}
          onChange={update("message")}
          rows={5}
          placeholder="Tell us what you are looking for..."
          className="input resize-none"
        />
      </Field>

      <button
        onClick={handleSubmit}
        disabled={status === "loading"}
        className="btn-pulse w-full bg-forest px-6 py-4 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong. Please try again or call us directly.
        </p>
      )}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
        {label}
        {required && <span className="text-accent-dark"> *</span>}
      </span>
      {children}
    </label>
  );
}
