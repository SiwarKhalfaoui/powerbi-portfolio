import { useState, useEffect, FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { fetchGallery } from '../features/gallery/galleryApi';
import { PublicProjectCard } from '../features/public/PublicProjectCard';
import {
  BUSINESS_DOMAIN_LABELS,
  PROJECT_TYPE_LABELS,
  PROJECT_LEVEL_LABELS,
  BusinessDomain,
  ProjectType,
  ProjectLevel,
  GallerySort,
} from '../types';

export function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const businessDomain = (searchParams.get('businessDomain') ?? '') as BusinessDomain | '';
  const projectType = (searchParams.get('projectType') ?? '') as ProjectType | '';
  const level = (searchParams.get('level') ?? '') as ProjectLevel | '';
  const sort = (searchParams.get('sort') ?? 'recent') as GallerySort;
  const page = Number(searchParams.get('page') ?? '1');

  // Champ de recherche : state local pour ne pas réécrire l'URL à chaque
  // frappe, mais resynchronisé si l'URL change ailleurs (retour arrière).
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', search, businessDomain, projectType, level, sort, page],
    queryFn: () =>
      fetchGallery({
        search: search || undefined,
        businessDomain: businessDomain || undefined,
        projectType: projectType || undefined,
        level: level || undefined,
        sort,
        page,
      }),
  });

  // Fusionne un changement dans l'URL actuelle. Réinitialise la page à 1
  // sauf si le changement EST la page elle-même — un filtre modifié ne doit
  // jamais laisser l'utilisateur bloqué sur une page qui n'existe plus.
  function updateParams(changes: Record<string, string | undefined>, resetPage = true) {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });
    if (resetPage) {
      next.delete('page');
    }
    setSearchParams(next);
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    updateParams({ search: searchInput.trim() || undefined });
  }

  function resetFilters() {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="min-h-screen bg-mist-50">
      <header className="border-b border-mist-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-violet-gradient font-display text-sm font-bold text-ink-950">
              D
            </span>
            <span className="font-display text-base font-semibold text-mist-900">
              Dr.D Portfolio
            </span>
          </Link>
          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-mist-700 hover:bg-mist-100"
          >
            Se connecter
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-teal-700" />
          <h1 className="font-display text-2xl font-semibold text-mist-900">Galerie publique</h1>
        </div>
        <p className="mt-1 text-sm text-mist-700">
          Découvrez les projets Power BI partagés par la communauté.
        </p>

        <div className="mt-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Rechercher un projet..."
                className="w-full rounded-lg border border-mist-200 py-2 pl-9 pr-3 text-sm text-mist-900 focus:border-teal-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-600"
            >
              Rechercher
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            <select
              value={businessDomain}
              onChange={(e) => updateParams({ businessDomain: e.target.value || undefined })}
              className="rounded-lg border border-mist-200 px-3 py-2 text-sm text-mist-900"
            >
              <option value="">Tous les domaines</option>
              {Object.entries(BUSINESS_DOMAIN_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={projectType}
              onChange={(e) => updateParams({ projectType: e.target.value || undefined })}
              className="rounded-lg border border-mist-200 px-3 py-2 text-sm text-mist-900"
            >
              <option value="">Tous les types</option>
              {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={level}
              onChange={(e) => updateParams({ level: e.target.value || undefined })}
              className="rounded-lg border border-mist-200 px-3 py-2 text-sm text-mist-900"
            >
              <option value="">Tous les niveaux</option>
              {Object.entries(PROJECT_LEVEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <div className="ml-auto flex overflow-hidden rounded-lg border border-mist-200">
              <button
                type="button"
                onClick={() => updateParams({ sort: 'recent' })}
                className={`px-3 py-2 text-sm font-medium ${
                  sort === 'recent' ? 'bg-teal/10 text-teal-700' : 'text-mist-700 hover:bg-mist-100'
                }`}
              >
                Plus récent
              </button>
              <button
                type="button"
                onClick={() => updateParams({ sort: 'popular' })}
                className={`px-3 py-2 text-sm font-medium ${
                  sort === 'popular' ? 'bg-teal/10 text-teal-700' : 'text-mist-700 hover:bg-mist-100'
                }`}
              >
                Popularité
              </button>
            </div>

            {(businessDomain || projectType || level || search) && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg px-3 py-2 text-sm font-medium text-mist-400 hover:text-mist-700"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        <div className="mt-8">
          {isLoading && <p className="text-sm text-mist-700">Chargement...</p>}

          {!isLoading && data && data.projects.length === 0 && (
            <p className="text-sm text-mist-700">Aucun projet ne correspond à ces critères.</p>
          )}

          {!isLoading && data && data.projects.length > 0 && (
            <>
              <p className="mb-4 text-xs text-mist-400">
                {data.total} projet{data.total > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.projects.map((item) => (
                  <PublicProjectCard key={item.id} project={item} ownerSlug={item.owner.slug} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateParams({ page: String(Math.max(1, page - 1)) }, false)}
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
                    onClick={() => updateParams({ page: String(Math.min(totalPages, page + 1)) }, false)}
                    disabled={page === totalPages}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-mist-200 text-mist-700 hover:bg-mist-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}