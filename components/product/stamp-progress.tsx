export function StampProgress({ stamps, total = 10, large = false }: { stamps: number; total?: number; large?: boolean }) {
  return (
    <div className="grid grid-cols-5 gap-2" aria-label={`${stamps} von ${total} Stempeln`}>
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`${large ? 'size-10' : 'size-7'} rounded-full border ${index < stamps ? 'border-white bg-white shadow-inner' : 'border-white/45 bg-white/10'}`}
        />
      ))}
    </div>
  );
}
