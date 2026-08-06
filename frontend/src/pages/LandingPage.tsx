import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Link2, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { HeroShowcase } from '../components/brand/HeroShowcase';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Vos dashboards, mis en valeur',
    description:
      "Présentez vos rapports Power BI avec captures, contexte métier et résultats — pas juste un lien perdu dans un CV.",
  },
  {
    icon: Link2,
    title: 'Un lien public, prêt à partager',
    description:
      'Chaque profil obtient une URL personnalisée à glisser dans LinkedIn, un CV ou une carte de visite digitale.',
  },
  {
    icon: ShieldCheck,
    title: 'Vous gardez le contrôle',
    description:
      'Rien n’est publié automatiquement : vous choisissez ce qui apparaît publiquement, projet par projet.',
  },
];

const ROLES = ['Data Analyst', 'Développeur Power BI', 'Consultant BI', 'Freelance'];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-mist-50">
      <div className="relative overflow-hidden bg-mist-50">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-mesh-light" />

        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-violet-gradient font-display text-base font-bold text-white">
              D
            </span>
            <span className="font-display text-lg font-semibold text-mist-900">Dr.D Portfolio</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Se connecter
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="accent" size="sm">
                Créer un compte
              </Button>
            </Link>
          </div>
        </header>

        <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p
              className="animate-fade-in-up font-mono text-xs font-medium uppercase tracking-wider text-teal-700"
              style={{ animationDelay: '0ms' }}
            >
              // pour la communauté Power BI, Data &amp; AI
            </p>

            <h1
              className="mt-4 animate-fade-in-up font-display text-4xl font-semibold leading-tight tracking-tight text-mist-900 text-balance sm:text-5xl lg:text-6xl"
              style={{ animationDelay: '80ms' }}
            >
              Le portfolio que vos{' '}
              <span className="bg-teal-violet-gradient bg-clip-text text-transparent">
                dashboards
              </span>{' '}
              méritent.
            </h1>

            <p
              className="mt-5 max-w-lg animate-fade-in-up text-base text-mist-700"
              style={{ animationDelay: '160ms' }}
            >
              Créez un espace professionnel pour exposer vos projets Power BI, vos études de cas et
              vos compétences data — et partagez un lien unique avec recruteurs et clients.
            </p>

            <div
              className="mt-6 flex animate-fade-in-up flex-wrap items-center gap-2"
              style={{ animationDelay: '240ms' }}
            >
              {ROLES.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-mist-200 bg-white px-3 py-1 text-xs font-medium text-mist-700"
                >
                  {role}
                </span>
              ))}
            </div>

            <div
              className="mt-8 flex animate-fade-in-up flex-wrap items-center gap-3"
              style={{ animationDelay: '320ms' }}
            >
              <Link to="/signup">
                <Button variant="accent" size="lg" className="group">
                  Créer mon portfolio
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  J'ai déjà un compte
                </Button>
              </Link>
            </div>

            <p
              className="mt-4 animate-fade-in-up text-xs text-mist-400"
              style={{ animationDelay: '380ms' }}
            >
              Gratuit pour commencer · Aucune carte bancaire requise
            </p>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <HeroShowcase />
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-mist-200 bg-white p-6 shadow-card transition-colors hover:border-teal/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 text-teal-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-mist-900">{title}</h3>
                <p className="mt-2 text-sm text-mist-700">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}