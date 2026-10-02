import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Main content */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:grid lg:grid-cols-2 lg:px-10 lg:py-12 xl:grid-cols-[52%_48%] xl:px-16 2xl:grid-cols-[55%_45%]">
        {/* Left side intentionally empty.
            PLRA artwork comes from auth layout */}
        <div className="hidden lg:block" />

        {/* Login Form Area */}
        <div className="flex w-full items-center justify-center lg:justify-start lg:pl-8 xl:pl-12 2xl:pl-6">
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 px-4 pb-4 text-center text-[10px] text-white/70 sm:pb-5 sm:text-xs">
        Punjab Land Record Authority @PLRA
      </footer>
    </div>
  );
}