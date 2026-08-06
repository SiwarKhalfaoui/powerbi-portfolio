import { useEffect, useState } from 'react';

const HANDLES = ['sarah.k', 'marc.d', 'toi'];
const TYPE_SPEED = 90;
const DELETE_SPEED = 45;
const PAUSE_MS = 1300;

/**
 * Types out example personal URLs, ending on "drd.io/toi" — visualizes the
 * product's actual differentiator (a real, personal, shareable link) rather
 * than decorating with unrelated motion.
 */
export function LiveUrlBadge() {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText('toi');
      return;
    }

    const current = HANDLES[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), TYPE_SPEED);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), PAUSE_MS);
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), PAUSE_MS);
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), DELETE_SPEED);
      } else {
        setIndex((i) => (i + 1) % HANDLES.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, index]);

  return (
    <div
      aria-hidden="true"
      className="inline-flex items-center gap-2 rounded-full border border-mist-200 bg-white px-4 py-2 font-mono text-xs text-mist-700 shadow-elevated"
    >
      <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-teal" />
      <span>
        drd.io/<span className="text-teal-700">{text}</span>
        <span className="ml-0.5 inline-block h-[11px] w-[1.5px] animate-pulse bg-teal-700 align-middle" />
      </span>
    </div>
  );
}