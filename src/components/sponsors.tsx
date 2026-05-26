import Image from "next/image";
import { listSponsors } from "@/lib/sponsors";
import { rider } from "@/config/rider";

export async function Sponsors() {
  const all = await listSponsors();
  const titleSponsors = all.filter((s) => s.tier === "title");
  const regularSponsors = all.filter((s) => s.tier === "sponsor");
  const teamSponsors = all.filter((s) => s.tier === "team");

  return (
    <section className="relative py-24 bg-brand-dark-lighter" id="sponsors">
      {/* Top diagonal divider */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-16"
        >
          <polygon fill="#0D0D0D" points="0,60 1440,0 1440,60" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-1 bg-brand-blue" />
          <span className="font-heading text-sm uppercase tracking-widest text-brand-orange">
            Partners
          </span>
          <div className="w-12 h-1 bg-brand-blue" />
        </div>

        <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase mb-4">
          Our <span className="text-brand-orange">Sponsors</span>
        </h2>

        <p className="text-gray-400 max-w-xl mx-auto mb-12">
          None of this would be possible without the support of our incredible
          sponsors and partners. Thank you for believing in the journey.
        </p>

        {/* Title sponsors */}
        {titleSponsors.map((sponsor) => {
          const light = sponsor.logoBackground === "light";
          const card = (
            <div className="bg-gradient-to-br from-brand-blue/10 to-brand-orange/10 border border-white/10 rounded-xl px-10 py-10 inline-flex flex-col items-center gap-4">
              <div className="font-heading text-xs uppercase tracking-[0.2em] text-brand-orange">
                Title Sponsor
              </div>
              {sponsor.logoUrl ? (
                <div
                  className={`relative w-64 h-28 rounded-lg ${
                    light ? "bg-white p-3" : ""
                  }`}
                >
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                    sizes="256px"
                  />
                </div>
              ) : (
                <div className="font-heading text-3xl md:text-4xl font-bold text-white">
                  {sponsor.name}
                </div>
              )}
              {sponsor.url && (
                <span className="text-sm text-gray-400">
                  {sponsor.name} &rarr;
                </span>
              )}
            </div>
          );

          return (
            <div key={sponsor.id} className="mb-12">
              {sponsor.url ? (
                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block group hover:opacity-90 transition-opacity"
                >
                  {card}
                </a>
              ) : (
                card
              )}
            </div>
          );
        })}

        {/* Sponsors */}
        {regularSponsors.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            {regularSponsors.map((sponsor) => {
              const light = sponsor.logoBackground === "light";
              const inner = sponsor.logoUrl ? (
                <div
                  className={`relative h-20 w-44 rounded ${
                    light ? "bg-white p-2" : ""
                  }`}
                >
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                    sizes="176px"
                  />
                </div>
              ) : (
                <span className="font-heading text-xl font-bold text-white group-hover:text-brand-orange transition-colors">
                  {sponsor.name}
                </span>
              );

              return sponsor.url ? (
                <a
                  key={sponsor.id}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white/5 border border-white/10 rounded-lg px-6 py-4
                             hover:border-brand-orange/30 hover:bg-white/10 transition-all"
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={sponsor.id}
                  className="group bg-white/5 border border-white/10 rounded-lg px-6 py-4"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        )}

        {/* Team */}
        {teamSponsors.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-8">
            {teamSponsors.map((sponsor) => {
              const light = sponsor.logoBackground === "light";
              const inner = sponsor.logoUrl ? (
                <div
                  className={`relative h-14 w-36 rounded ${
                    light ? "bg-white p-2" : ""
                  }`}
                >
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    fill
                    className={`object-contain ${light ? "" : "opacity-80"}`}
                    sizes="144px"
                  />
                </div>
              ) : (
                <span className="font-heading text-lg font-bold text-gray-400">
                  {sponsor.name}
                </span>
              );

              return sponsor.url ? (
                <a
                  key={sponsor.id}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 border border-white/5 rounded-lg px-6 py-4 hover:border-white/20 transition-colors"
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={sponsor.id}
                  className="bg-white/5 border border-white/5 rounded-lg px-6 py-4"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-brand-blue/20 to-brand-orange/20 rounded-xl p-8 border border-white/5">
          <h3 className="font-heading text-xl uppercase font-bold mb-2">
            Interested in Sponsorship?
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {rider.sponsorshipBlurb}
          </p>
          <a
            href={`mailto:${rider.contactEmail}`}
            className="inline-block bg-brand-orange hover:bg-orange-500 text-white font-heading
                       uppercase tracking-wider text-sm px-8 py-3 rounded-lg transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
