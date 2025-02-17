'use client'

import queries from '@/services/queries/projects'
import { MoveLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()

  const { id } = useParams()
  const projectId = Array.isArray(id) ? id[0] : id
  const { data } = queries.readone({ projectId })

  return (
    <div className="w-full h-full overflow-y-auto app_dashboard_group_page pb-10">
      <div className="flex gap-2 items-center px-6 py-4 app_dashboard_group_header">
        <button onClick={() => { router.back() }} className="app_dashboard_group_header__back__btn" type="button">
          <MoveLeft color="#6A6F70" size={18} />
        </button>

        <p className="app_dashboard_group_header__back__text">
          {data?.title || 'Group'}
        </p>
      </div>
      <div className="mx-6 my-6 app_dashboard_group_page_single_content">
        {children}

      </div>
    </div>
  )
}
