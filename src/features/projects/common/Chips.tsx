export type Chip = Readonly<{ label: string; color: string }>;

export function Chips({ items }: { items: readonly Chip[] }) {
  return (
    <div className='flex flex-wrap gap-2.5'>
      {items.map(({ label, color }) => (
        <span
          key={label}
          className='inline-flex items-center px-2 py-[2px] rounded-lg shadow-sm text-sm font-bold'
          style={{ backgroundColor: color }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
