import { redirect } from "next/navigation";

export default async function ReferralRedirectPage({ params }) {
  const { code } = await params;

  if (code && /^[a-z0-9_]{3,30}$/i.test(code)) {
    redirect(`/signup?ref=${encodeURIComponent(code)}`);
  }

  redirect("/");
}
