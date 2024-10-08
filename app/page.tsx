"use client"

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { SignIn } from "@/components/sign-in"

const FloatingDot = () => {
  const controls = useAnimation();

  useEffect(() => {
    const animate = async () => {
      while (true) {
        await controls.start({
          x: Math.random() * window.innerWidth - window.innerWidth / 2,
          y: Math.random() * window.innerHeight - window.innerHeight / 2,
          opacity: [0.1, 0.5, 0.1],
          scale: [1, 1.5, 1],
          transition: {
            duration: Math.random() * 10 + 5,
            ease: "easeInOut",
          },
        });
      }
    };
    
    animate();
    return () => controls.stop();
  }, [controls]);

  return (
    <motion.div
      className="absolute w-[1px] h-[1px] bg-white rounded-full opacity-10 shadow-glow"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={controls}
    />
  )
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />

      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-black to-purple-900/20" />

      {/* Floating dots */}
      {[...Array(100)].map((_, i) => (
        <FloatingDot key={i} />
      ))}

      <div className="relative z-10">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Thumbnail Tuner</h1>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-16 max-w-5xl">
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            A/B Test Your Thumbnails
          </motion.h1>  
          <motion.p 
            className="text-xl mb-12 text-gray-400 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Get real audience feedback before your content goes live.
            <br />
            Optimize for maximum engagement.
          </motion.p>

          <motion.div 
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
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
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 mb-16">
            {[
              { title: "Upload", description: "Easily upload multiple thumbnails. Our intuitive interface makes it simple to compare different designs side by side." },
              { title: "Create Polls", description: "Generate shareable polls to gather feedback from your audience. Reach out to your community or test with a random sample to get diverse opinions." },
              { title: "Analyze", description: "View detailed analytics to choose the most engaging thumbnail. Make data-driven decisions to improve your content's CTR and overall performance." },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`p-6 rounded-lg cursor-pointer transition-colors ${activeTab === feature.title.toLowerCase() ? 'bg-gray-800' : 'hover:bg-gray-900'}`}
                onClick={() => setActiveTab(feature.title.toLowerCase())}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.2, ease: "easeOut" }}
              >
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="bg-gradient-to-r from-gray-300/30 via-white/40 to-gray-200/30 rounded-lg p-8 text-center shadow-lg border border-gray-300 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to see what works?</h2>
            <p className="text-gray-400 mb-6">Join thousands of content creators who are boosting their video performance.</p>
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
          </motion.div>
        </main>

        <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 Thumbnail Tuner. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}