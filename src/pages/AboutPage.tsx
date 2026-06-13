import { useEffect, useRef, useState } from "react"
import { personalInfo, principles, skills } from "@/data/portfolio"
import { MapPin, Mail, Calendar, Quote, Code2, Hammer, Lightbulb, Ruler, ArrowUpRight, Shield, Search, Wifi, Globe, Database, Radio } from "lucide-react"
import { useLang } from "@/contexts/LanguageContext"
import { SiReact, SiNextdotjs, SiTailwindcss, SiVuedotjs, SiAstro, SiExpress, SiNodedotjs, SiBootstrap, SiBurpsuite, SiWireshark } from "react-icons/si"

const principleIcons = [Code2, Hammer, Lightbulb, Ruler]

const toolIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "React JS": SiReact,
  "Next JS": SiNextdotjs,
  "Tailwind": SiTailwindcss,
  "Vue": SiVuedotjs,
  "Astro": SiAstro,
  "Express JS": SiExpress,
  "Node JS": SiNodedotjs,
  "Bootstrap": SiBootstrap,
  "Burp Suite": SiBurpsuite,
  "Nmap": Search,
  "Nikto": Shield,
  "Wireshark": SiWireshark,
  "SQLMap": Database,
  "SpiderFoot": Globe,
  "Kismet": Radio,
  "Aircrack-ng": Wifi,
}

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, revealed }
}

function AnimatedNumber({ value, suffix = "", revealed }: { value: number; suffix?: string; revealed: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!revealed) return
    const start = performance.now()
    const dur = 2000
    const raf = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * value))
      if (p < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [revealed, value])
  return <>{count}{suffix}</>
}

function StatBox({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { ref, revealed } = useReveal()
  return (
    <div
      ref={ref}
      className="text-center p-6 bg-foreground/[0.02] border border-foreground/[0.04] group hover:border-gold/20 hover:bg-gold/[0.02] transition-all duration-500"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`font-mono text-3xl md:text-4xl font-light text-gold/80 transition-all duration-1000 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <AnimatedNumber value={value} suffix={suffix} revealed={revealed} />
      </div>
      <div className={`text-[10px] text-foreground/30 mt-2 tracking-[0.15em] uppercase transition-all duration-700 delay-200 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </div>
    </div>
  )
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -y * 6, y: x * 6 })
  }
  const onLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
    >
      {children}
    </div>
  )
}

