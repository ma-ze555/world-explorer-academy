import { useState, useEffect, useRef, useCallback } from 'react';

const QUESTIONS = [
  { q: '7 + 8 = ?',   answer: 15, wrongs: [13, 14, 16] },
  { q: '12 - 5 = ?',  answer: 7,  wrongs: [5, 6, 8] },
  { q: '6 × 4 = ?',   answer: 24, wrongs: [20, 22, 26] },
  { q: '36 ÷ 6 = ?',  answer: 6,  wrongs: [4, 5, 7] },
  { q: '15 + 27 = ?', answer: 42, wrongs: [40, 41, 43] },
  { q: '9 × 7 = ?',   answer: 63, wrongs: [54, 56, 72] },
  { q: '100 - 37 = ?',answer: 63, wrongs: [53, 73, 83] },
  { q: '8 × 8 = ?',   answer: 64, wrongs: [56, 60, 68] },
  { q: '48 ÷ 8 = ?',  answer: 6,  wrongs: [4, 5, 7] },
  { q: '25 + 38 = ?', answer: 63, wrongs: [61, 62, 64] },
];

const COLORS = ['#e53935','#8e24aa','#1e88e5','#00897b','#f4511e','#6d4c41','#039be5','#43a047'];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MathQuest({ onBack }) {
  const [qIndex, setQIndex]   = useState(0);
  const [score, setScore]     = useState(0);
  const [lives, setLives]     = useState(3);
  const [balloons, setBalloons] = useState([]);
  const [popped, setPopped]   = useState(null); // { id, correct }
  const [done, setDone]       = useState(false);
  const [shake, setShake]     = useState(false);
  const timerRef = useRef(null);
  const idRef    = useRef(0);

  const q = QUESTIONS[qIndex];

  const spawnBalloons = useCallback((question) => {
    const options = shuffle([question.answer, ...question.wrongs]);
    const newBalloons = options.map((val, i) => ({
      id: idRef.current++,
      value: val,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      left: 10 + i * 22 + Math.random() * 5,
      duration: 7 + Math.random() * 4,
      isAnswer: val === question.answer,
    }));
    setBalloons(newBalloons);
  }, []);

  useEffect(() => {
    spawnBalloons(q);
  }, [qIndex, spawnBalloons, q]);

  // If all balloons escape without being popped → lose a life
  useEffect(() => {
    if (balloons.length === 0 || popped !== null) return;
    const maxDuration = Math.max(...balloons.map(b => b.duration)) * 1000 + 500;
    timerRef.current = setTimeout(() => {
      setLives(l => {
        const next = l - 1;
        if (next <= 0) { setDone(true); return 0; }
        return next;
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      advance();
    }, maxDuration);
    return () => clearTimeout(timerRef.current);
  }, [balloons, popped]);

  function advance() {
    setPopped(null);
    setBalloons([]);
    setQIndex(i => {
      const next = i + 1;
      if (next >= QUESTIONS.length) { setDone(true); return i; }
      return next;
    });
  }

  function handlePop(balloon) {
    if (popped !== null) return;
    clearTimeout(timerRef.current);
    setPopped({ id: balloon.id, correct: balloon.isAnswer });
    if (balloon.isAnswer) {
      setScore(s => s + 10);
    } else {
      setLives(l => {
        const next = l - 1;
        if (next <= 0) { setTimeout(() => setDone(true), 800); return 0; }
        return next;
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setTimeout(() => advance(), 900);
  }

  if (done) {
    const pct = score / (QUESTIONS.length * 10);
    return (
      <div className="result-screen">
        <div className="trophy">{pct >= 0.8 ? '🏆' : pct >= 0.5 ? '🥈' : '🌟'}</div>
        <h2>Math Quest Complete!</h2>
        <p className="final-score">Score: {score} / {QUESTIONS.length * 10}</p>
        <div className="result-btns">
          <button className="btn-primary" onClick={() => { setQIndex(0); setScore(0); setLives(3); setDone(false); setBalloons([]); setPopped(null); }}>🔄 Play Again</button>
          <button className="btn-secondary" onClick={onBack}>🏠 Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-wrap">
      <div className={`game-topbar ${shake ? 'shake' : ''}`}>
        <button className="back-btn" onClick={onBack}>← Home</button>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>🎈 Math Quest</span>
        <span className="score-badge">⭐ {score}</span>
        <span className="lives">{'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}</span>
      </div>

      <div className="balloon-arena">
        {/* Clouds */}
        {[15, 45, 70].map((left, i) => (
          <span key={i} className="cloud" style={{ left: `${left}%`, top: `${10 + i * 8}%`, animationDuration: `${20 + i * 8}s`, animationDelay: `${i * 3}s` }}>☁️</span>
        ))}

        <div className="question-banner">
          {q.q}
        </div>

        {balloons.map(b => (
          <div
            key={b.id}
            className={`balloon ${popped?.id === b.id ? 'pop' : ''}`}
            style={{ left: `${b.left}%`, animationDuration: `${b.duration}s` }}
            onClick={() => handlePop(b)}
          >
            <div className="balloon-body" style={{ background: b.color }}>
              {popped?.id === b.id ? (b.correct ? '✅' : '❌') : b.value}
            </div>
            <div className="balloon-string" />
          </div>
        ))}

        <div className="ground" />
      </div>
    </div>
  );
}
