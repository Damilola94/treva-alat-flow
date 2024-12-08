import React from 'react';
import { PlusIcon, FlagOutline, CalendarWithMark } from '@/components/shared';

const TaskCard = () => (
  <div className="task-card">
    <h4 className="task-card__title">{'{Task name}'}</h4>
    <ul className="task-card__options">
      <li className="flex ">
        <input type="checkbox" id="complete" />
        <label htmlFor="complete">Mark as complete</label>
      </li>
      <li className="flex gap-2">
        <CalendarWithMark />
        Add date
      </li>
      <li className="flex gap-2">
        <FlagOutline />
        Add priority
      </li>
    </ul>
  </div>
);

export function TaskGirdView() {
  return (
    <div className="task-board">
      <div className="task-section task-section--todo">
        <div className="task-section__header">
          <div className="project_action_group__todo">
            To do <span className="font-bold">10</span>
          </div>
          <button className="task-section__add">
            {' '}
            <PlusIcon fill="#6D6D6D" />
          </button>
        </div>
        <div className="task-section__content">
          <TaskCard />
          <TaskCard />
          <TaskCard />
          <div
            onClick={() => {}}
            className="flex mt-5 items-center cursor-pointer text-shark-950 gap-1"
          >
            <PlusIcon fill="#6D6D6D" />
            Add task
          </div>
        </div>
      </div>

      <div className="task-section task-section--completed">
        <div className="task-section__header">
          <div className="bg-green-800 project_action_group__completed ">
            Completed <span className="font-bold">10</span>
          </div>
          <button className="task-section__add">
            {' '}
            <PlusIcon fill="#6D6D6D" />
          </button>
        </div>
        <div className="task-section__content">
          <TaskCard />
          <div
            onClick={() => {}}
            className="flex mt-5 items-center cursor-pointer text-shark-950 gap-1"
          >
            <PlusIcon fill="#6D6D6D" />
            Add task
          </div>
        </div>
      </div>
    </div>
  );
}
