const VISITOR_ID_KEY = 'dv_visitor_id';

/** Identifiant anonyme persistant, généré une fois par navigateur et
 * stocké en local — sert uniquement à dédupliquer le comptage de vues des
 * visiteurs non connectés sur les pages publiques. Jamais lié à un compte,
 * jamais transmis ni utilisé ailleurs dans l'application. */
export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}