export function QRCodeCard({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`grid size-24 grid-cols-5 gap-1 rounded-lg p-2 ${dark ? 'bg-white' : 'bg-ink'}`} aria-label="Demo QR-Code">
      {Array.from({ length: 25 }).map((_, index) => {
        const filled = [0, 1, 2, 4, 5, 7, 9, 10, 12, 13, 16, 18, 20, 21, 22, 24].includes(index);
        return <span className={`rounded-[2px] ${filled ? (dark ? 'bg-ink' : 'bg-white') : 'bg-transparent'}`} key={index} />;
      })}
    </div>
  );
}
