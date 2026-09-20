import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/Themetoggle";
import {
  ArrowRight,
  BadgeCheck,
  Menu,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  type LucideIcon,
} from "lucide-react";

const navItems = [
  { label: "Platform", href: "#platform" },
  { label: "Benefits", href: "#benefits" },
  { label: "Workflow", href: "#workflow" },
  { label: "Questions", href: "#questions" },
];

const brandStrip = ["NagarNet", "WardFlow", "CivicOps", "ResolveHQ", "TrustGrid"];

const workflowCards = [
  {
    title: "Track complaints faster",
    body: "From potholes to water outages, complaints land in the right queue with urgency signals attached.",
    stat: "82,000",
    accent: "bg-primary  text-white",
  },
  {
    title: "Send updates across wards",
    body: "Broadcast citizen-safe progress updates while departments coordinate internally in real time.",
    stat: "34,000",
    accent: "bg-card dark:bg-slate-700 text-foreground dark:text-slate-100",
  },
];

const featurePillars: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Transparency",
    body: "Every complaint gets a visible timeline, clear ownership, and fewer dead ends.",
    icon: MessageSquareText,
  },
  {
    title: "Outcome pressure",
    body: "Departments can prioritize what matters most instead of getting buried in manual triage.",
    icon: ShieldCheck,
  },
  {
    title: "Public trust metrics",
    body: "Admins can measure backlog health, SLA compliance, and recurring civic failures.",
    icon: BadgeCheck,
  },
];

const stats = [
  { value: "$14B", label: "Annual municipal budgets supported" },
  { value: "23k+", label: "Complaint journeys modeled across departments" },
  { value: "91%", label: "Average routing confidence on first pass" },
];

const faqs = [
  {
    question: "How does the platform decide which department receives a complaint?",
    answer:
      "The intake flow tags category, location, urgency, and prior complaint patterns to assign the most likely department before a reviewer ever touches it.",
  },
  {
    question: "What do residents see after they submit an issue?",
    answer:
      "They receive a live status trail with timestamps, assigned teams, and follow-up requests so they know whether action is actually moving.",
  },
  {
    question: "Can departments collaborate without exposing internal notes publicly?",
    answer:
      "Yes. Departments can keep internal coordination threads while still publishing resident-safe progress updates to the public timeline.",
  },
  {
    question: "Is this only for large city administrations?",
    answer:
      "No. The same structure works for districts, town councils, and smaller wards that need visibility without adding more process overhead.",
  },
];

