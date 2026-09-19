import { Activity, Gift, ScanLine, Users } from 'lucide-react';

const stats = [
  { label: 'Heute', value: '42', sub: 'Stempel', icon: ScanLine },
  { label: 'Aktive Karten', value: '186', sub: 'Demo', icon: Users },
  { label: 'Rewards', value: '23', sub: 'eingelöst', icon: Gift },
  { label: 'Wiederkehrend', value: '68%', sub: 'Beispiel', icon: Activity },
];

export function MerchantDashboard() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#101827] p-4 text-white shadow-[0_30px_100px_rgba(17,24,39,0.28)]">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">Produktdemo / Beispieldaten</p>
          <h3 className="mt-1 text-xl font-semibold">Händleransicht</h3>
        </div>
        <span className="rounded-full bg-emerald-400/12 px-3 py-1 font-mono text-[10px] text-emerald-200">LIVE</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4" key={stat.label}>
            <stat.icon className="mb-5 text-blue-200" size={18} />
            <p className="text-3xl font-semibold">{stat.value}</p>
            <p className="mt-1 text-xs text-white/55">{stat.label} · {stat.sub}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <div className="mb-5 flex items-center justify-between">
            <p className="font-semibold">Stamp Activity</p>
            <span className="text-xs text-white/45">Heute</span>
          </div>
          <div className="flex h-40 items-end gap-3">
            {[32, 58, 45, 74, 62, 92, 70, 84].map((height, index) => (
              <span className="flex-1 rounded-t-lg bg-gradient-to-t from-blue-500 to-violet-300" style={{ height: `${height}%` }} key={index} />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
          <p className="mb-4 font-semibold">Recent Rewards</p>
          {['Gratis-Getränk', 'Kaffee aufs Haus', '10% Pflege'].map((item, index) => (
            <div className="flex items-center justify-between border-t border-white/10 py-3 text-sm" key={item}>
              <span>{item}</span>
              <span className="text-white/45">#{index + 21}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
