export default function Home({ onSelect }) {
  return (
    <div className="home">
      <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🌍</div>
      <h1 className="home-title">World Explorer Academy</h1>
      <p className="home-sub">Pick your adventure and start learning!</p>
      <div className="zones">
        <div className="zone-card math" onClick={() => onSelect('math')}>
          <div className="icon">🎈</div>
          <h2>Math Quest</h2>
          <p>Pop the balloon with the right answer!</p>
        </div>
        <div className="zone-card science" onClick={() => onSelect('science')}>
          <div className="icon">🦁</div>
          <h2>Science Safari</h2>
          <p>Catch the right animal before it escapes!</p>
        </div>
        <div className="zone-card history" onClick={() => onSelect('history')}>
          <div className="icon">⏳</div>
          <h2>History Time Machine</h2>
          <p>Match events to the right era in history!</p>
        </div>
      </div>
    </div>
  );
}
