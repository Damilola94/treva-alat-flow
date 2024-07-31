'use client'

import React, { useRef, useState } from 'react'

function PauseAndPlay ({ onClick = () => { }, play = undefined as undefined | boolean }) {
  return (
    <svg onClick={onClick} width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="112" height="112" rx="56" fill="white" fillOpacity="0.35" />
      <rect x="0.5" y="0.5" width="111" height="111" rx="55.5" stroke="white" strokeOpacity="0.25" />
      <rect x="16" y="16" width="80" height="80" rx="40" fill="white" fillOpacity="0.01" />
      <rect x="16" y="16" width="80" height="80" rx="40" fill="url(#paint0_linear_4622_6495)" />
      <mask id="mask0_4622_6495" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="16" y="16" width="80" height="80">
        <rect x="16" y="16" width="80" height="80" fill="white" />
      </mask>
      <g mask="url(#mask0_4622_6495)">
        <rect x="16" y="16" width="80" height="80" rx="40" fill="white" fillOpacity="0.25" />
        <rect x="16" y="16" width="80" height="80" rx="40" fill="url(#paint1_linear_4622_6495)" />
      </g>

      {play && (
        <>
          <path d="M61.5 46H58.5C58.2239 46 58 46.2239 58 46.5V61.5C58 61.7761 58.2239 62 58.5 62H61.5C61.7761 62 62 61.7761 62 61.5V46.5C62 46.2239 61.7761 46 61.5 46Z" fill="white" />
          <path d="M53.5 46H50.5C50.2239 46 50 46.2239 50 46.5V61.5C50 61.7761 50.2239 62 50.5 62H53.5C53.7761 62 54 61.7761 54 61.5V46.5C54 46.2239 53.7761 46 53.5 46Z" fill="white" />
        </>
      )}

      {!play && <path d="M61.9011 54.2568C63.2604 55.0215 63.2604 56.9785 61.9011 57.7432L51.9805 63.3235C50.6473 64.0734 49 63.11 49 61.5803V50.4197C49 48.8901 50.6473 47.9266 51.9805 48.6766L61.9011 54.2568Z" fill="white" />}

      <defs>
        <linearGradient id="paint0_linear_4622_6495" x1="56" y1="16" x2="56" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0.1771" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="paint1_linear_4622_6495" x1="56" y1="16" x2="56" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>

  )
}
export function VideoPlayer ({ src = '' }) {
  const clip: any = useRef(null)

  const [play, setPlay] = useState(undefined as boolean | undefined)

  const handleVideo = () => {
    if (typeof clip?.current === 'undefined') return

    if (play === true) {
      clip.current.pause()
    } else {
      clip.current.play()
    }
  }

  if (src === '') return null

  return (
    <div className={`app_vid_plyr w-full ${play === true ? 'playing' : ''}`}>
      <PauseAndPlay {...{ play, onClick: handleVideo }} />

      <video ref={clip} onPause={() => { setPlay(false) }} onPlay={() => { setPlay(true) }} controls controlsList='nodownload' src={src} />
    </div>
  )
}
