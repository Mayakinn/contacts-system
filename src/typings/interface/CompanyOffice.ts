import type { Company } from './Company'
import type { Office } from './Office'

export interface CompanyOffice {
  id: string
  company_id: string
  office_id: string
  expand?: {
    office_id: Office
    company_id: Company
  }
}
