import React from 'react';

interface ProjectProgressBarProps {
  percent: number;
  daysLeft: string;
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({ percent, daysLeft }) => (
  <div className="md:w-1/4">
    <div className="app_progress-bar__label">
      Progress {percent}%{' '}
      <span className="app_progress-bar__label__days-left">
        {daysLeft}
      </span>
    </div>
    <div className="app_progress-bar-track">
      <div
        className="app_progress-bar-track-fill"
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);