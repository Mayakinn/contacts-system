import type { Division } from './Division'
import type { Office } from './Office'

export interface OfficeDivision {
  id: string
  office_id: string
  division_id: string
  expand?: {
    office_id: Office
    division_id: Division
  }
}
