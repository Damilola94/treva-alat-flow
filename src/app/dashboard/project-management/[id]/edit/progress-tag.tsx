export const ProgressBar = () => (
  <div className="w-1/4">
    <div className="app_progress-bar__label">
      Progress 0% <span className="app_progress-bar__label__days-left">{'{Days left}'}</span>
    </div>
    <div className="app_progress-bar-track">
      <div className="app_progress-bar-track-fill" style={{ width: '10%' }} />
    </div>
  </div>
);
