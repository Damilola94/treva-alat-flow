'use client'

import { useEffect } from 'react'
import AOS from 'aos'

export default function Home () {
  useEffect(() => {
    AOS.init({ once: true })
  }, [])

  return (
    <main className="app_main app_landing">
      Hello World!
    </main>
  )
}
