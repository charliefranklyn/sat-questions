export default function SectionShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen" style={{ background: "#eaf5eb" }}>
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-40" style={{ background: "#a8d5b0" }} />
        <div className="absolute top-[40%] -right-20 w-[320px] h-[320px] rounded-full opacity-25" style={{ background: "#a8d5b0" }} />
        <div className="absolute -bottom-24 left-[10%] w-[400px] h-[400px] rounded-full opacity-20" style={{ background: "#a8d5b0" }} />
      </div>
      {children}
    </div>
  );
}
