import { Config as env } from 'react-native-config'

export const config = {
  apiUrl: required('API_URL')
}

function required<K extends keyof typeof env>(name: K): string {
  const value = env[name]

  if (!value) {
    throw new Error(`Missing environment variable ${name}`)
  }

  return value
}
