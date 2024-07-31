import React from 'react'

export function PerformanceScore () {
  return (
    <div className="app_dashboard_performance_score">
      <p className="app_dashboard_performance_score__label">
        Your <br /> Performance <br /> Score
      </p>

      <div className="flex gap-4 items-center">
        <h2 className="app_dashboard_performance_score__grade">B</h2>

        <div className="app_dashboard_performance_score__score">
          <div className="app_dashboard_performance_score__score__text">
            79%
          </div>
        </div>
      </div>
    </div>
  )
}
