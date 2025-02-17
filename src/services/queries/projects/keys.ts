import { getQueryKeys } from '../../helper'

const namespace = 'project'

const keys = {
  ...getQueryKeys(namespace),
  createTasks: `${namespace}/createTasks`,
  readTasks: `${namespace}/readTasks`,
  readTasksOne: `${namespace}/readTasksOne`,
  updateTasks: `${namespace}/updateTasks`,
  deleteTasks: `${namespace}/deleteTasks`,
  createDeliverables: `${namespace}/createDeliverables`,
  readDeliverables: `${namespace}/readDeliverables`,
  readOneDeliverables: `${namespace}/readOneDeliverables`,
  updateDeliverables: `${namespace}/updateDeliverables`,
  deleteDeliverables: `${namespace}/deleteDeliverables`
}

export default keys
