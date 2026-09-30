import { useMemo, useState } from "react"

export function LazyYouTubeEmbed({
  videoId,
  title,
  className = "",
}) {
  const [loaded, setLoaded] = useState(false)
  const thumbnail = useMemo(
    () => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    [videoId]
  )
  const src = useMemo(
    () =>
      `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
    [videoId]
  )

  return (
    <div className={`pimo-video-embed ${className}`.trim()}>
      {!loaded ? (
        <button
          type="button"
          className="pimo-video-poster"
          onClick={() => setLoaded(true)}
          aria-label={`Reproduzir vídeo: ${title}`}
        >
          <img src={thumbnail} alt={title} loading="lazy" />
          <span className="play">▶</span>
          <span className="label">Clique para carregar vídeo</span>
        </button>
      ) : (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
    </div>
  )
}

export function DemoLoopVideo({ title = "Demonstração do fluxo PIMO" }) {
  return (
    <figure className="pimo-demo-loop">
      <video
        controls
        loop
        muted
        playsInline
        preload="none"
        poster="/visual/readme/fluxo-principal-poster.jpg"
      >
        <source src="/visual/readme/fluxo-principal.webm" type="video/webm" />
        <source src="/visual/readme/fluxo-principal.mp4" type="video/mp4" />
      </video>
      <figcaption>{title}</figcaption>
    </figure>
  )
}

export function AnimatedHotspotImage({ src, alt, hotspots }) {
  return (
    <div className="pimo-hotspot-media">
      <img src={src} alt={alt} loading="lazy" />
      {hotspots.map((spot) => (
        <span
          key={spot.label}
          className="pimo-hotspot"
          style={{ left: `${spot.x}%`, top: `${spot.y}%`, animationDelay: `${spot.delay || 0}ms` }}
        >
          <span className="dot" />
          <span className="tip">{spot.label}</span>
        </span>
      ))}
    </div>
  )
}
