export interface UserDb {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  archivedAt?: string | null
}
