export default function GlobalBrandLoader() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden transition-colors duration-500"
      style={{ background: "var(--page)" }}
    >
      <div
        className="absolute w-72 h-72 rounded-full blur-[100px] animate-pulse-glow pointer-events-none"
        style={{
          background: "var(--muted)",
        }}
      />

      <div className="relative flex items-center justify-center w-64 h-64">
        <div
          className="absolute inset-0 rounded-full border border-dashed opacity-20 animate-portal-spin"
          style={{
            borderColor: "var(--body)",
            borderWidth: "1px",
          }}
        />

        <div
          className="absolute w-full h-full animate-portal-spin"
          style={{ animationDirection: "reverse", animationDuration: "6s" }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-40"
            style={{ background: "var(--muted)" }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-40"
            style={{ background: "var(--muted)" }}
          />
        </div>

        <h1
          className="text-2xl font-bold uppercase tracking-[0.3em] animate-cinematic-text text-center ml-[0.3em]"
          style={{ color: "var(--body)" }}
        >
          Soulj
        </h1>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-1 opacity-40">
        <p
          className="text-[9px] tracking-[0.25em] uppercase font-medium"
          style={{ color: "var(--body)" }}
        >
          Made For The Culture
        </p>
      </div>
    </div>
  );
}
