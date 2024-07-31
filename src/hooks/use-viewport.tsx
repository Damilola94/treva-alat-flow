'use client'

import { useState, useEffect } from 'react'

export const useViewport = () => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleWindowResize)

    return () => { window.removeEventListener('resize', handleWindowResize) }
  }, [])

  return { width, height }
}
