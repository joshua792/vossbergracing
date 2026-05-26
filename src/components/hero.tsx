import Image from "next/image";
import { getSiteImageUrl } from "@/lib/site-images";
import { rider } from "@/config/rider";

export async function Hero() {
  const backgroundUrl = await getSiteImageUrl("hero-background");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src={backgroundUrl}
        alt={rider.images.heroAlt}
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-dark/50 to-brand-dark" />

      {/* Giant #11 background element */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-heading text-[20rem] md:text-[30rem] font-black text-white/[0.03] leading-none select-none">
          {rider.number}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 pt-16">
        {/* Accent line */}
        <div className="w-16 h-1 bg-gradient-to-r from-brand-blue to-brand-orange mx-auto mb-8" />

        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight">
          <span className="text-white">{rider.firstName}</span>
          <br />
          <span className="text-brand-orange">{rider.lastName}</span>
        </h1>

        <div className="mt-6 flex items-center justify-center gap-4">
          <span className="font-heading text-4xl md:text-5xl font-black text-brand-orange">
            {rider.numberDisplay}
          </span>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-left">
            <p className="font-heading text-sm md:text-base uppercase tracking-widest text-gray-300">
              {rider.series}
            </p>
            <p className="font-heading text-lg md:text-xl uppercase tracking-wider text-white">
              {rider.class}
            </p>
          </div>
        </div>

        {/* Diagonal accent */}
        <div className="mt-12 flex justify-center">
          <svg
            viewBox="0 0 100 20"
            className="w-32 text-brand-orange/30"
            fill="currentColor"
          >
            <polygon points="0,20 20,0 40,20 60,0 80,20 100,0 100,20" />
          </svg>
        </div>
      </div>

      {/* Bottom diagonal divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-20"
        >
          <polygon
            fill="#0a1628"
            points="0,80 1440,80 1440,0 0,80"
          />
        </svg>
      </div>
    </section>
  );
}
