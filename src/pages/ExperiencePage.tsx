import { useEffect, useRef, useState } from "react"
import { experiences } from "@/data/portfolio"
import { GraduationCap, Building2, Shield, Brain, Network } from "lucide-react"
import { useLang } from "@/contexts/LanguageContext"

const roleIcons = [Building2, Shield, Brain, Network]

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

export function ExperiencePage() {
  const { t, tData } = useLang()
  const expItems = (tData("experience.items") as {
    role: string; company: string; period: string;
    description: string; deliverables: string[];
  }[]) || []
  const certList = (tData("experience.certList") as {
    title: string; issuer: string; year: string;
  }[]) || []

  return (
    <div className="pt-20 md:pt-24 bg-background relative min-h-screen lg:pr-20">
      <span className="section-number hidden md:block">03</span>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="section-marker">// {t("experience.heading")}</span>
            <span className="w-12 h-px bg-gold/30" />
            <span className="font-mono text-[10px] text-foreground/15">03</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
            {t("experience.title")}
          </h1>
        </div>

        {/* Timeline */}
        <section aria-label="Experience timeline">
          {/* Vertical line (desktop) */}
          <div className="hidden md:block absolute left-[72px] top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-foreground/[0.06] to-transparent" />

          <div className="space-y-0">
            {experiences.map((exp, i) => {
              const item = expItems[exp.transIdx] || { role: "", company: "", period: "", description: "", deliverables: [] }
              const { ref, revealed } = useReveal(0.1)
              const Icon = roleIcons[i] || Building2
              const isLast = i === experiences.length - 1

              return (
                <div
                  key={exp.floor}
                  ref={ref}
                  className="relative group pb-0"
                >
                  <div
                    className="relative flex gap-6 md:gap-10"
                    style={{
                      transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 150}ms`,
                      opacity: revealed ? 1 : 0,
                      transform: revealed ? "translateY(0)" : "translateY(40px)",
                    }}
                  >
                    {/* Left: floor number + dot */}
                    <div className="hidden md:flex flex-col items-center w-[72px] shrink-0 pt-8">
                      <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-gold/30 bg-background group-hover:border-gold group-hover:bg-gold/10 transition-all duration-500 z-10">
                        <Icon size={18} className="text-gold/60 group-hover:text-gold transition-colors duration-500" />
                      </div>
                      {!isLast && (
                        <div className="w-px flex-1 bg-gradient-to-b from-gold/20 to-transparent min-h-[40px]" />
                      )}
                    </div>

                    {/* Right: card */}
                    <div className="flex-1 min-w-0 pb-12 md:pb-16">
                      {/* Mobile indicator */}
                      <div className="md:hidden flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-background">
                          <Icon size={14} className="text-gold/60" />
                        </div>
                        <span className="font-mono text-[10px] text-gold/40">Floor {exp.floor}</span>
                      </div>

                      <div className="relative bg-card border border-border/[0.04] group-hover:border-gold/20 transition-all duration-500">
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold/60 via-gold/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                        <div className="p-6 md:p-8">
                          {/* Meta row */}
                          <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span className="font-mono text-[9px] tracking-[0.15em] text-gold/60 uppercase bg-gold/5 px-3 py-1.5">
                              {item.period}
                            </span>
                            <span className="w-px h-3 bg-foreground/[0.08]" />
                            <span className="text-[10px] text-foreground/30 uppercase tracking-wider flex items-center gap-1.5">
                              <Building2 size={10} className="text-foreground/20" />
                              {item.company}
                            </span>
                          </div>

                          {/* Role */}
                          <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-gold transition-colors duration-500 mb-3">
                            {item.role}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-foreground/40 leading-relaxed max-w-3xl mb-5">
                            {item.description}
                          </p>

                          {/* Deliverables */}
                          <div className="flex flex-wrap gap-2">
                            {item.deliverables.map((d) => (
                              <span
                                key={d}
                                className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-foreground/30 border border-border/[0.08] px-3 py-1.5 group-hover:border-gold/20 group-hover:text-gold/50 transition-all duration-500"
                              >
                                <span className="w-1 h-1 bg-gold/50 rounded-full" />
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Foundation */}
          <div className="hidden md:flex items-center gap-4 pl-[72px] pt-4 pb-8">
            <div className="w-3 h-3 border border-foreground/20 rotate-45" />
            <span className="font-mono text-[10px] text-foreground/20 tracking-widest uppercase">
              {t("experience.foundation")} — 2021
            </span>
          </div>
        </section>

        {/* Certifications */}
        <section aria-label="Certifications">
          <div className="flex items-center gap-3 mb-10">
            <GraduationCap size={16} className="text-gold/60" />
            <span className="section-marker">// {t("experience.certifications")}</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {certList.map((cert) => (
              <div
                key={cert.title}
                className="relative p-5 border border-border/[0.04] hover:border-gold/20 hover:bg-foreground/[0.02] transition-all duration-500 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold/[0.03] to-transparent" />
                <span className="font-mono text-[9px] text-gold/40">{cert.year}</span>
                <h4 className="text-foreground text-sm font-medium mt-2 mb-1 group-hover:text-gold transition-colors duration-300">
                  {cert.title}
                </h4>
                <p className="text-[11px] text-foreground/30">{cert.issuer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
