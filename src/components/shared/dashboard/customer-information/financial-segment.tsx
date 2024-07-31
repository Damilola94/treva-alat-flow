'use client'
import React from 'react'
import { ArrowDown, Bubble } from '../..'
import dynamic from 'next/dynamic'
import queries from '@/services/queries/account-management/financial-segment'
import { Skeleton } from '@/components/ui/skeleton'

const Chart = dynamic(async () => await import('./financial-segment-chart'), {
  ssr: false
})

export function FinancialSegment () {
  const { data, isLoading } = queries.read()

  if (!data?.responseData && isLoading) {
    return (
    <div className="app_gender_chart app_financial_segment flex flex-col gap-6">
      <Skeleton height={358} />
    </div>
    )
  }

  return (
    <div className="app_gender_chart app_financial_segment flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <button className="app_gender_chart__btn">
            <Bubble />
            Financial Segment
          </button>
        </div>

        <div>
          <button className="app_gender_chart__btn">
            Retail
            <ArrowDown />
          </button>
        </div>
      </div>
      <div className="flex gap-10 items-center justify-center">
        <Chart />
      </div>
    </div>
  )
}
