export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#001033]">
      {/* PLRA Background Artwork */}
      <img
        src="/assets/auth/plra-background.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[65%] w-auto select-none opacity-40 sm:h-[75%] sm:opacity-50 md:h-[85%] md:opacity-70 lg:h-[h-full] lg:opacity-100 xl:h-[95%]"
      />

      {/* ERP Decorative Text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[3%] top-0 select-none font-['Times_New_Roman',Times,serif] text-[70px] font-semibold leading-[0.8] text-white/[0.08] sm:text-[90px] md:text-[110px] lg:text-[140px] xl:text-[170px]"
      >
        ERP
      </div>

      {/* Page Content */}
      <div className="relative z-10 min-h-dvh">{children}</div>
    </main>
  );
}