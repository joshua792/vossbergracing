type Result = {
  id: string;
  date: string;
  track: string;
  qualifying: number;
  race1: number;
  race2: number | null;
  championship: number;
};

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function ResultsTable({ results }: { results: Result[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="font-heading text-xs uppercase tracking-widest text-gray-500 pb-3 pr-4">
                Date
              </th>
              <th className="font-heading text-xs uppercase tracking-widest text-gray-500 pb-3 pr-4">
                Track
              </th>
              <th className="font-heading text-xs uppercase tracking-widest text-gray-500 pb-3 pr-4 text-center">
                Qual
              </th>
              <th className="font-heading text-xs uppercase tracking-widest text-gray-500 pb-3 pr-4 text-center">
                Race 1
              </th>
              <th className="font-heading text-xs uppercase tracking-widest text-gray-500 pb-3 pr-4 text-center">
                Race 2
              </th>
              <th className="font-heading text-xs uppercase tracking-widest text-gray-500 pb-3 text-center">
                Champ
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr
                key={result.id}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-4 pr-4 text-sm text-gray-400">
                  {new Date(result.date + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="py-4 pr-4 font-medium text-white">
                  {result.track}
                </td>
                <td className="py-4 pr-4 text-center">
                  <span className="inline-block bg-brand-blue/20 text-brand-blue px-3 py-1 rounded text-sm font-heading font-bold">
                    {ordinal(result.qualifying)}
                  </span>
                </td>
                <td className="py-4 pr-4 text-center">
                  <span className="inline-block bg-brand-orange/20 text-brand-orange px-3 py-1 rounded text-sm font-heading font-bold">
                    {ordinal(result.race1)}
                  </span>
                </td>
                <td className="py-4 pr-4 text-center">
                  {result.race2 ? (
                    <span className="inline-block bg-brand-orange/20 text-brand-orange px-3 py-1 rounded text-sm font-heading font-bold">
                      {ordinal(result.race2)}
                    </span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="py-4 text-center">
                  <span className="font-heading text-lg font-bold text-white">
                    {ordinal(result.championship)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-white/5 border border-white/5 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-white">{result.track}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(result.date + "T00:00:00").toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="font-heading text-lg font-bold text-brand-orange">
                {ordinal(result.championship)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/5 rounded px-2 py-2">
                <div className="text-[10px] text-gray-500 uppercase">Qual</div>
                <div className="font-heading font-bold text-brand-blue">
                  {ordinal(result.qualifying)}
                </div>
              </div>
              <div className="bg-white/5 rounded px-2 py-2">
                <div className="text-[10px] text-gray-500 uppercase">R1</div>
                <div className="font-heading font-bold text-brand-orange">
                  {ordinal(result.race1)}
                </div>
              </div>
              <div className="bg-white/5 rounded px-2 py-2">
                <div className="text-[10px] text-gray-500 uppercase">R2</div>
                <div className="font-heading font-bold text-brand-orange">
                  {result.race2 ? ordinal(result.race2) : "—"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
