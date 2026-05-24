import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Sponsors } from "@/components/sponsors";
import { Subscribe } from "@/components/subscribe";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Subscribe />
      <Sponsors />
    </>
  );
}
