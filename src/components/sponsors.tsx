import Image from "next/image";

const sponsors = [
  {
    name: "Phison",
    url: "https://www.phison.com/",
    tier: "primary" as const,
  },
  {
    name: "Pascari",
    url: "https://www.phisonenterprise.com/",
    tier: "primary" as const,
  },
  {
    name: "Rocksolid Racing",
    tier: "team" as const,
  },
];

export function Sponsors() {
  return (
    <section className="relative py-24 bg-brand-dark-lighter" id="sponsors">
      {/* Top diagonal divider */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-16"
        >
          <polygon fill="#111d33" points="0,60 1440,0 1440,60" />
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

        {/* Primary sponsors */}
        <div className="flex flex-wrap justify-center items-center gap-12 mb-12">
          {sponsors
            .filter((s) => s.tier === "primary")
            .map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/5 border border-white/10 rounded-xl px-10 py-8
                           hover:border-brand-orange/30 hover:bg-white/10 transition-all"
              >
                <span className="font-heading text-2xl md:text-3xl font-bold text-white group-hover:text-brand-orange transition-colors">
                  {sponsor.name}
                </span>
              </a>
            ))}
        </div>

        {/* Team */}
        <div className="flex flex-wrap justify-center items-center gap-8">
          {sponsors
            .filter((s) => s.tier === "team")
            .map((sponsor) => (
              <div
                key={sponsor.name}
                className="bg-white/5 border border-white/5 rounded-lg px-8 py-5"
              >
                <span className="font-heading text-lg font-bold text-gray-400">
                  {sponsor.name}
                </span>
              </div>
            ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-brand-blue/20 to-brand-orange/20 rounded-xl p-8 border border-white/5">
          <h3 className="font-heading text-xl uppercase font-bold mb-2">
            Interested in Sponsorship?
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Partner with a rising talent in American motorcycle racing.
          </p>
          <a
            href="mailto:contact@reesefrankenfield.com"
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
