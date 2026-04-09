import { useNavigate } from 'react-router-dom'
import { useLayoutEffect } from 'react'
import { RakshikaStoryCarousel } from '../components/storytelling'

/**
 * Standalone screen for the Rakshika storytelling carousel (onboarding / education).
 */
export default function Awareness() {
  const navigate = useNavigate()

  useLayoutEffect(() => {
    document.body.classList.add('dark')
    document.documentElement.style.backgroundColor = '#0a0008'
    return () => {
      document.body.classList.remove('dark')
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  return (
    <RakshikaStoryCarousel
      onComplete={() => navigate('/', { replace: true })}
      onLearnMore={() => navigate('/', { replace: true })}
      showBrand
    />
  )
}
