import { useLang } from "@/contexts/LanguageContext"
import TeamShowcase from "@/components/ui/team-showcase"

export function GalleryPage() {
  const { t } = useLang()

  return (
    <div className="pt-20 md:pt-24 bg-background relative min-h-screen lg:pr-20">
      <span className="section-number hidden md:block">02</span>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="flex items-center gap-4 mb-4">
          <span className="section-marker">// {t("gallery.heading")}</span>
          <span className="w-12 h-px bg-gold/30" />
          <span className="font-mono text-[10px] text-foreground/15">02</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-4">
          {t("gallery.title")}
        </h1>
        <p className="text-foreground/40 text-sm max-w-xl leading-relaxed mb-8">
          {t("gallery.description")}
        </p>

        <TeamShowcase />
      </div>
    </div>
  )
}
