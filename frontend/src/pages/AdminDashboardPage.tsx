import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Globe, FolderKanban, CheckCircle2, Link2, Eye, ArrowUpRight } from 'lucide-react';
import { fetchAdminStats } from '../features/admin/adminApi';
import { Card } from '../components/ui/Card';
import { AdminTabs } from '../components/admin/AdminTabs';

type Accent = 'violet' | 'teal' | 'amber' | 'signature';

const accentClasses: Record<Accent, string> = {
  violet: 'bg-violet/10 text-violet-600',
  teal: 'bg-teal/10 text-teal-700',
  amber: 'bg-amber/10 text-amber-600',
  signature: 'bg-teal-violet-gradient text-white shadow-glow',
};

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  accent: Accent;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-mist-200 bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-elevated">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-2xl font-semibold text-ink-950">
          {value.toLocaleString('fr-FR')}
        </p>
        <p className="text-sm text-mist-700">{label}</p>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchAdminStats,
  });

  return (
    <div>
      <AdminTabs />

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-700">
        Espace administrateur
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink-950">Vue d'ensemble</h1>
      <p className="mt-1 text-sm text-mist-700">Suivi de l'activité de la plateforme Dr.D Portfolio.</p>

      {isLoading && <p className="mt-6 text-sm text-mist-700">Chargement...</p>}

      {stats && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard icon={Users} label="Utilisateurs" value={stats.totalUsers} accent="violet" />
            <StatCard icon={Globe} label="Portfolios publiés" value={stats.publishedPortfolios} accent="teal" />
            <StatCard icon={FolderKanban} label="Projets au total" value={stats.totalProjects} accent="signature" />
            <StatCard icon={CheckCircle2} label="Projets publiés" value={stats.publishedProjects} accent="teal" />
            <StatCard icon={Link2} label="Projets interactifs" value={stats.interactiveProjects} accent="amber" />
            <StatCard icon={Eye} label="Vues cumulées" value={stats.totalViews} accent="violet" />
          </div>

          <Card className="mt-6">
            <h2 className="font-display text-lg font-semibold text-ink-950">Projets les plus consultés</h2>
            <div className="mt-4 divide-y divide-mist-100">
              {stats.topProjects.length === 0 && (
                <p className="py-4 text-sm text-mist-700">Aucun projet publié pour le moment.</p>
              )}
              {stats.topProjects.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-4 py-3.5">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold ${
                      idx === 0 ? 'bg-teal-violet-gradient text-white shadow-glow' : 'bg-mist-100 text-mist-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-950">{p.title}</p>
                    <p className="text-xs text-mist-400">
                      {p.owner.firstName} {p.owner.lastName}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium text-mist-700">
                    {p.viewCount} vues
                  </span>
                  {p.owner.slug && (
                    <Link
                      to={`/${p.owner.slug}/${p.slug}`}
                      target="_blank"
                      className="flex shrink-0 items-center gap-1 text-sm font-medium text-teal-700 hover:underline"
                    >
                      Voir <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}