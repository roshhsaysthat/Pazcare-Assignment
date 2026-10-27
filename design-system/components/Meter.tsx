/** Native <progress> with the number always shown beside it. Pass `display` when "value/max" would mislead (counts, not scores). */
export function Meter({ value, max, label, display }: { value: number; max: number; label: string; display?: string }) {
  return (
    <div className="ds-meter">
      <progress value={value} max={max} aria-label={label} />
      <span>{display ?? `${value}/${max}`}</span>
    </div>
  );
}
