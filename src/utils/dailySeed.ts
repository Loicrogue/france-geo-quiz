import { departments } from '../data/departments'

export function getDailyDepartment() {
  const now = new Date()
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()

  // Hash simple mais déterministe
  let hash = seed
  hash = ((hash >> 16) ^ hash) * 0x45d9f3b
  hash = ((hash >> 16) ^ hash) * 0x45d9f3b
  hash = (hash >> 16) ^ hash
  hash = Math.abs(hash)

  const index = hash % departments.length
  return departments[index]
}

export function getTodayKey() {
  const now = new Date()
  return `daily-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}