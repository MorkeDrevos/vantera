import CityCard from './CityCard';
import { CITIES } from '@/data/cities';

export default function ExploreGrid() {
  return (
    <section className="mt-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">
          Explore cities
        </h2>
        <span className="text-xs text-zinc-400">
          {CITIES.length} cities
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CITIES.map((city) => (
          <CityCard key={city.slug} city={city} />
        ))}
      </div>
    </section>
  );
}
