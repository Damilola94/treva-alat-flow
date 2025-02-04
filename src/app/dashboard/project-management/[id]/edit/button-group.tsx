import { Calendar, FlagOutline, CalendarWithMark } from '@/components/shared';

export const ButtonGroup = () => (
  <div className="project_action_group">
    <Calendar />
    Start:
    <div className="project_action_group__button">Date</div>
    <CalendarWithMark />
    End:
    <div className="project_action_group__button">Date</div>
    <FlagOutline />
    Priority
    <div className="project_action_group__button">
      <span className="project_action_group__app_priority_tag__dot" />
      High
    </div>
  </div>
);
