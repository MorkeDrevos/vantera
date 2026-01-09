import Link from 'next/link';

const ROUTES = [
  {
    title: 'European capitals',
    desc: 'Authority cities with deep demand',
    href: '/listings?collection=european-capitals',
    accent: 'from-amber-300/15 to-white/5',
  },
  {
    title: 'Coastal cities',
    desc: 'Lifestyle demand and scarcity zones',
    href: '/listings?collection=coastal-cities',
    accent: 'from-emerald-300/12 to-white/5',
  },
  {
    title: '24/7 cities',
    desc: 'Liquidity, rentals, always-on markets',
    href: '/listings?collection=always-on',
    accent: 'from-sky-300/12 to-white/5',
  },
  {
    title: 'High-growth hubs',
    desc: 'Momentum markets and new wealth',
    href: '/listings?collection=high-growth',
    accent: 'from-fuchsia-300/12 to-white/5',
  },
] as const;

export default function FeaturedRoutesRow() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ROUTES.map((r) => (
        <Link
          key={r.title}
          href={r.href}
          className={`group rounded-3xl border border-white/10 bg-gradient-to-b ${r.accent} p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20`}
          prefetch
        >
          <div className="text-sm font-semibold text-zinc-50">{r.title}</div>
          <div className="mt-1 text-xs leading-relaxed text-zinc-300">{r.desc}</div>
          <div className="mt-4 h-px w-full bg-white/10" />
          <div className="mt-4 text-xs text-zinc-400 transition group-hover:text-zinc-300">Open route</div>
        </Link>
      ))}
    </div>
  );
}
