/** Native <progress> with the number always shown beside it. */
export function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div className="ds-meter">
      <progress value={value} max={max} aria-label={label} />
      <span>{value}/{max}</span>
    </div>
  );
}
