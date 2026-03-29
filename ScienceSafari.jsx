import { useState, useEffect, useRef, useCallback } from 'react';

const ROUNDS = [
  { question: 'Catch the animal with 8 legs!', target: '🕷️', target_name: 'Spider', distractors: [{ e: '🐝', n: 'Bee' }, { e: '🦋', n: 'Butterfly' }, { e: '🐛', n: 'Caterpillar' }] },
  { question: 'Catch the fastest land animal!', target: '🐆', target_name: 'Cheetah', distractors: [{ e: '🦁', n: 'Lion' }, { e: '🐘', n: 'Elephant' }, { e: '🦓', n: 'Zebra' }] },
  { question: 'Catch the animal that lives in water AND on land!', target: '🐸', target_name: 'Frog', distractors: [{ e: '🐟', n: 'Fish' }, { e: '🦅', n: 'Eagle' }, { e: '🐇', n: 'Rabbit' }] },
  { question: 'Catch the largest land animal!', target: '🐘', target_name: 'Elephant', distractors: [{ e: '🦏', n: 'Rhino' }, { e: '🦛', n: 'Hippo' }, { e: '🐃', n: 'Buffalo' }] },
  { question: 'Catch the animal that makes honey!', target: '🐝', target_name: 'Bee', distractors: [{ e: '🦋', n: 'Butterfly' }, { e: '🐛', n: 'Caterpillar' }, { e: '🐞', n: 'Ladybug' }] },
  { question: 'Catch the bird that cannot fly!', target: '🐧', target_name: 'Penguin', distractors: [{ e: '🦅', n: 'Eagle' }, { e: '🦜', n: 'Parrot' }, { e: '🦆', n: 'Duck' }] },
  { question: 'Catch the animal with the longest neck!', target: '🦒', target_name: 'Giraffe', distractors: [{ e: '🐘', n: 'Elephant' }, { e: '🦓', n: 'Zebra' }, { e: '🦁', n: 'Lion' }] },
  { question: 'Catch the animal that sleeps all winter!', target: '🐻', target_name: 'Bear', distractors: [{ e: '🦊', n: 'Fox' }, { e: '🐺', n: 'Wolf' }, { e: '🦌', n: 'Deer' }] },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function ScienceSafari({ onBack }) {
  const [rIndex, setRIndex]   = useState(0);
  const [score, setScore]     = useState(0);
  const [lives, setLives]     = useState(3);
  const [animals, setAnimals] = useState([]);
  const [caught, setCaught]   = useState(null);
  const [done, setDone]       = useState(false);
  const [shake, setShake]     = useState(false);
  const timerRef = useRef(null);
  const idRef    = useRef(0);

  const r = ROUNDS[rIndex];

  const spawnAnimals = useCallback((round) => {
    const all = shuffle([
      { e: round.target, n: round.target_name, isTarget: true },
      ...round.distractors.map(d => ({ ...d, isTarget: false })),
    ]);
    setAnimals(all.map((a, i) => ({
      ...a,
      id: idRef.current++,
      top: 35 + Math.random() * 30,
      duration: 5 + Math.random() * 4,
      delay: i * 1.2,
    })));
  }, []);

  useEffect(() => { spawnAnimals(r); }, [rIndex, spawnAnimals, r]);

  useEffect(() => {
    if (animals.length === 0 || caught !== null) return;
    const maxTime = (Math.max(...animals.map(a => a.duration + a.delay)) + 1) * 1000;
    timerRef.current = setTimeout(() => {
      setLives(l => { const n = l - 1; if (n <= 0) setDone(true); return Math.max(n, 0); });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      advance();
    }, maxTime);
    return () => clearTimeout(timerRef.current);
  }, [animals, caught]);

  function advance() {
    setCaught(null);
    setAnimals([]);
    setRIndex(i => {
      const next = i + 1;
      if (next >= ROUNDS.length) { setDone(true); return i; }
      return next;
    });
  }

  function handleCatch(animal) {
    if (caught !== null) return;
    clearTimeout(timerRef.current);
    setCaught({ id: animal.id, correct: animal.isTarget });
    if (animal.isTarget) {
      setScore(s => s + 10);
    } else {
      setLives(l => { const n = l - 1; if (n <= 0) setTimeout(() => setDone(true), 800); return Math.max(n, 0); });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setTimeout(() => advance(), 900);
  }

  if (done) {
    const pct = score / (ROUNDS.length * 10);
    return (
      <div className="result-screen">
        <div className="trophy">{pct >= 0.8 ? '🏆' : pct >= 0.5 ? '🥈' : '🌟'}</div>
        <h2>Science Safari Complete!</h2>
        <p className="final-score">Score: {score} / {ROUNDS.length * 10}</p>
        <div className="result-btns">
          <button className="btn-primary" onClick={() => { setRIndex(0); setScore(0); setLives(3); setDone(false); setAnimals([]); setCaught(null); }}>🔄 Play Again</button>
          <button className="btn-secondary" onClick={onBack}>🏠 Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-wrap">
      <div className={`game-topbar ${shake ? 'shake' : ''}`}>
        <button className="back-btn" onClick={onBack}>← Home</button>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>🦁 Science Safari</span>
        <span className="score-badge">⭐ {score}</span>
        <span className="lives">{'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}</span>
      </div>

      <div className="safari-arena">
        <div className="safari-sky" />
        <div className="safari-grass" />
        <div className="safari-ground" />

        <div className="target-banner">
          🎯 {r.question}
        </div>

        {animals.map(a => (
          <div
            key={a.id}
            className="animal"
            style={{
              top: `${a.top}%`,
              animationDuration: `${a.duration}s`,
              animationDelay: `${a.delay}s`,
            }}
            onClick={() => handleCatch(a)}
          >
            <div style={{ fontSize: '3.5rem' }}>
              {caught?.id === a.id ? (a.isTarget ? '✅' : '❌') : a.e}
            </div>
            <div className="animal-label">{a.n}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
