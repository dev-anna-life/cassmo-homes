import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Providers from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper";

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
            <LayoutWrapper>{children}</LayoutWrapper>
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
