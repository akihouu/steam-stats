import "server-only"

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export function getEnv() {
  return {
    steamApiKey: required("STEAM_API_KEY"),
    sessionSecret: required("SESSION_SECRET"),
    baseUrl: required("NEXT_PUBLIC_BASE_URL"),
  }
}
