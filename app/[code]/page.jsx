import { redirect } from "next/navigation";

// This page catches referral links like /20367 and redirects to /signup?ref=20367
// Named routes (/admin, /login, /signup, etc.) always take priority over this catch-all

export default async function ReferralRedirectPage({ params }) {
  const { code } = await params;

  // Only redirect if it looks like a referral code (numbers or alphanumeric, 4-10 chars)
  if (code && /^[A-Z0-9]{4,10}$/i.test(code)) {
    redirect(`/signup?ref=${encodeURIComponent(code)}`);
  }

  // Fallback: redirect to homepage if code is invalid
  redirect("/");
}
