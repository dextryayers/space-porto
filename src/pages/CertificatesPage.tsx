import { useState, useEffect, useCallback } from "react"
import { certificates } from "@/data/certificates"
import { useLang } from "@/contexts/LanguageContext"
import InteractiveSelector from "@/components/ui/interactive-selector"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function CertificatesPage() {
  const { t, tData } = useLang()
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const certItems = (tData("certificates.items") as {
    title: string; issuer: string; description: string; skills: string[];
  }[]) || []

  const closePreview = useCallback(() => setPreviewIndex(null), [])

  useEffect(() => {
    if (previewIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview()
      if (e.key === "ArrowRight") setPreviewIndex((i) => i !== null ? Math.min(i + 1, certificates.length - 1) : null)
      if (e.key === "ArrowLeft") setPreviewIndex((i) => i !== null ? Math.max(i - 1, 0) : null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [previewIndex, closePreview])

  return (
    <div className="pt-20 md:pt-24 bg-background relative min-h-screen lg:pr-20">
      <span className="section-number hidden md:block">04</span>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="section-marker">// {t("certificates.heading")}</span>
            <span className="w-12 h-px bg-gold/30" />
            <span className="font-mono text-[10px] text-foreground/15">04</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
            {t("certificates.title")}
          </h1>
          <p className="text-foreground/40 text-sm mt-4 max-w-xl leading-relaxed">
            {t("certificates.description")}
          </p>
        </div>

        <InteractiveSelector
          items={certItems}
          years={certificates.map((c) => c.year)}
          credentials={certificates.map((c) => c.credential)}
          images={certificates.map((c) => c.image)}
          onPreview={setPreviewIndex}
        />
      </div>

      <AnimatePresence>
        {previewIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreview}
            role="dialog" aria-modal="true" aria-label={previewIndex !== null ? (certItems[previewIndex]?.title || "Certificate preview") : "Certificate preview"}
          >
            <motion.div
              className="relative w-full md:max-w-2xl bg-card border border-border/[0.06] rounded-sm overflow-hidden max-h-[95vh] md:max-h-[90vh] flex flex-col"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closePreview}
                className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors rounded-full"
                aria-label="Close preview"
              >
                <X size={16} className="text-white" />
              </button>

              <div className="relative overflow-hidden shrink-0">
                <img
                  src={certificates[previewIndex].image}
                  alt={certItems[previewIndex]?.title || "Certificate"}
                  className="w-full aspect-[4/3] object-cover bg-card"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-16">
                  <h3 className="text-white text-lg md:text-xl font-bold leading-tight drop-shadow-lg">
                    {certItems[previewIndex]?.title}
                  </h3>
                  <p className="text-white/70 text-xs md:text-sm drop-shadow">
                    {certItems[previewIndex]?.issuer} · {certificates[previewIndex].year}
                  </p>
                </div>
              </div>

              <div className="p-5 md:p-6 overflow-y-auto">
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                  {certItems[previewIndex]?.skills.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[8px] md:text-[9px] tracking-wider text-gold/50 border border-gold/20 px-2 md:px-2.5 py-0.5 md:py-1"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <p className="text-xs md:text-sm text-foreground/50 leading-relaxed mb-4">
                  {certItems[previewIndex]?.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/[0.06]">
                  <button
                    onClick={() => setPreviewIndex(Math.max(previewIndex - 1, 0))}
                    disabled={previewIndex === 0}
                    className="font-mono text-[9px] md:text-[10px] tracking-wider text-foreground/20 hover:text-gold/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors uppercase px-2 py-1.5"
                    aria-label="Previous certificate"
                  >
                    ← Prev
                  </button>
                  <span className="font-mono text-[9px] md:text-[10px] text-foreground/20">
                    {previewIndex + 1} / {certificates.length}
                  </span>
                  <button
                    onClick={() => setPreviewIndex(Math.min(previewIndex + 1, certificates.length - 1))}
                    disabled={previewIndex === certificates.length - 1}
                    className="font-mono text-[9px] md:text-[10px] tracking-wider text-foreground/20 hover:text-gold/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors uppercase px-2 py-1.5"
                    aria-label="Next certificate"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