const footerColumns = [
  { title: "Platform", links: ["Complaint intake", "Department routing", "Analytics", "Citizen feedback"] },
  { title: "Roles", links: ["Citizens", "Departments", "Admins", "Operators"] },
  { title: "Company", links: ["About", "Roadmap", "Security", "Support"] },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const Landing: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_22%)] bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="rounded-[999px] border border-border/60 bg-background/85 px-5 shadow-[0_6px_16px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <div className="flex min-h-[86px] items-center justify-between gap-4">
              <Link to="/" className="flex shrink-0 items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  G
                </span>
                <div>
                  <p className="text-[0.95rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground">GovAI</p>
                  <p className="font-heading text-[2rem] font-bold leading-none text-foreground sm:text-[2.15rem]">Resolve</p>
                </div>
              </Link>

              <nav className="hidden flex-1 items-center justify-center gap-12 lg:flex">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-[1.05rem] font-medium text-muted-foreground dark:text-slate-400 transition-colors duration-200 hover:text-foreground dark:hover:text-slate-100"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="hidden shrink-0 items-center gap-3 lg:flex">
                <ThemeToggle className="h-12 w-12 rounded-full border border-border dark:border-slate-700 bg-white/95 dark:bg-slate-800 text-foreground dark:text-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:bg-card dark:hover:bg-slate-700" />
                <Button
                  asChild
                  variant="ghost"
                  className="h-12 rounded-full border border-border dark:border-slate-700 bg-white/95 dark:bg-slate-800 px-7 text-base font-medium text-foreground dark:text-slate-100 hover:bg-card dark:hover:bg-slate-700 hover:text-foreground dark:hover:text-slate-100"
                >
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 rounded-full bg-primary px-8 text-base font-medium text-white hover:bg-primary/90"
                >
                  <Link to="/signup">
                    Start free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-foreground dark:text-slate-100 lg:hidden"
                aria-label="Toggle navigation"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            {menuOpen && (
              <div className="border-t border-border dark:border-slate-700 py-4 lg:hidden">
                <div className="flex flex-col gap-3">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-2xl px-3 py-2 text-sm font-medium text-muted-foreground dark:text-slate-400 transition-colors hover:bg-card dark:hover:bg-slate-800 hover:text-foreground dark:hover:text-slate-100"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="mt-2 flex items-center gap-3">
                    <ThemeToggle className="rounded-full border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-foreground dark:text-slate-100 hover:bg-card dark:hover:bg-slate-700" />
                    <Button
                      asChild
                      variant="ghost"
                      className="flex-1 rounded-full border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-foreground dark:text-slate-100 hover:bg-card dark:hover:bg-slate-700 hover:text-foreground dark:hover:text-slate-100"
                    >
                      <Link to="/login">Sign in</Link>
                    </Button>
                    <Button asChild className="flex-1 rounded-full bg-primary text-white hover:bg-primary/90">
                      <Link to="/signup">Start free</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <main className="pb-14 pt-[112px] sm:pb-20 sm:pt-[118px]">
          <section className="grid gap-10 py-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start lg:gap-12 lg:py-2">
            <motion.div initial="hidden" animate="show" variants={fadeUp} className="w-full pt-2">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border dark:border-slate-700 bg-card dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground dark:text-slate-400">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                Smarter civic operations
              </div>
              <p className="mb-5 text-sm font-medium text-muted-foreground dark:text-slate-400">Public service platform for complaint resolution</p>
              <h1 className="max-w-[12ch] text-5xl font-bold leading-[0.94] tracking-[-0.05em] text-foreground dark:text-slate-100 sm:text-6xl lg:text-7xl">
                you report your city
              </h1>
              <p className="mt-6 max-w-[620px] text-base leading-7 text-muted-foreground dark:text-slate-400 sm:text-lg">
                GovAI Resolve gives residents a cleaner way to raise issues and gives departments a faster way to act,
                route, and close the loop with confidence.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-full bg-primary px-6 text-white hover:bg-primary/90"
                >
                  <Link to="/signup">
                    Launch platform
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="h-12 rounded-full border border-border dark:border-slate-700 bg-card dark:bg-slate-800 px-6 text-foreground dark:text-slate-100 hover:bg-card dark:hover:bg-slate-700 hover:text-foreground dark:hover:text-slate-100"
                >
                    <Link to="/login">View department portal</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-foreground dark:text-emerald-400" />
                  Citizen-first status tracking
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-foreground dark:text-emerald-400" />
                  Department-aware assignment
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
              className="grid w-full gap-4 self-start sm:grid-cols-2"
            >
              <div className="overflow-hidden rounded-[28px] border border-black/5 bg-card p-5 shadow-[0_6px_18px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_6px_16px_rgba(0,0,0,0.08)] sm:col-span-2">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Complaint overview</p>
                    <h2 className="mt-3 max-w-[12ch] text-2xl font-semibold leading-tight text-foreground dark:text-slate-100">
                      Real-time case flow across departments
                    </h2>
                  </div>
                  <div className="rounded-full bg-white/80 dark:bg-slate-700 px-3 py-1 text-xs font-semibold text-foreground dark:text-slate-100">Live queue</div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-[24px] bg-primary p-5 text-white">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/70">
                      <span>Active complaints</span>
                      <span>Ward map</span>
                    </div>
                    <div className="mt-8 flex h-28 items-end gap-3">
                      {[38, 76, 58, 92, 124].map((height) => (
                        <div key={height} className="flex-1 rounded-t-2xl bg-blue-400/60" style={{ height }} />
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between text-sm text-white/75">
                      <span>Backlog reduced</span>
                      <span className="text-xl font-semibold text-white">18%</span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_6px_18px_rgba(15,23,42,0.06)] dark:border-slate-600 dark:bg-slate-700 dark:shadow-none">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Residents reached</p>
                          <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-foreground dark:text-slate-100">196,000</p>
                        </div>
                        <div className="rounded-full bg-card dark:bg-slate-600 px-3 py-1 text-xs font-semibold text-foreground dark:text-slate-100">This month</div>
                      </div>
                      <p className="mt-10 text-sm leading-6 text-slate-600 opacity-100 dark:text-slate-400">People currently covered by faster response loops, clearer updates, and fewer assignment delays.</p>
                    </div>

                    <div className="rounded-[24px] bg-primary  p-5 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-white/70">Department score</p>
                          <p className="mt-2 text-3xl font-semibold">94.2%</p>
                        </div>
                        <Sparkles className="h-8 w-8 text-blue-200" />
                      </div>
                      <div className="mt-6 grid grid-cols-5 gap-2">
                        {[58, 65, 72, 84, 96].map((value) => (
                          <div key={value} className="h-20 rounded-full bg-white/10 p-2">
                            <div className="h-full rounded-full bg-blue-300/80" style={{ marginTop: `${100 - value}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </section>

          <section className="border-y border-border dark:border-slate-700 py-5">
            <div className="grid grid-cols-2 gap-5 text-sm font-medium text-muted-foreground dark:text-slate-400 sm:grid-cols-3 lg:grid-cols-5">
              {brandStrip.map((brand) => (
                <div key={brand} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  {brand}
                </div>
              ))}
            </div>
          </section>

          <section id="platform" className="py-16 sm:py-20">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              className="mx-auto max-w-[620px] text-center"
            >
              <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">One portal for all your civic things</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-foreground dark:text-slate-100 sm:text-5xl">
                One app for all your city things
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground dark:text-slate-400">
                Residents submit once, departments coordinate faster, and admins finally get a clear picture of where
                civic issues are compounding.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
              {workflowCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className={`overflow-hidden rounded-[30px] border border-black/5 p-6 shadow-[0_6px_18px_rgba(15,23,42,0.08)] dark:border-slate-600 dark:shadow-[0_2px_6px_rgba(0,0,0,0.04)] ${card.accent}`}
                >
                  <div className="flex min-h-[280px] flex-col justify-between">
                    <div>
                      <h3 className="max-w-[13ch] text-3xl font-semibold leading-tight">{card.title}</h3>
                      <p className="mt-4 max-w-[42ch] text-sm leading-6 text-current opacity-100 dark:opacity-75">{card.body}</p>
                    </div>

                    <div className="mt-8">
                      <div className="flex items-end gap-3">
                        {[22, 44, 34, 58, 76].map((height) => (
                          <div
                            key={height}
                            className={`flex-1 rounded-t-[18px] ${index === 0 ? "bg-white/20" : "bg-primary/20"}`}
                            style={{ height: `${height * 1.7}px` }}
                          />
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="uppercase tracking-[0.2em] text-current/60">Resolved faster</span>
                        <span className="text-2xl font-semibold">{card.stat}</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          <section id="benefits" className="py-6 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">Make your civic budget well-spent</p>
                <h2 className="mt-4 max-w-[12ch] text-4xl font-bold tracking-[-0.05em] text-foreground dark:text-slate-100 sm:text-5xl">
                  Make your city well-spent
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {featurePillars.map((pillar, index) => (
                  <motion.article
                    key={pillar.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className={`rounded-[28px] border p-6 shadow-[0_6px_18px_rgba(15,23,42,0.06)] dark:shadow-none ${
                      index === 2
                        ? "border-border dark:border-slate-600 bg-card dark:bg-slate-700"
                        : "border-border dark:border-slate-600 bg-card dark:bg-slate-800"
                    }`}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-700 text-foreground dark:text-slate-100 shadow-sm">
                        <pillar.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-foreground dark:text-slate-100">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 opacity-100 dark:text-slate-400">{pillar.body}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          <section id="workflow" className="py-16 sm:py-20">
            <div className="overflow-hidden rounded-[34px] bg-primary  text-white shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
              <div className="grid gap-6 px-6 py-10 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 lg:py-12">
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/70">Outcome metrics</p>
                    <h2 className="mt-5 max-w-[13ch] text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
                      Measure and build the right solutions
                    </h2>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  {stats.map((item) => (
                    <div key={item.label} className="border-t border-white/15 pt-4 sm:border-t-0 sm:pt-0">
                      <p className="text-4xl font-semibold tracking-[-0.05em]">{item.value}</p>
                      <p className="mt-3 max-w-[20ch] text-sm leading-6 text-white/70">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="questions" className="py-6 sm:py-10">
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-slate-400">Support and adoption</p>
                <h2 className="mt-4 max-w-[10ch] text-4xl font-bold tracking-[-0.05em] text-foreground dark:text-slate-100 sm:text-5xl">
                  Frequently asked questions
                </h2>
              </div>

              <div className="rounded-[30px] border border-border bg-card px-6 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((item) => (
                    <AccordionItem key={item.question} value={item.question} className="border-border dark:border-slate-700">
                      <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground dark:text-slate-100 hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="max-w-[70ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          <section className="py-16 sm:py-20">
            <div className="relative overflow-hidden rounded-[34px] bg-primary  px-6 py-8 text-white shadow-[0_6px_16px_rgba(0,0,0,0.08)] sm:px-10 sm:py-10">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 right-20 h-28 w-28 rounded-full border border-white/20" />
              <div className="absolute right-8 top-8 hidden h-20 w-20 rounded-full bg-blue-300/70 lg:block" />

              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/70">Next step</p>
                  <h2 className="mt-4 max-w-[13ch] text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
                    Change the way you use your city systems
                  </h2>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="h-12 rounded-full bg-white dark:bg-slate-200 px-6 text-foreground dark:text-slate-950 hover:bg-card dark:hover:bg-slate-100"
                  >
                    <Link to="/signup">Get started</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-12 rounded-full border border-white/25 dark:border-slate-400/25 bg-white/10 dark:bg-slate-800/30 px-6 text-white hover:bg-white/15 dark:hover:bg-slate-800/50 hover:text-white"
                  >
                    <Link to="/login">Book a walkthrough</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-border dark:border-slate-700 py-10 text-muted-foreground dark:text-slate-400">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-base font-semibold text-white">
                  G
                </span>
                <div>
                  <p className="font-heading text-[2.3rem] font-bold leading-none text-foreground dark:text-slate-100">GovAI</p>
                  <p className="mt-1 text-sm text-muted-foreground dark:text-slate-400">Resolve for civic service delivery</p>
                </div>
              </div>
              <p className="mt-4 max-w-[48ch] text-sm leading-6">
                A landing page rebuild inspired by the uploaded layout, translated into a responsive civic-tech experience
                that fits this project’s complaint-resolution product.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground dark:text-slate-100">{column.title}</h3>
                  <ul className="mt-4 space-y-3 text-sm">
                    {column.links.map((link) => (
                      <li key={link}>{link}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border dark:border-slate-700 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 GovAI Resolve. Built for transparent public-service operations.</p>
            <div className="flex items-center gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Security</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
