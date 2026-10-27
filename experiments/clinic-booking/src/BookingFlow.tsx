import { useEffect, useMemo, useRef, useState } from 'react';
import { CaretLeft, CheckCircle } from '@phosphor-icons/react';
import { Button, Card, FilterTag, Input, Meter, Textarea, tintVar } from '../../../design-system';
import { clinicians, nextDays, services, slotsFor } from './data';
import './booking.css';

const STEPS = ['Visit', 'Time', 'Details', 'Review'] as const;
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function BookingFlow() {
  const days = useMemo(() => nextDays(), []);
  const [step, setStep] = useState(0);
  const [service, setService] = useState('');
  const [clinician, setClinician] = useState('any');
  const [day, setDay] = useState(days[0].iso);
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  // Move focus to the new step's heading so keyboard and screen reader users land in the right place.
  // Skipped on first render so the page does not grab focus when it loads.
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } heading.current?.focus(); }, [step, done]);

  const svc = services.find((s) => s.id === service);
  const who = clinicians.find((c) => c.id === clinician)!;
  const dayInfo = days.find((d) => d.iso === day)!;
  const slots = slotsFor(day, clinician);
  const errors = { name: name.trim() ? '' : 'Enter your name so we can greet you.', email: emailOk(email) ? '' : 'Enter an email like name@example.com.' };

  const canNext = [!!service, !!time, true, true][step];
  const next = () => {
    if (step === 2) { setTouched(true); if (errors.name || errors.email) return; }
    if (step === 3) { setDone(true); return; }
    setStep((s) => s + 1);
  };
  const reset = () => { setStep(0); setService(''); setTime(''); setName(''); setEmail(''); setNotes(''); setTouched(false); setDone(false); };
  const ref = `LP-${(1000 + ((name.length * 37 + email.length * 11 + (time ? time.charCodeAt(1) : 0)) % 9000))}`;

  const summary = (
    <dl className="bk__summary">
      <div><dt>Visit</dt><dd>{svc ? `${svc.name}, ${svc.minutes} min` : 'Not chosen yet'}</dd></div>
      <div><dt>Clinician</dt><dd>{who.name}</dd></div>
      <div><dt>When</dt><dd>{time ? `${dayInfo.long}, ${time}` : 'Not chosen yet'}</dd></div>
      {name && <div><dt>Patient</dt><dd>{name}</dd></div>}
    </dl>
  );

  if (done) {
    return (
      <main className="rd bk">
        <div className="bk__col">
          <Card variant="tint" tint="sage" size="xl" className="bk__done">
            <CheckCircle size="2.5em" weight="fill" aria-hidden="true" />
            <h1 ref={heading} tabIndex={-1} className="bk__title"><span className="bk__lead">You are booked,</span> {name.split(' ')[0]}.</h1>
            <p>{svc?.name} with {who.name}, {dayInfo.long} at {time}.</p>
            <p>Reference <strong>{ref}</strong></p>
            <p className="bk__demo">Design demo: nothing was sent and no booking was made.</p>
            <Button variant="primary" onClick={reset}>Book another visit</Button>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="rd bk">
      <div className="bk__layout">
        <div className="bk__col">
          <header className="bk__head">
            <p className="ds-muted">Linden Physio, Gothenburg</p>
            <h1 className="bk__title"><span className="bk__lead">Book a visit,</span><br />it takes about a minute.</h1>
            <Meter value={step + 1} max={STEPS.length} label="Booking progress" display={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`} />
          </header>

          <section aria-labelledby="step-h" className="bk__step">
            <h2 id="step-h" ref={heading} tabIndex={-1} className="bk__h2">
              {['What do you need?', 'Pick a time', 'Your details', 'Check and confirm'][step]}
            </h2>

            {step === 0 && (
              <fieldset className="bk__services">
                <legend className="ds-sr-only">Type of visit</legend>
                {services.map((s) => (
                  <label key={s.id} className="bk__service" data-on={service === s.id || undefined}>
                    <input type="radio" name="service" className="ds-sr-only" checked={service === s.id} onChange={() => setService(s.id)} />
                    <span className="bk__chip" style={{ background: tintVar(s.tint) }}>{s.minutes}<small>min</small></span>
                    <span><strong>{s.name}</strong><br /><span className="ds-muted">{s.blurb}</span></span>
                  </label>
                ))}
              </fieldset>
            )}

            {step === 1 && (
              <div className="bk__time">
                <label className="bk__select"><span className="bk__label">Clinician</span>
                  <select className="ds-input" value={clinician} onChange={(e) => { setClinician(e.target.value); setTime(''); }}>
                    {clinicians.map((c) => <option key={c.id} value={c.id}>{c.name} · {c.focus}</option>)}
                  </select>
                </label>
                <div role="group" aria-label="Choose a day" className="bk__row">
                  {days.map((d) => <FilterTag key={d.iso} pressed={day === d.iso} onClick={() => { setDay(d.iso); setTime(''); }}>{d.label}</FilterTag>)}
                </div>
                <div role="group" aria-label={`Available times on ${dayInfo.long}`} className="bk__slots">
                  {slots.map((s) => <FilterTag key={s.time} pressed={time === s.time} disabled={!s.free} onClick={() => setTime(s.time)}>{s.time}{!s.free && <span className="ds-sr-only"> unavailable</span>}</FilterTag>)}
                </div>
                <p className="ds-muted" role="status">{time ? `Selected ${dayInfo.long} at ${time}.` : 'Greyed times are taken.'}</p>
              </div>
            )}

            {step === 2 && (
              <form className="bk__form" noValidate onSubmit={(e) => { e.preventDefault(); next(); }}>
                <Input label="Full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={touched ? errors.name : undefined} />
                <Input label="Email" type="email" autoComplete="email" hint="We use this to send your confirmation." value={email} onChange={(e) => setEmail(e.target.value)} error={touched ? errors.email : undefined} />
                <Textarea label="Anything we should know? (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </form>
            )}

            {step === 3 && (
              <Card variant="outline" size="lg">
                {summary}
                {notes && <p className="bk__notes"><span className="ds-muted">Your note:</span> {notes}</p>}
                <p className="ds-muted">Free to change up to 24 hours before your visit.</p>
              </Card>
            )}
          </section>

          <div className="bk__nav">
            {step > 0 ? <Button variant="ghost" icon={<CaretLeft size="1.25em" />} onClick={() => setStep((s) => s - 1)}>Back</Button> : <span />}
            <Button variant="primary" size="lg" disabled={!canNext} onClick={next}>{step === 3 ? 'Confirm booking' : 'Continue'}</Button>
          </div>
        </div>

        <aside className="bk__aside" aria-label="Your booking so far">
          <Card variant="flat" size="lg" className="bk__aside-card"><h2 className="bk__aside-h">Your visit</h2>{summary}</Card>
        </aside>
      </div>

      <details className="bk__mobile-summary">
        <summary>Your visit so far</summary>
        {summary}
      </details>
    </main>
  );
}
