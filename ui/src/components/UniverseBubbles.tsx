import { useMemo } from 'preact/hooks'

type Star = {
    left: string
    top: string
    size: number
    opacity: number
    blur: number
    color: string
    duration: number
    delay: number
}

function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min
}

export function UniverseBubbles() {
    const stars = useMemo<Star[]>(() => {
        const colors = [
            '#ffffff',
            '#f8fafc',
            '#c7d2fe',
            '#bfdbfe',
            '#fef3c7',
            '#fda4af',
            '#99f6e4',
            '#facc15',
        ]

        return Array.from({ length: 260 }).map(() => {
            const big = Math.random() > 0.88
            const bright = Math.random() > 0.78

            return {
                left: `${randomBetween(0, 100)}%`,
                top: `${randomBetween(0, 100)}%`,
                size: big ? randomBetween(2.4, 5.2) : randomBetween(0.7, 2.1),
                opacity: bright ? randomBetween(0.65, 1) : randomBetween(0.18, 0.55),
                blur: big ? randomBetween(0.5, 1.8) : randomBetween(0, 0.6),
                color: colors[Math.floor(Math.random() * colors.length)],
                duration: randomBetween(4, 11),
                delay: randomBetween(0, 8),
            }
        })
    }, [])

    const galaxies = useMemo(() => {
        return [
            { left: '8%', top: '18%', width: 90, height: 38, rotate: -25, color: 'rgba(191,219,254,0.45)' },
            { left: '26%', top: '35%', width: 120, height: 46, rotate: 18, color: 'rgba(254,243,199,0.42)' },
            { left: '72%', top: '24%', width: 110, height: 42, rotate: -12, color: 'rgba(153,246,228,0.34)' },
            { left: '78%', top: '70%', width: 130, height: 50, rotate: 20, color: 'rgba(253,164,175,0.32)' },
            { left: '45%', top: '78%', width: 95, height: 34, rotate: -18, color: 'rgba(191,219,254,0.35)' },
            { left: '56%', top: '48%', width: 140, height: 52, rotate: 12, color: 'rgba(254,243,199,0.28)' },
        ]
    }, [])

    return (
        <>
            <div className="deep-space-bg" aria-hidden="true">
                <div className="space-nebula" />

                {galaxies.map((g, index) => (
                    <span
                        key={`galaxy-${index}`}
                        className="space-galaxy"
                        style={{
                            left: g.left,
                            top: g.top,
                            width: `${g.width}px`,
                            height: `${g.height}px`,
                            transform: `rotate(${g.rotate}deg)`,
                            background: `radial-gradient(ellipse at center, ${g.color}, rgba(255,255,255,0.12) 22%, transparent 70%)`,
                        }}
                    />
                ))}

                {stars.map((star, index) => (
                    <span
                        key={index}
                        className="space-star"
                        style={{
                            left: star.left,
                            top: star.top,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            filter: `blur(${star.blur}px)`,
                            background: star.color,
                            boxShadow: `0 0 ${star.size * 5}px ${star.color}`,
                            animationDuration: `${star.duration}s`,
                            animationDelay: `${star.delay}s`,
                        }}
                    />
                ))}

                <span className="shooting-star shooting-star-1" />
                <span className="shooting-star shooting-star-2" />
            </div>
        </>
    )
}