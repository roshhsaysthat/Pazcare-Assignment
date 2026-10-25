import { useEffect, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { Button, Nav, Sheet, Tag } from './design-system';
import RailConcept from './products/messaging/RailConcept';
import CanvasConcept from './products/messaging/CanvasConcept';
import RoomsConcept from './products/messaging/RoomsConcept';
import { concepts } from './products/messaging/concepts';
import './products/messaging/messaging.css';
import './shell.css';

type Id = (typeof concepts)[number]['id'];
const views: Record<Id, () => JSX.Element> = { rail: RailConcept, canvas: CanvasConcept, rooms: RoomsConcept };
const read = (): Id => (concepts.find((c) => `#/${c.id}` === location.hash)?.id ?? 'rail');

export default function App() {
  const [id, setId] = useState<Id>(read);
  const [info, setInfo] = useState(false);
  useEffect(() => { const on = () => setId(read()); window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on); }, []);
  const current = concepts.find((c) => c.id === id)!;
  const View = views[id];

  return (
    <div className="shell">
      <header className="shell__bar">
        <Nav
          label="Concepts"
          variant="pill"
          current={id}
          onSelect={(n) => { location.hash = `/${n}`; }}
          items={concepts.map((c) => ({ id: c.id, label: c.name, icon: <span className="shell__letter" aria-hidden="true">{c.letter}</span> }))}
        />
        <p className="shell__idea"><strong>{current.reference}</strong> {current.idea}</p>
        {current.preferred && <Tag tone="success" dot>Preferred</Tag>}
        <Button variant="secondary" size="sm" icon={<Info size="1.25em" />} onClick={() => setInfo(true)}>Compare</Button>
      </header>
      <View key={id} />
      <Sheet open={info} onClose={() => setInfo(false)} title="Team messaging: three concepts" side="right">
        <ul className="shell__compare">
          {concepts.map((c) => (
            <li key={c.id}>
              <h3>{c.letter}. {c.name} {c.preferred && <Tag tone="success" dot>Preferred</Tag>}</h3>
              <p><strong>Core idea.</strong> {c.idea}</p>
              <p className="ds-muted">{c.why}</p>
            </li>
          ))}
        </ul>
      </Sheet>
    </div>
  );
}
