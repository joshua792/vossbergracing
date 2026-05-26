import Image from "next/image";
import { getSiteImageUrl } from "@/lib/site-images";
import { rider } from "@/config/rider";

export async function About() {
  const portraitUrl = await getSiteImageUrl("about-portrait");

  return (
    <section className="relative py-24 bg-brand-dark" id="about">
      {/* Subtle angular accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-blue/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src={portraitUrl}
                alt={rider.images.portraitAlt}
                fill
                className="object-cover"
              />
            </div>
            {/* Orange accent corner */}
            <div className="absolute -bottom-3 -right-3 w-24 h-24 border-r-4 border-b-4 border-brand-orange rounded-br-lg" />
            <div className="absolute -top-3 -left-3 w-16 h-16 border-l-4 border-t-4 border-brand-blue rounded-tl-lg" />
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-brand-orange" />
              <span className="font-heading text-sm uppercase tracking-widest text-brand-orange">
                About
              </span>
            </div>

            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase mb-6">
              Meet <span className="text-brand-orange">{rider.firstName}</span>
            </h2>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              {rider.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {rider.stats.map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                  <div className="font-heading text-3xl font-bold text-brand-orange">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
