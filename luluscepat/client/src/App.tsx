import { useEffect } from 'react'
import { initMotion } from './lib/motion'
import { useLenis } from './hooks/useLenis'
import { Navbar } from './components/landing/Navbar'
import { Hero } from './components/landing/Hero'
import { Why } from './components/landing/Why'
import { Features } from './components/landing/Features'
import { Workspace } from './components/landing/Workspace'
import { HowItWorks } from './components/landing/HowItWorks'
import { FinalCta, Footer } from './components/landing/FinalCta'

export default function App() {
  useLenis()

  useEffect(() => {
    initMotion()
  }, [])

  return (
    <div className="min-h-screen bg-bg font-sans text-text antialiased">
      <Navbar />
      <main>
        <Hero />
        <Why />
        <Features />
        <Workspace />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
