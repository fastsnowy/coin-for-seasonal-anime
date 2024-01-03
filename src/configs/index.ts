export const DEPLOY_URL = process.env.NEXT_PUBLIC_DEPLOY_URL || 'localhost:3000'
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL
export const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_URL
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
export const TOTAL_COIN_VALUE_VIEW =
  process.env.NODE_ENV === 'production'
    ? process.env.TOTAL_COIN_VALUE_VIEW || 'SET_ENV'
    : 'test_total_coin_value_view'
export const BET_COINS =
  process.env.NODE_ENV === 'production' ? process.env.COIN_TABLE || 'SET_ENV' : 'test_bet_coins'
