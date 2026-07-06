import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Gallery - Cassmo Homes",
  description: "Browse our gallery of past projects, lands, and homes in Abuja.",
};

const galleryImages = [
  "/images/house-dusk.png",
  "/images/skyline-woman.png",
  "/images/couple.png",
  "/images/lifestyle.png",
  "/images/skyline-fields.png",
  "/images/hero-couple.png",
  "/images/office-interior.png",
  "/images/vision.png",
  "/images/woman-smile.png",
  "/images/mission.png",
  "/images/services.png",
  "/images/woman-profile.png",
];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="See our work."
        sub="A collection of our projects, verified lands, and happy clients."
      />

      <section className="section bg-white">
        <div className="container-c">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((src, i) => (
              <Reveal key={src} delay={(i % 3) * 100} type="up" duration={0.8}>
                <div className="relative aspect-[4/3] w-full overflow-hidden group cursor-pointer active:scale-[0.96] transition-transform duration-300 border border-ink/10">
                  <Image
                    src={src}
                    alt={`Gallery image ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
