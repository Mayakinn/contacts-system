import type { Department } from './Department'
import type { Group } from './Group'

export interface DepartmentGroup {
  id: string
  department_id: string
  group_id: string
  expand?: {
    group_id: Group
    department_id: Department
  }
}
