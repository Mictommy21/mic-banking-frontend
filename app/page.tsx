import Link from "next/link";

const quickServices = [
  {
    icon: "＋",
    title: "Open Account",
    description: "Create your MIC Banking account quickly and securely.",
    href: "/register",
  },
  {
    icon: "⇄",
    title: "Money Transfer",
    description: "Transfer money securely between supported accounts.",
    href: "/login",
  },
  {
    icon: "▣",
    title: "Check Balance",
    description: "View your account balance and financial activity.",
    href: "/login",
  },
  {
    icon: "▤",
    title: "Transactions",
    description: "Review your latest deposits, withdrawals and transfers.",
    href: "/login",
  },
  {
    icon: "◈",
    title: "Digital Banking",
    description: "Manage your banking services from one secure platform.",
    href: "/login",
  },
  {
    icon: "▤",
    title: "Loan Services",
    description: "Explore future lending and financing solutions.",
    href: "#services",
  },
];

const bankingServices = [
  {
    number: "01",
    title: "Savings Account",
    description:
      "Keep your money secure while having convenient access to your everyday banking services.",
  },
  {
    number: "02",
    title: "Current Account",
    description:
      "Designed for customers who need flexible account management and frequent transactions.",
  },
  {
    number: "03",
    title: "Money Transfers",
    description:
      "Move money between accounts quickly while keeping every transaction traceable.",
  },
  {
    number: "04",
    title: "Loans & Financing",
    description:
      "Future MIC Banking lending solutions designed to support personal and business goals.",
  },
  {
    number: "05",
    title: "Payments",
    description:
      "A modern foundation for managing payments and other everyday financial activities.",
  },
  {
    number: "06",
    title: "Transaction History",
    description:
      "Keep track of your financial activity with a clear and organized transaction history.",
  },
];

const digitalFeatures = [
  "Secure account authentication",
  "Real-time account information",
  "Fast account-to-account transfers",
  "Transaction history",
  "Personal profile management",
  "Secure banking environment",
];

