import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Crown,
  ShieldOff,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { fetchAdminUsers, setUserSuspended, setUserRole, deleteUser } from '../features/admin/adminApi';
import { useAuth } from '../features/auth/useAuth';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AdminTabs } from '../components/admin/AdminTabs';

function RoleBadge({ role }: { role: 'USER' | 'ADMIN' }) {
  if (role === 'ADMIN') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-teal-violet-gradient px-2.5 py-1 text-xs font-semibold text-white shadow-glow">
        <Crown className="h-3 w-3" />
        Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium text-mist-700">
      Utilisateur
    </span>
  );
}

function StatusBadge({ isSuspended }: { isSuspended: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        isSuspended ? 'border-danger/20 bg-danger-50 text-danger' : 'border-teal/20 bg-teal/10 text-teal-700'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isSuspended ? 'bg-danger' : 'bg-teal-600'}`} />
      {isSuspended ? 'Suspendu' : 'Actif'}
    </span>
  );
}

type PendingAction =
  | { type: 'delete'; id: string; label: string }
  | { type: 'promote'; id: string; label: string }
  | { type: 'demote'; id: string; label: string }
  | null;

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', search, page],
    queryFn: () => fetchAdminUsers({ search: search || undefined, page }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
  const invalidateAndClose = () => {
    invalidate();
    setPendingAction(null);
  };

  const suspendMutation = useMutation({
    mutationFn: ({ id, isSuspended }: { id: string; isSuspended: boolean }) =>
      setUserSuspended(id, isSuspended),
    onSuccess: invalidate,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'USER' | 'ADMIN' }) => setUserRole(id, role),
    onSuccess: invalidateAndClose,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: invalidateAndClose,
  });

  function handleConfirmAction() {
    if (!pendingAction) return;
    if (pendingAction.type === 'delete') {
      deleteMutation.mutate(pendingAction.id);
    } else if (pendingAction.type === 'promote') {
      roleMutation.mutate({ id: pendingAction.id, role: 'ADMIN' });
    } else if (pendingAction.type === 'demote') {
      roleMutation.mutate({ id: pendingAction.id, role: 'USER' });
    }
  }

  const dialogContent: Record<
    NonNullable<PendingAction>['type'],
    { title: string; description: (label: string) => string; confirmLabel: string }
  > = {
    delete: {
      title: 'Supprimer ce compte ?',
      description: (label) =>
        `${label} sera définitivement supprimé, ainsi que tous ses projets. Cette action est irréversible.`,
      confirmLabel: 'Supprimer',
    },
    promote: {
      title: 'Promouvoir en administrateur ?',
      description: (label) => `${label} obtiendra un accès complet à l'espace administrateur.`,
      confirmLabel: 'Promouvoir',
    },
    demote: {
      title: 'Retirer les droits administrateur ?',
      description: (label) => `${label} redeviendra un utilisateur standard.`,
      confirmLabel: 'Rétrograder',
    },
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div>
      <AdminTabs />

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-700">Espace administrateur</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink-950">Utilisateurs</h1>
      <p className="mt-1 text-sm text-mist-700">{data?.total ?? 0} compte(s) au total.</p>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Rechercher par nom ou email..."
          className="pl-9"
        />
      </div>

      <Card className="mt-4 overflow-hidden !p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mist-200 bg-mist-50">
            <tr>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400">
                Utilisateur
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400">
                Rôle
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400">
                Portfolio
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400">
                Projets
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400">
                Statut
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-mist-400">
                Actions
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
            {!isLoading && data?.users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-mist-700">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
            {data?.users.map((u) => {
              const label = `${u.firstName} ${u.lastName} (${u.email})`;
              const isSelf = u.id === currentUser?.id;
              const isBusy =
                (suspendMutation.isPending && suspendMutation.variables?.id === u.id) ||
                (roleMutation.isPending && roleMutation.variables?.id === u.id) ||
                (deleteMutation.isPending && deleteMutation.variables === u.id);

              return (
                <tr key={u.id} className="transition-colors hover:bg-mist-50/60">
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink-950">
                      {u.firstName} {u.lastName}
                      {isSelf && <span className="ml-2 text-xs font-normal text-mist-400">(vous)</span>}
                    </p>
                    <p className="text-xs text-mist-400">{u.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-5 py-4">
                    {u.portfolioPublished && u.slug ? (
                      <a
                        href={`/${u.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium text-teal-700 hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Voir
                      </a>
                    ) : (
                      <span className="text-mist-400">Non publié</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-mist-700">{u._count.projects}</td>
                  <td className="px-5 py-4">
                    <StatusBadge isSuspended={u.isSuspended} />
                  </td>
                  <td className="px-5 py-4">
                    {isSelf ? (
                      <span className="text-xs text-mist-400">—</span>
                    ) : (
                      <div className="flex flex-wrap justify-end gap-2">
                        {u.role === 'ADMIN' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            isLoading={isBusy}
                            onClick={() => setPendingAction({ type: 'demote', id: u.id, label })}
                          >
                            <ShieldOff className="h-4 w-4" /> Rétrograder
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              isLoading={isBusy}
                              onClick={() => setPendingAction({ type: 'promote', id: u.id, label })}
                            >
                              <Crown className="h-4 w-4" /> Promouvoir
                            </Button>
                            <Button
                              variant={u.isSuspended ? 'outline' : 'danger'}
                              size="sm"
                              isLoading={isBusy}
                              onClick={() =>
                                suspendMutation.mutate({ id: u.id, isSuspended: !u.isSuspended })
                              }
                            >
                              {u.isSuspended ? (
                                <>
                                  <ShieldCheck className="h-4 w-4" /> Réactiver
                                </>
                              ) : (
                                <>
                                  <ShieldAlert className="h-4 w-4" /> Suspendre
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              isLoading={isBusy}
                              onClick={() => setPendingAction({ type: 'delete', id: u.id, label })}
                              className="text-danger hover:bg-danger-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
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

      {pendingAction && (
        <ConfirmDialog
          open
          title={dialogContent[pendingAction.type].title}
          description={dialogContent[pendingAction.type].description(pendingAction.label)}
          confirmLabel={dialogContent[pendingAction.type].confirmLabel}
          isLoading={deleteMutation.isPending || roleMutation.isPending}
          onConfirm={handleConfirmAction}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
}