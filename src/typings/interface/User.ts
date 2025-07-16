import type { UserPermissions } from './UserPermissions'

export interface User {
  id: string
  collectionId: string
  collectionName: string
  username: string
  verified: boolean
  emailVibility: boolean
  email: string
  created: Date
  updated: Date
  name: string
  permissions_id: string
  avatar: string
  expand?: {
    permissions_id?: UserPermissions
  }
}
