import React from 'react';

interface ProjectProgressBarProps {
  percent: number;
  daysLeft?: string;
  text?: string;
}

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  percent,
  daysLeft,
  text,
}) => (
  <div className="md:w-1/4">
    <div className="app_progress-bar__label">
      Progress {percent}%{' '}
      {text ? (
        <span className="app_progress-bar__label__days-left !bg-[#F9C74B1A] !border-[#F9C74B] !text-[#F9C74B]">
          {text}
        </span>
      ) : (
        <span className="app_progress-bar__label__days-left">
          {daysLeft}
        </span>
      )}
    </div>
    <div className="app_progress-bar-track">
      <div
        className="app_progress-bar-track-fill"
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);
