export const headers = {
  'content-type': 'application/json',
  Authorization: `Bearer ${process.env.ANNICT_TOKEN}`,
}

export const ANNICT_URL = 'https://api.annict.com/graphql'
