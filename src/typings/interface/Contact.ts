import type { RecordModel } from 'pocketbase'
import type { Company } from './Company'
import type { Department } from './Department'
import type { Division } from './Division'
import type { Group } from './Group'
import type { Office } from './Office'

export interface Contact {
  id: string
  collectionId: string
  collectionName: string
  created: Date
  updated: Date
  name: string
  surname: string
  email: string
  phone_number: string
  position: string
  company_id: string
  office_id: string
  expand?: {
    office_id: Office
    company_id: Company
    division_id: Division
    department_id: Department
    group_id: Group
  }
  division_id: string
  department_id: string
  group_id: string
  photo: string
}
