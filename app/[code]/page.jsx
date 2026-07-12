import { redirect } from "next/navigation";

// This page catches referral links like /elpareto or /admin and redirects to /signup?ref=elpareto
// Named routes (/login, /signup, etc.) always take priority over this catch-all

export default async function ReferralRedirectPage({ params }) {
  const { code } = await params;

  // Allow usernames: letters, numbers, underscores (3-30 chars)
  if (code && /^[a-z0-9_]{3,30}$/i.test(code)) {
    redirect(`/signup?ref=${encodeURIComponent(code)}`);
  }

  // Fallback: redirect to homepage if code is invalid
  redirect("/");
}
