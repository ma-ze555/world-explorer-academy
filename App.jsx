import { useState } from 'react';
import Home from './components/Home';
import MathQuest from './components/MathQuest';
import ScienceSafari from './components/ScienceSafari';
import HistoryMachine from './components/HistoryMachine';

export default function App() {
  const [zone, setZone] = useState(null);

  function renderZone() {
    const back = () => setZone(null);
    if (zone === 'math') return <MathQuest onBack={back} />;
    if (zone === 'science') return <ScienceSafari onBack={back} />;
    if (zone === 'history') return <HistoryMachine onBack={back} />;
    return <Home onSelect={setZone} />;
  }

  return <div>{renderZone()}</div>;
}
