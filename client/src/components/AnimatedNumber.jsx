import { useEffect, useState } from 'react'

const AnimatedNumber = ({ value, duration = 800 }) => {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const diff = value - start
    const startTime = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      setDisplay(Math.round(start + diff * progress))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [value, duration])

  return <span>{display}</span>
}

export default AnimatedNumber
