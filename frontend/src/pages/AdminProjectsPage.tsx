import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { fetchAdminProjects, setProjectStatusAdmin } from '../features/admin/adminApi';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { PROJECT_STATUS_LABELS, ProjectStatus } from '../types';
import { AdminTabs } from '../components/admin/AdminTabs';

const statusBadgeClasses: Record<ProjectStatus, string> = {
  DRAFT: 'bg-mist-100 text-mist-700',
  PUBLISHED: 'bg-teal/10 text-teal-700',
  PRIVATE: 'bg-violet/10 text-violet-600',
  ARCHIVED: 'bg-danger-50 text-danger',
};

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClasses[status]}`}>
      {PROJECT_STATUS_LABELS[status]}
    </span>
  );
}

export function AdminProjectsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProjectStatus | ''>('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'projects', search, status, page],
    queryFn: () =>
      fetchAdminProjects({ search: search || undefined, status: status || undefined, page }),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
      setProjectStatusAdmin(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
    },
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div>
      <AdminTabs />

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-700">Espace administrateur</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink-950">Projets</h1>
      <p className="mt-1 text-sm text-mist-700">{data?.total ?? 0} projet(s) au total.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un projet..."
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as ProjectStatus | '');
            setPage(1);
          }}
          className="sm:max-w-xs"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <Card className="mt-4 overflow-hidden !p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mist-200 bg-mist-50">
            <tr>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400">
                Projet
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400">
                Propriétaire
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400">
                Vues
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400">
                Statut
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400"></th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400">
                Modifier
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-mist-700">
                  Chargement...
                </td>
              </tr>
            )}
            {!isLoading && data?.projects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-mist-700">
                  Aucun projet trouvé.
                </td>
              </tr>
            )}
            {data?.projects.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-mist-50/60">
                <td className="px-5 py-4 font-medium text-ink-950">{p.title}</td>
                <td className="px-5 py-4 text-mist-700">
                  {p.owner.firstName} {p.owner.lastName}
                </td>
                <td className="px-5 py-4 text-mist-700">{p.viewCount}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-5 py-4">
                  {p.owner.slug ? (
                    <a
                      href={`/${p.owner.slug}/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-teal-700 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Voir
                    </a>
                  ) : (
                    <span className="text-xs text-mist-400">Portfolio non publié</span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <Select
                    value={p.status}
                    disabled={mutation.isPending && mutation.variables?.id === p.id}
                    onChange={(e) =>
                      mutation.mutate({ id: p.id, status: e.target.value as ProjectStatus })
                    }
                    className="h-9 w-40"
                  >
                    {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-mist-200 text-mist-700 hover:bg-mist-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-mist-700">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-mist-200 text-mist-700 hover:bg-mist-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}