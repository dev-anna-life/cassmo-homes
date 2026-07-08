import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Cassmo Homes - Real Estate in Abuja, Nigeria",
  description:
    "Cassmo Homes sells and leases genuine land with clean titles across Abuja and the FCT. We also build homes and manage properties.",
  keywords: [
    "Cassmo Homes",
    "real estate Abuja",
    "land for sale Nigeria",
    "property management",
    "construction Abuja",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SmoothScroll>
            <ScrollProgress />
            <Navbar />
            <main>{children}</main>
            <WhatsAppButton />
            <Footer />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
