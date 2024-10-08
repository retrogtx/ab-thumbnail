"use client"

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

const FloatingDot = ({ delay }: { delay: number }) => {
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      y: [0, -20, 0],
      opacity: [0.2, 0.5, 0.2],
      transition: {
        duration: Math.random() * 2 + 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay,
      },
    })
  }, [controls, delay])

  return (
    <motion.div
      className="absolute w-1 h-1 bg-white rounded-full opacity-20"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={controls}
    />
  )
}

export default function Component() {
  const [activeTab, setActiveTab] = useState('upload')

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />

      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-black to-purple-900/20" />

      {/* Floating dots */}
      {[...Array(50)].map((_, i) => (
        <FloatingDot key={i} delay={i * 0.1} />
      ))}

      {/* Content */}
      <div className="relative z-10">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <Image src="/placeholder.svg" alt="ThumbnailTester Logo" width={32} height={32} />
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="text-sm text-white border-gray-800 hover:bg-gray-800">
                Dashboard
              </Button>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-16 max-w-5xl">
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Your complete platform for YouTube thumbnail testing.
          </motion.h1>
          <motion.p 
            className="text-xl mb-12 text-gray-400 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            ThumbnailTester provides the tools and infrastructure to test, analyze, and optimize your YouTube thumbnails for maximum engagement.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Button className="bg-white text-black hover:bg-gray-200 transition-colors">
              Start Testing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="text-white border-gray-800 hover:bg-gray-800">
              View Demo
            </Button>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 mb-16">
            {[
              { title: "Upload", description: "Easily upload multiple thumbnail options for your videos." },
              { title: "Test", description: "Create polls and gather feedback from your target audience." },
              { title: "Analyze", description: "View detailed analytics to choose the most engaging thumbnail." },
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
            className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to optimize your YouTube thumbnails?</h2>
            <p className="text-gray-400 mb-6">Join thousands of content creators who are boosting their video performance.</p>
            <Button className="bg-white text-black hover:bg-gray-200 transition-colors">
              Start Testing Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </main>

        <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 ThumbnailTester. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}