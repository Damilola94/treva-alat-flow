import { EmptyStatus } from '../../../svgs';

const IS_EMPTY = false;

const thead = [
  { label: 'Name' },
  { label: 'Due date' },
  { label: 'Priority' },
  { label: '' }
];

const tasks = [
  {
    name: '{Task name}',
    dueDate: '{Month day, year}',
    priority: 'High',
    priorityColor: 'red',
    status: 'Pending'
  },
  {
    name: '{Project name}',
    dueDate: '{Month day, year}',
    priority: 'Medium',
    priorityColor: 'orange',
    status: 'Completed'
  },
  {
    name: '{Project name}',
    dueDate: '{Month day, year}',
    priority: 'Low',
    priorityColor: 'green',
    status: 'Pending'
  }
];

export function EditProjectsTable () {
  if (IS_EMPTY) {
    return (
      <div className="app_dashboard_home__task__ctt app_dashboard_home__task__ctt--empty">
        <EmptyStatus />
        <div className="flex flex-col gap-1">
          <p className="app_dashboard_home__task__ctt__title">No task yet</p>
          <p className="app_dashboard_home__task__ctt__desc">
            Click “add new request” button to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app_dashboard_home__task__cct">
      <div className="w-full text-left relative rounded-xl overflow-auto">
        <div className="shadow-sm overflow-hidden">
          <table className="border-collapse table-auto w-full app_table">
            <thead>
              <tr className="app_table__tr">
                {thead.map(({ label }) => (
                  <th key={label} className="app_table__tr__th">
                    <div className="app_table__tr__th__edit">{label}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="app_table__tbody">
              {tasks.map((task, index) => (
                <tr key={index} className="">
                  <td className="app_table__tbody__td font-medium text-[--text-color-500]">
                    <div className="app_table__tbody__td__ctt font-semibold">
                      {task.name}
                    </div>
                  </td>
                  <td className="app_table__tbody__td text-[--text-color-500]">
                    <div className="app_table__tbody__td__ctt">
                      {task.dueDate}
                    </div>
                  </td>
                  <td className="app_table__tbody__td text-[--text-color-500]">
                    <div className="app_table__tbody__td__ctt">
                      <div className="project_action_group__button w-fit gap-0">
                        <span
                          className="project_action_group__app_priority_tag__dot"
                          style={{
                            backgroundColor:
                              task.priorityColor || 'transparent'
                          }}
                        />
                        {task.priority}
                      </div>
                    </div>
                  </td>
                  <td className="app_table__tbody__td text-[--text-color-500]">
                    <div className="app_table__tbody__td__ctt flex justify-center items-center gap-4">
                      <input type="checkbox" id="complete" />
                      Mark as complete
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
