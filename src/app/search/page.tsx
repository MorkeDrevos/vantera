// src/app/search/page.tsx

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const q = params.q;
  const city = params.city;

  return (
    <main className="min-h-screen bg-white">
      <h1 className="text-2xl font-semibold">Search results</h1>

      <pre className="mt-6 text-sm text-neutral-600">
        {JSON.stringify(params, null, 2)}
      </pre>
    </main>
  );
}
