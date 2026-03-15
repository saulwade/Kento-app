import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-white overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-28 px-6">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
            Restaurant Operations Platform 🍽️
          </div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-8">
            Run your restaurant.<br />
            <span className="text-gray-400">Not spreadsheets.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-500 leading-relaxed mb-4 max-w-2xl mx-auto font-light">
            Kento gives restaurant owners real-time control over inventory,
            food costs, and operations — in one clean platform.
          </p>
          <p className="text-base text-gray-400 mb-12 leading-relaxed">
            No more guesswork.&nbsp; No more messy spreadsheets.&nbsp; Just clarity.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center h-13 px-8 py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-base hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Start free trial
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center h-13 px-8 py-3.5 rounded-2xl bg-white text-gray-700 font-medium text-base border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              Sign in
            </Link>
          </div>

          {/* Trust line */}
          <p className="text-sm text-gray-400 font-medium">
            Built for restaurant operators who want control.
          </p>
        </div>
      </section>

      {/* ─── PROBLEM ──────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-[#f8f9fc]">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">
              The Problem
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Restaurant operators face<br />three chronic problems
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_16px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-6">📦</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Inventory chaos</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                No clear picture of what&apos;s actually in stock.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed mt-2">
                Overbuying, shortages, and waste quietly destroy your margins every day.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_16px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-6">💸</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Hidden food costs</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Most restaurants don&apos;t know the real cost of each dish.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed mt-2">
                Prices change. Portions vary. Margins disappear.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_16px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-6">📋</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Inconsistent execution</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your best processes live in someone&apos;s head. Or worse — on paper.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed mt-2">
                Nothing is tracked. Nothing is consistent.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── TRANSITION ───────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-snug mb-4 tracking-tight">
            Running a restaurant shouldn&apos;t feel<br />like detective work.
          </p>
          <p className="text-lg text-gray-400 font-light">
            Kento gives you operational clarity.
          </p>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-[#f8f9fc]">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-20">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">
              Features
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Built for restaurant operators
            </h2>
          </div>

          <div className="space-y-28">

            {/* Feature 1 — text left, card right */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 order-2 lg:order-1">
                <div className="text-3xl mb-5">📦</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                  Inventory Intelligence
                </h3>
                <p className="text-gray-500 mb-3 leading-relaxed text-lg font-light">
                  Track every ingredient in real time.
                </p>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Know exactly: what&apos;s in stock, what&apos;s running low, where waste is happening.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {[
                    "Purchase, usage, waste, and adjustment logs",
                    "Automatic stock deduction from recipes",
                    "Real-time inventory visibility",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-semibold text-gray-700">
                  Stop guessing what&apos;s in your kitchen.
                </p>
              </div>
              <div className="flex-1 order-1 lg:order-2">
                <div className="bg-white rounded-3xl shadow-[0_4px_32px_-4px_rgba(0,0,0,0.1)] p-16 flex items-center justify-center aspect-square max-w-sm mx-auto">
                  <span className="text-8xl">📦</span>
                </div>
              </div>
            </div>

            {/* Feature 2 — card left, text right */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <div className="bg-white rounded-3xl shadow-[0_4px_32px_-4px_rgba(0,0,0,0.1)] p-16 flex items-center justify-center aspect-square max-w-sm mx-auto">
                  <span className="text-8xl">📊</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-3xl mb-5">📊</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                  Food Cost Engine
                </h3>
                <p className="text-gray-500 mb-3 leading-relaxed text-lg font-light">
                  Know the true cost of every dish.
                </p>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Kento connects recipes directly to ingredients so food costs update
                  automatically when prices change.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {[
                    "Recipe-level cost breakdown",
                    "Food cost percentage per dish",
                    "Profitability insights",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-semibold text-gray-700">
                  Every dish. Every margin. Under control.
                </p>
              </div>
            </div>

            {/* Feature 3 — text left, card right */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 order-2 lg:order-1">
                <div className="text-3xl mb-5">✅</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                  Staff Operations
                </h3>
                <p className="text-gray-500 mb-3 leading-relaxed text-lg font-light">
                  Standardize how your restaurant runs.
                </p>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Turn procedures into role-based digital checklists that your team
                  follows every shift.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {[
                    "Create checklists by role and shift type",
                    "Track completion in real time",
                    "Ensure operational consistency",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-semibold text-gray-700">
                  Run the same great operation every day.
                </p>
              </div>
              <div className="flex-1 order-1 lg:order-2">
                <div className="bg-white rounded-3xl shadow-[0_4px_32px_-4px_rgba(0,0,0,0.1)] p-16 flex items-center justify-center aspect-square max-w-sm mx-auto">
                  <span className="text-8xl">✅</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-20">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">
              How It Works
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Get operational clarity in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Add your ingredients",
                desc: "Create your ingredient list with costs and stock levels.",
              },
              {
                step: "02",
                title: "Connect recipes",
                desc: "Attach ingredients to each dish in your menu.",
              },
              {
                step: "03",
                title: "Run with clarity",
                desc: "Track inventory, food cost, and staff operations in one place.",
              },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="bg-[#f8f9fc] rounded-3xl p-8 h-full">
                  <p className="text-5xl font-bold text-gray-200 mb-5 leading-none">{s.step}</p>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── BENEFITS ─────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-[#f8f9fc]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-12 sm:p-16 shadow-[0_2px_32px_-4px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="flex-1">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                  Why restaurants<br />choose Kento
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Running a restaurant is already hard.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Your software shouldn&apos;t make it harder.
                </p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
                  With Kento you get:
                </p>
                <ul className="space-y-4">
                  {[
                    "Real-time inventory clarity",
                    "True dish profitability",
                    "Consistent team execution",
                    "Fewer operational mistakes",
                    "Less time in spreadsheets",
                  ].map((b) => (
                    <li key={b} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="text-sm text-gray-600 font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gray-900 rounded-3xl px-12 py-16 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.35)]">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
              Start managing your restaurant<br />the smart way.
            </h2>
            <p className="text-gray-400 mb-10 text-lg font-light leading-relaxed">
              Join restaurant operators who use Kento to stay in control.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-white text-gray-900 font-semibold text-base hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Create your workspace
            </Link>
            <p className="text-gray-600 text-sm mt-5">
              Set up takes less than 5 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-base font-bold text-gray-900">Kento</span>
            <p className="text-xs text-gray-400 mt-0.5">Restaurant operations platform.</p>
          </div>
          <p className="text-xs text-gray-400">© 2026 Kento</p>
        </div>
      </footer>

    </main>
  );
}
