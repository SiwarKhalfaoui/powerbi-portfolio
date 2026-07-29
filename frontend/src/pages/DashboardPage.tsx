import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, FolderKanban, LayoutGrid, Plus, User as UserIcon } from 'lucide-react';
import { useAuth } from '../features/auth/useAuth';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { listMyProjectsRequest } from '../features/projects/projectsApi';
import { AVAILABILITY_LABELS, Project } from '../types';

const PROFILE_FIELDS = [
  'profilePhotoUrl',
  'professionalTitle',
  'bio',
  'country',
  'city',
  'languages',
  'skills',
  'services',
  'linkedinUrl',
  'githubUrl',
  'websiteUrl',
  'publicContactEmail',
] as const;

export function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    listMyProjectsRequest()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  if (!user) return null;

  const completedFields = PROFILE_FIELDS.filter((field) => {
    const value = user[field as keyof typeof user];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  }).length;
  const completion = Math.round((completedFields / PROFILE_FIELDS.length) * 100);
  const publishedCount = projects?.filter((p) => p.status === 'PUBLISHED').length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-teal-700">
          Tableau de bord
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-mist-900">
          Bonjour, {user.firstName} 👋
        </h1>
      </div>

      <Card className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={`${user.firstName} ${user.lastName}`} photoUrl={user.profilePhotoUrl} size="lg" />
          <div>
            <p className="font-display text-lg font-semibold text-mist-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-mist-700">
              {user.professionalTitle || 'Aucun titre professionnel renseigné'}
            </p>
            <span className="mt-1 inline-flex items-center rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-medium text-teal-700">
              {AVAILABILITY_LABELS[user.availability]}
            </span>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="text-sm text-mist-700">Profil complété à {completion}%</p>
          <div className="mt-2 h-2 w-full min-w-[160px] overflow-hidden rounded-full bg-mist-100">
            <div
              className="h-full rounded-full bg-teal-violet-gradient transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
          <Link
            to="/dashboard/profile"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:underline"
          >
            <UserIcon className="h-4 w-4" />
            Compléter mon profil
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal-700">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-mist-900">
              {projects === null ? '—' : projects.length} projet{(projects?.length ?? 0) > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-mist-700">
              {publishedCount} publié{publishedCount > 1 ? 's' : ''} · {(projects?.length ?? 0) - publishedCount} en brouillon
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/projects">
            <Button variant="outline" size="sm">
              Voir mes projets
            </Button>
          </Link>
          <Link to="/dashboard/projects/new">
            <Button variant="accent" size="sm">
              <Plus className="h-4 w-4" />
              Nouveau
            </Button>
          </Link>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet/10 text-violet-600">
            <ExternalLink className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-mist-900">
              {user.portfolioPublished ? 'Portfolio publié' : 'Portfolio non publié'}
            </p>
            <p className="text-sm text-mist-700">
              {user.portfolioPublished
                ? 'Votre portfolio est visible publiquement.'
                : 'Publiez votre portfolio pour obtenir votre lien public.'}
            </p>
          </div>
        </div>
        <Link to="/dashboard/profile">
          <Button variant="outline" size="sm">
            Gérer la publication
          </Button>
        </Link>
      </Card>

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/10 text-amber-600">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-mist-900">Galerie publique</p>
            <p className="text-sm text-mist-700">Découvrez les projets publiés par la communauté.</p>
          </div>
        </div>
        <Link to="/gallery">
          <Button variant="outline" size="sm">
            Explorer
          </Button>
        </Link>
      </Card>
    </div>
  );
}