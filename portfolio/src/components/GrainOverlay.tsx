export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 select-none overflow-hidden"
    >
      <div className="bg-grain absolute inset-0 opacity-[0.035] mix-blend-overlay" />
      <div className="bg-scanlines absolute inset-0 opacity-40" />
      <div
        className="absolute inset-x-0 top-0 h-56 opacity-35"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 0%, rgba(255, 31, 61, 0.22) 0%, rgba(7, 4, 10, 0) 100%)',
        }}
      />
    </div>
  );
}
