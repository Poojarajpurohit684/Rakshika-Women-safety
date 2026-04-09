import { BookOpen, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { WOMENS_SAFETY_STATS_INDIA, WOMENS_SAFETY_ARTICLES } from '../data/womensSafetyIndia.js'

export function WomenSafetySection({ isDark }) {
  const cardBg = isDark ? 'rgba(26,10,46,0.75)' : '#ffffff'
  const cardBorder = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(233,30,140,0.14)'
  const muted = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(26,10,46,0.55)'
  const titleColor = isDark ? 'rgba(255,255,255,0.95)' : '#1a0a2e'

  return (
    <section aria-labelledby="women-safety-heading">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(233,30,140,0.14)' }}
          >
            <BookOpen className="w-4 h-4" style={{ color: '#e91e8c' }} />
          </div>
          <div className="min-w-0">
            <h2 id="women-safety-heading" className="text-sm font-black text-primary-content leading-tight">
              Awareness in India
            </h2>
            <p className="text-[10px] mt-0.5 text-muted-content leading-snug">
              Data, laws & safety — from public sources. Not a substitute for professional or legal advice.
            </p>
          </div>
        </div>
      </div>

      {/* Stat strip — compact horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory">
        {WOMENS_SAFETY_STATS_INDIA.map((s) => (
          <a
            key={s.id}
            href={s.href}
            target={s.href.startsWith('tel:') ? undefined : '_blank'}
            rel={s.href.startsWith('tel:') ? undefined : 'noopener noreferrer'}
            className="snap-start shrink-0 min-w-[140px] rounded-2xl border p-3 transition-transform active:scale-[0.98]"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(233,30,140,0.06)',
              borderColor: cardBorder,
            }}
          >
            <div
              className="text-lg font-black tabular-nums leading-none"
              style={{
                background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {s.headline}
            </div>
            <p className="text-[11px] font-bold mt-1.5 text-primary-content leading-tight">{s.label}</p>
            <p className="text-[9px] mt-1 leading-snug" style={{ color: muted }}>
              {s.note}
            </p>
          </a>
        ))}
      </div>

      {/* Article cards — horizontal carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
        {WOMENS_SAFETY_ARTICLES.map((article, i) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
            className="snap-start shrink-0 w-[min(88vw,320px)] rounded-2xl border overflow-hidden flex flex-col"
            style={{
              background: cardBg,
              borderColor: cardBorder,
              boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.35)' : '0 12px 32px rgba(233,30,140,0.08)',
            }}
          >
            <div className="relative h-[140px] w-full overflow-hidden bg-[#1a1025]">
              <img
                src={article.imageUrl}
                alt={article.imageAlt}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <span
                className="absolute bottom-2.5 left-2.5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                style={{
                  background: 'rgba(233,30,140,0.92)',
                  color: '#fff',
                }}
              >
                {article.category}
              </span>
            </div>
            <div className="p-4 flex flex-col flex-1 gap-2">
              <h3 className="text-sm font-black leading-snug" style={{ color: titleColor }}>
                {article.title}
              </h3>
              <p className="text-[12px] leading-relaxed flex-1" style={{ color: muted }}>
                {article.excerpt}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: muted }}>
                Source: {article.source}
              </p>
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-black mt-1"
                style={{ color: '#e91e8c' }}
              >
                Read more
                <ExternalLink className="w-3 h-3" aria-hidden />
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
