"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { SignIn } from "@/components/sign-in"

export function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Floating particles */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gray-700 rounded-full"
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}

      <div className="container mx-auto px-4 py-16 relative z-10">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold">ThumbnailTester</h1>
        </nav>

        <main className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 leading-tight">A/B Test Your YouTube Thumbnails</h2>
          <p className="text-xl mb-8 text-gray-400">Get real audience feedback before your video goes live. Optimize your thumbnails for maximum engagement.</p>
          {showLogin ? (
            <SignIn />
          ) : (
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-200 transition-colors"
              onClick={() => setShowLogin(true)}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}

          <div className="mt-24 grid gap-12">
            <section>
              <h3 className="text-2xl font-semibold mb-4">Upload Thumbnails</h3>
              <p className="text-gray-400">Easily upload multiple thumbnail options for your upcoming videos. Our intuitive interface makes it simple to compare different designs side by side.</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4">Create Polls</h3>
              <p className="text-gray-400">Generate shareable polls to gather feedback from your audience. Reach out to your community or test with a random sample to get diverse opinions.</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4">Analyze Results</h3>
              <p className="text-gray-400">View detailed analytics to choose the most engaging thumbnail. Make data-driven decisions to improve your video&apos;s click-through rate and overall performance.</p>
            </section>
          </div>
        </main>

        <footer className="mt-24 text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to optimize your YouTube thumbnails?</h3>
          {showLogin ? (
            <SignIn />
          ) : (
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-200 transition-colors"
              onClick={() => setShowLogin(true)}
            >
              Start A/B Testing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </footer>
      </div>
    </div>
  )
}