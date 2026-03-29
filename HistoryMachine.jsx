import { useState } from 'react';

const EVENTS = [
  { event: '🚀 First Moon Landing', fact: 'Astronauts Neil Armstrong and Buzz Aldrin walked on the Moon.', answer: '1969', eras: ['1945', '1969', '1989', '2001'] },
  { event: '🏛️ Great Pyramid Built', fact: 'The Great Pyramid of Giza was constructed as a royal tomb.', answer: '2560 BC', eras: ['500 BC', '1000 BC', '2560 BC', '3500 BC'] },
  { event: '📞 Telephone Invented', fact: 'Alexander Graham Bell made the first telephone call.', answer: '1876', eras: ['1776', '1826', '1876', '1926'] },
  { event: '🌍 Columbus Reaches America', fact: 'Christopher Columbus sailed from Spain and reached the Americas.', answer: '1492', eras: ['1292', '1392', '1492', '1592'] },
  { event: '✏️ Mona Lisa Painted', fact: 'Leonardo da Vinci painted his most famous masterpiece.', answer: '1503', eras: ['1303', '1403', '1503', '1603'] },
  { event: '⚔️ World War II Ends', fact: 'The deadliest conflict in human history came to an end.', answer: '1945', eras: ['1935', '1940', '1945', '1950'] },
  { event: '🍎 Newton Discovers Gravity', fact: 'Isaac Newton formulated the law of universal gravitation.', answer: '1687', eras: ['1487', '1587', '1687', '1787'] },
  { event: '🖨️ Printing Press Invented', fact: 'Johannes Gutenberg invented the movable-type printing press.', answer: '1440', eras: ['1240', '1340', '1440', '1540'] },
];

export default function HistoryMachine({ onBack }) {
  const [index, setIndex]       = useState(0);
  const [score, setScore]       = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [done, setDone]         = useState(false);

  const ev = EVENTS[index];

  function handleEra(era) {
    if (selected) return;
    setSelected(era);
    if (era === ev.answer) {
      setScore(s => s + 10);
      setFeedback('✅ Correct! Great history knowledge!');
    } else {
      setFeedback(`❌ Not quite! It happened in ${ev.answer}.`);
    }
  }

  function handleNext() {
    const next = index + 1;
    if (next >= EVENTS.length) { setDone(true); return; }
    setIndex(next);
    setSelected(null);
    setFeedback('');
  }

  if (done) {
    const pct = score / (EVENTS.length * 10);
    return (
      <div className="result-screen">
        <div className="trophy">{pct >= 0.8 ? '🏆' : pct >= 0.5 ? '🥈' : '🌟'}</div>
        <h2>Time Machine Complete!</h2>
        <p className="final-score">Score: {score} / {EVENTS.length * 10}</p>
        <div className="result-btns">
          <button className="btn-primary" onClick={() => { setIndex(0); setScore(0); setSelected(null); setFeedback(''); setDone(false); }}>🔄 Play Again</button>
          <button className="btn-secondary" onClick={onBack}>🏠 Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-wrap">
      <div className="game-topbar">
        <button className="back-btn" onClick={onBack}>← Home</button>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>⏳ History Time Machine</span>
        <span className="score-badge">⭐ {score}</span>
        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{index + 1} / {EVENTS.length}</span>
      </div>

      <div className="history-arena">
        <p className="history-instruction">📜 When did this happen? Pick the correct year!</p>

        <div className="event-card">
          <h3>{ev.event}</h3>
          <p>{ev.fact}</p>
        </div>

        <div className="era-choices">
          {ev.eras.map(era => {
            let cls = 'era-btn';
            if (selected) {
              if (era === ev.answer) cls += ' correct';
              else if (era === selected) cls += ' wrong';
            }
            return (
              <button key={era} className={cls} onClick={() => handleEra(era)} disabled={!!selected}>
                📅 {era}
              </button>
            );
          })}
        </div>

        {feedback && <p className="history-feedback">{feedback}</p>}

        {selected && (
          <button className="history-next-btn" onClick={handleNext}>
            {index + 1 >= EVENTS.length ? '🎉 See Results' : 'Next Event →'}
          </button>
        )}
      </div>
    </div>
  );
}