const faqs = [
  {
    question: "How do I open a MIC Banking account?",
    answer:
      "Select Create Account and complete the registration process. Your account can then be accessed through the secure login portal.",
  },
  {
    question: "Can I transfer money using MIC Banking?",
    answer:
      "Yes. Authenticated customers can use the transfer service to move money between supported banking accounts.",
  },
  {
    question: "Can I view my transaction history?",
    answer:
      "Yes. Your dashboard provides access to your transaction history, including deposits, withdrawals and transfers.",
  },
  {
    question: "Is my banking information secure?",
    answer:
      "MIC Banking is designed with authenticated access and protected banking operations to help keep customer information secure.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* =====================================================
          TOP INFORMATION BAR
      ===================================================== */}
      <div className="bg-[#071a35] px-6 py-2 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p>MIC Banking — Simple. Secure. Modern.</p>

          <div className="hidden gap-6 sm:flex">
            <span>24/7 Digital Banking</span>
            <span>Secure Banking</span>
            <span>Support</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-6 py-4 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-lg font-black text-white shadow-md">
              M
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight text-[#071a35]">
                MIC<span className="text-blue-700">Banking</span>
              </h1>

              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Digital Banking
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            <a
              href="#home"
              className="text-sm font-semibold text-slate-700 transition hover:text-blue-700"
            >
              Home
            </a>

            <a
              href="#services"
              className="text-sm font-semibold text-slate-700 transition hover:text-blue-700"
            >
              Services
            </a>

            <a
              href="#digital"
              className="text-sm font-semibold text-slate-700 transition hover:text-blue-700"
            >
              Digital Banking
            </a>

            <a
              href="#security"
              className="text-sm font-semibold text-slate-700 transition hover:text-blue-700"
            >
              Security
            </a>

            <a
              href="#contact"
              className="text-sm font-semibold text-slate-700 transition hover:text-blue-700"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50 sm:block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-800"
            >
              Open Account
            </Link>
          </div>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section
        id="home"
        className="relative overflow-hidden bg-[#071a35]"
      >
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-white/5 px-4 py-2 text-xs font-semibold text-blue-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              WELCOME TO MIC BANKING
            </div>

            <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Banking made
              <span className="text-blue-400"> simple,</span>
              <br />
              secure and modern.
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Manage your account, transfer money, monitor transactions and
              access essential banking services from one secure digital
              platform.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="rounded-xl bg-blue-600 px-7 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
              >
                Login to Banking
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-center text-sm font-bold text-white transition hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Secure Access
              </div>

              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Fast Transfers
              </div>

              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Easy Management
              </div>
            </div>
          </div>

          {/* Hero banking card */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur">
              <div className="rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      MIC Banking
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      Digital Account
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-sm font-black text-white">
                    M
                  </div>
                </div>

                <div className="mt-10">
                  <p className="text-xs font-medium text-slate-400">
                    AVAILABLE BALANCE
                  </p>

                  <p className="mt-2 text-4xl font-black tracking-tight text-slate-900">
                    TZS 2,450,000
                  </p>

                  <p className="mt-2 text-xs text-emerald-600">
                    ● Account active
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    className="rounded-xl bg-blue-700 px-4 py-3 text-center text-sm font-bold text-white"
                  >
                    Transfer
                  </Link>

                  <Link
                    href="/login"
                    className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700"
                  >
                    Transactions
                  </Link>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-xl sm:block">
              <p className="text-xs font-semibold text-slate-400">
                SECURE TRANSACTION
              </p>

              <p className="mt-1 text-sm font-bold text-emerald-600">
                ✓ Protected
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK SERVICES
      ===================================================== */}
      <section className="border-b border-slate-200 bg-slate-50 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Quick Banking
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              What would you like to do?
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickServices.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                    {service.icon}
                  </div>

                  <span className="text-xl text-slate-300 transition group-hover:text-blue-700">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}
      <section
        id="services"
        className="bg-white px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Banking Services
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
              Everything you need for everyday banking
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              MIC Banking brings essential financial services together in
              one convenient and secure platform.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bankingServices.map((service) => (
              <div
                key={service.number}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-sm font-black text-blue-700">
                  {service.number}
                </span>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {service.description}
                </p>

                <a
                  href="/login"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
                >
                  Learn more →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          DIGITAL BANKING
      ===================================================== */}
      <section
        id="digital"
        className="bg-slate-50 px-6 py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Digital Banking
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
              Your bank, available when you need it.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              Access important banking operations through a modern digital
              experience designed to make everyday banking easier.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {digitalFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600">
                    ✓
                  </span>

                  <span className="text-sm font-semibold text-slate-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/login"
              className="mt-8 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
            >
              Access Digital Banking
            </Link>
          </div>

          <div className="rounded-3xl bg-[#071a35] p-6 shadow-2xl">
            <div className="rounded-2xl bg-slate-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">
                    ACCOUNT OVERVIEW
                  </p>

                  <p className="mt-1 font-bold">
                    MIC Digital Banking
                  </p>
                </div>

                <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  ACTIVE
                </span>
              </div>

              <div className="mt-8 rounded-2xl bg-white/5 p-5">
                <p className="text-xs text-slate-400">
                  TOTAL BALANCE
                </p>

                <p className="mt-2 text-3xl font-black">
                  TZS 4,850,000
                </p>

                <div className="mt-6 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-3/4 rounded-full bg-blue-500" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-400">
                    Deposits
                  </p>

                  <p className="mt-2 font-bold">
                    +TZS 850K
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-400">
                    Transfers
                  </p>

                  <p className="mt-2 font-bold">
                    24
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-400">
                    Status
                  </p>

                  <p className="mt-2 font-bold text-emerald-400">
                    Good
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECURITY
      ===================================================== */}
      <section
        id="security"
        className="bg-[#071a35] px-6 py-20 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
              Security First
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Your financial information deserves strong protection.
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              MIC Banking is designed around secure authentication,
              controlled access and protected banking operations.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Authenticated customer access",
                "Role-based banking permissions",
                "Protected account operations",
                "Transaction monitoring",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    ✓
                  </span>

                  <span className="font-semibold text-slate-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl">
              🔒
            </div>

            <h3 className="mt-7 text-2xl font-bold">
              Secure by design
            </h3>

            <p className="mt-4 leading-7 text-slate-300">
              Every authenticated customer operates within their permitted
              banking environment while important account operations remain
              protected.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 p-5">
                <p className="text-2xl font-black">
                  24/7
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Digital access
                </p>
              </div>

              <div className="rounded-xl bg-white/5 p-5">
                <p className="text-2xl font-black">
                  Secure
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Authentication
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINANCIAL TOOLS
      ===================================================== */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-blue-50 p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                Financial Tools
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-900">
                Plan your next financial goal
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                MIC Banking can provide tools that help customers understand
                their financial options and plan ahead.
              </p>

              <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">
                    Loan Calculator
                  </span>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    Coming Soon
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Loan amount
                    </p>

                    <p className="mt-2 font-bold text-slate-800">
                      TZS 5,000,000
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Period
                    </p>

                    <p className="mt-2 font-bold text-slate-800">
                      24 Months
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 text-white">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                Customer Support
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Need help with your banking?
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Our support section gives customers a simple way to find
                assistance and information about their banking services.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-white/5 p-5">
                  <p className="text-sm font-semibold text-slate-400">
                    PHONE
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    0794722630
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 p-5">
                  <p className="text-sm font-semibold text-slate-400">
                    EMAIL
                  </p>

                  <p className="mt-1 break-all text-lg font-bold">
                    mictommyBankInfo@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Help Center
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <summary className="cursor-pointer list-none pr-8 text-lg font-bold text-slate-900">
                  {faq.question}
                </summary>

                <p className="mt-4 leading-7 text-slate-500">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="bg-blue-700 px-6 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-3xl font-black text-white">
              Ready to start banking with MIC?
            </h2>

            <p className="mt-2 text-blue-100">
              Create your account and experience modern digital banking.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-white px-7 py-3.5 text-center text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Create Account
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/30 px-7 py-3.5 text-center text-sm font-bold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer
        id="contact"
        className="bg-[#071a35] px-6 py-14 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-2xl font-black">
              MIC<span className="text-blue-400">Banking</span>
            </h3>

            <p className="mt-4 leading-7 text-slate-400">
              A modern banking platform designed to make everyday banking
              simple, secure and convenient.
            </p>
          </div>

          <div>
            <h4 className="font-bold">
              Banking
            </h4>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <a href="#services" className="block hover:text-white">
                Accounts
              </a>

              <a href="#services" className="block hover:text-white">
                Transfers
              </a>

              <a href="#services" className="block hover:text-white">
                Payments
              </a>

              <a href="#services" className="block hover:text-white">
                Loans
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold">
              Digital
            </h4>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <a href="#digital" className="block hover:text-white">
                Digital Banking
              </a>

              <a href="#security" className="block hover:text-white">
                Security
              </a>

              <a href="#home" className="block hover:text-white">
                Open Account
              </a>

              <Link href="/login" className="block hover:text-white">
                Login
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold">
              Contact
            </h4>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>0794722630</p>
              <p className="break-all">
                mictommyBankInfo@gmail.com
              </p>
              <p>Dar es Salaam, Tanzania</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-7 text-center text-sm text-slate-500">
          © 2026 MIC Banking. All rights reserved.
        </div>
      </footer>
    </main>
  );
}