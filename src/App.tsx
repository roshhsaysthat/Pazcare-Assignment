import { useEffect, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { Button, Nav, Sheet, Tag } from './design-system';
import { parseHash, products } from './products/registry';
import './products/messaging/messaging.css';
import './shell.css';

export default function App() {
  const [route, setRoute] = useState(() => parseHash(location.hash));
  const [info, setInfo] = useState(false);
  useEffect(() => { const on = () => setRoute(parseHash(location.hash)); window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on); }, []);

  const { product, concept } = route;
  const current = product.concepts.find((c) => c.id === concept)!;
  const View = product.views[concept];
  // Set state directly, then mirror to the hash. Some embedded viewers do not deliver hash changes back to the page.
  const go = (p: string, c: string) => {
    setRoute(parseHash(`#/${p}/${c}`));
    try { location.hash = `/${p}/${c}`; } catch { /* hash is only a convenience */ }
  };

  return (
    <div className="shell">
      <header className="shell__bar">
        <Nav label="Products" variant="pill" current={product.id} onSelect={(id) => go(id, products.find((p) => p.id === id)!.concepts[0].id)} items={products.map((p) => ({ id: p.id, label: p.name, icon: p.icon }))} />
        {product.concepts.length > 1 && (
          <Nav label="Concepts" variant="pill" current={concept} onSelect={(c) => go(product.id, c)} items={product.concepts.map((c) => ({ id: c.id, label: c.name, icon: <span className="shell__letter" aria-hidden="true">{c.letter}</span> }))} />
        )}
        {current.preferred && <Tag tone="success" dot>Preferred</Tag>}
        <Button variant="secondary" size="sm" icon={<Info size="1.25em" />} onClick={() => setInfo(true)}>Compare</Button>
      </header>
      <View key={`${product.id}-${concept}`} />
      <Sheet open={info} onClose={() => setInfo(false)} title={`${product.name}: concepts`} side="right">
        <p className="shell__blurb ds-muted">{product.blurb}</p>
        <ul className="shell__compare">
          {product.concepts.map((c) => (
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
