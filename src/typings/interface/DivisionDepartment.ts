import type { Department } from './Department'
import type { Division } from './Division'

export interface DivisionDepartment {
  id: string
  division_id: string
  department_id: string
  expand?: {
    division_id: Division
    department_id: Department
  }
}
