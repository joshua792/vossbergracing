import { db } from "@/lib/db";
import { results } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { ResultsTable } from "@/components/results-table";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const allResults = await db
    .select()
    .from(results)
    .orderBy(desc(results.date));

  return (
    <div className="pt-24 pb-16 min-h-screen bg-brand-dark">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-1 bg-brand-orange" />
          <span className="font-heading text-sm uppercase tracking-widest text-brand-orange">
            2026 Season
          </span>
        </div>

        <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase mb-2">
          Race <span className="text-brand-orange">Results</span>
        </h1>
        <p className="text-gray-400 mb-10">
          MotoAmerica Talent Cup &middot; #11 Reese Frankenfield
        </p>

        {allResults.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="font-heading text-xl uppercase">No results yet</p>
            <p className="text-sm mt-2">Check back after the next race weekend.</p>
          </div>
        ) : (
          <ResultsTable results={allResults} />
        )}
      </div>
    </div>
  );
}
