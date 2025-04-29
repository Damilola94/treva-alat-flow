'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import React from 'react'

export default function CreativeProfileLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-16 border-b border-gray-200 flex items-center px-6">
        <button
          onClick={() => { router.back(); }}
          className="mr-3 p-1 rounded-full hover:bg-gray-100 flex items-center"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="ml-2 font-medium">Hiring Management</span>
        </button>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