export function AboutPage() {
  const { ref: manifestoRef, revealed: manifestoRevealed } = useReveal()
  const { t, tData } = useLang()
  const pList = (tData("about.principlesList") as { title: string; desc: string }[]) || []
  const skillCats = (tData("about.skillCategories") as { name: string; tools: { name: string; note: string }[] }[]) || []
  const statLabels = tData("stats") as string[] || []
  const statsData = [
    { value: 6, suffix: "+" },
    { value: 48, suffix: "" },
    { value: 24, suffix: "" },
    { value: 100, suffix: "%" },
  ]

  return (
    <div className="pt-20 md:pt-24 bg-background relative min-h-screen lg:pr-20">
      <span className="section-number hidden md:block">01</span>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        {/* ========== HEADER ========== */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="section-marker">// {t("about.heading")}</span>
            <span className="w-12 h-px bg-gold/30" />
            <span className="font-mono text-[10px] text-foreground/15">01</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
            {t("about.title")}
          </h1>
        </div>

        {/* ========== INTRO SECTION ========== */}
        <section aria-label="Introduction" className="grid md:grid-cols-5 gap-10 md:gap-16 mb-20">
          <div className="md:col-span-3 space-y-6">
            <div className="relative">
              <p className="text-base sm:text-lg text-foreground/60 leading-relaxed">
                {t("about.longDescription")}
              </p>
              <div className="absolute -left-4 top-0 w-[2px] h-16 bg-gradient-to-b from-gold/40 to-transparent hidden md:block" />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { icon: MapPin, label: personalInfo.location },
                { icon: Mail, label: personalInfo.email },
                { icon: Calendar, label: t("about.established") },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-[11px] text-foreground/40 bg-foreground/[0.03] px-4 py-2 border border-foreground/[0.04] hover:border-gold/20 hover:text-gold/60 transition-all duration-300 group"
                >
                  <Icon size={12} className="text-gold/40 group-hover:text-gold transition-colors duration-300" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Manifesto */}
          <div className="md:col-span-2">
            <div
              ref={manifestoRef}
              className={`relative h-full border border-border/[0.06] bg-foreground/[0.02] p-6 md:p-8 transition-all duration-1000 ${manifestoRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              {/* Corner marks */}
              <span className="absolute top-3 left-3 w-5 h-5 border-t border-l border-gold/30" />
              <span className="absolute top-3 right-3 w-5 h-5 border-t border-r border-gold/30" />
              <span className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-gold/30" />
              <span className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-gold/30" />

              {/* Quote icon */}
              <Quote size={16} className="text-gold/30 mb-4" />

              <p className="text-xs text-foreground/30 font-mono tracking-wider mb-3">{t("about.manifesto")}</p>

              <p className="text-foreground/70 text-sm leading-relaxed italic relative z-10">
                {t("about.manifestoText")}
              </p>

              {/* Signature line */}
              <div className="mt-6 pt-4 border-t border-foreground/[0.04]">
                <p className="font-mono text-[9px] text-gold/40 tracking-widest uppercase">
                  {personalInfo.name}
                </p>
                <p className="font-mono text-[8px] text-foreground/20 tracking-wider mt-0.5">
                  {t("hero.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== STATS ========== */}
        <section aria-label="Statistics" className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/[0.04]">
            {statsData.map((stat, i) => (
              <StatBox key={i} {...stat} label={statLabels[i] || ""} delay={i * 120} />
            ))}
          </div>
        </section>

        {/* ========== PRINCIPLES ========== */}
        <section aria-label="Principles" className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <span className="section-marker">// {t("about.principles")}</span>
            <span className="w-8 h-px bg-foreground/10" />
            <span className="font-mono text-[8px] text-foreground/15">{principles.length} Foundations</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {principles.map((p, i) => {
              const item = pList[i] || { title: "", desc: "" }
              const { ref, revealed } = useReveal(0.1)
              const Icon = principleIcons[i]

              return (
                <div
                  key={p.marker}
                  ref={ref}
                  className={`transition-all duration-800 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <TiltCard className="group relative h-full border border-foreground/[0.04] bg-background hover:border-gold/20 hover:bg-foreground/[0.02] transition-all duration-500 overflow-hidden">
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold/60 via-gold/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                    {/* Background number */}
                    <div className="absolute -right-4 -top-4 text-[80px] font-bold text-foreground/[0.02] select-none pointer-events-none leading-none font-mono">
                      {p.marker}
                    </div>

                    <div className="p-6 md:p-8 relative z-10">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 flex items-center justify-center bg-gold/5 border border-gold/10 group-hover:bg-gold/10 group-hover:border-gold/30 transition-all duration-500">
                          <Icon size={18} className="text-gold/50 group-hover:text-gold transition-colors duration-500" />
                        </div>
                        <span className="font-mono text-[10px] text-gold/30">{p.marker}</span>
                      </div>

                      <h3 className="text-foreground font-semibold text-lg mb-3 group-hover:text-gold/90 transition-colors duration-500">
                        {item.title}
                      </h3>

                      <p className="text-foreground/40 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Corner arrow on hover */}
                    <ArrowUpRight size={14} className="absolute bottom-4 right-4 text-gold/0 group-hover:text-gold/40 transition-all duration-500 -rotate-45 group-hover:rotate-0" />
                  </TiltCard>
                </div>
              )
            })}
          </div>
        </section>

        {/* ========== SKILLS ========== */}
        <section aria-label="Skills">
          <div className="flex items-center gap-4 mb-10">
            <span className="section-marker">// {t("about.skill")}</span>
            <span className="w-8 h-px bg-foreground/10" />
            <span className="font-mono text-[8px] text-foreground/15">{skillCats.length} Categories</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {skillCats.map((cat, ci) => {
              const { ref, revealed } = useReveal(0.1)
              const catTools = skills.slice(ci * 8, ci * 8 + 8)
              return (
                <div
                  key={cat.name}
                  ref={ref}
                  className={`transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${ci * 150}ms` }}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 flex items-center justify-center bg-gold/5 border border-gold/10">
                      <span className="font-mono text-[10px] text-gold/60 font-bold">0{ci + 1}</span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground/80">{cat.name}</h3>
                    <div className="flex-1 h-px bg-foreground/[0.06]" />
                    <span className="font-mono text-[8px] text-foreground/20">{cat.tools.length} Tools</span>
                  </div>

                  {/* Tools grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {catTools.map((tool, ti) => {
                      const t = cat.tools[ti] || { name: "", note: "" }
                      const Icon = toolIconMap[t.name]
                      return (
                        <div
                          key={ti}
                          className="group relative border border-foreground/[0.04] bg-foreground/[0.02] p-3 hover:border-gold/20 hover:bg-gold/[0.02] transition-all duration-300"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {Icon && (
                              <div className="w-6 h-6 flex items-center justify-center text-foreground/30 group-hover:text-gold/60 transition-colors duration-300 shrink-0">
                                <Icon size={16} />
                              </div>
                            )}
                            <span className="text-xs text-foreground/70 font-medium group-hover:text-gold/80 transition-colors duration-300 truncate">
                              {t.name}
                            </span>
                            <span className="font-mono text-[9px] text-gold/40 font-medium ml-auto">{tool.level}%</span>
                          </div>
                          <div className="h-[2px] bg-foreground/[0.06] rounded-full overflow-hidden mb-1.5">
                            <div
                              className="h-full bg-gradient-to-r from-gold/60 to-gold/30 rounded-full transition-all duration-1000"
                              style={{
                                width: revealed ? `${tool.level}%` : '0%',
                                transitionDelay: `${ci * 150 + ti * 60}ms`,
                              }}
                            />
                          </div>
                          <span className="font-mono text-[8px] text-foreground/20 tracking-wider block">
                            {t.note}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom decorative line */}
          <div className="mt-12 h-px bg-gradient-to-r from-gold/20 via-foreground/[0.04] to-transparent" />
        </section>
      </div>
    </div>
  )
}
