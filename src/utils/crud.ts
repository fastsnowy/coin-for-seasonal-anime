import { showNotification } from '@mantine/notifications'

import { BET_COINS } from '@/configs'
import { supabase } from '@/libs/supabaseClient'

const notificationPostError = () => {
  showNotification({
    title: 'エラー',
    message: 'データの新規登録が出来ませんでした',
    color: 'red',
  })
}
export const createBetData = async (
  annictIdsWithCoinValues: {
    annict_id: number
    coin_value: number
    season: string
    created_id: string
  }[],
) => {
  try {
    const { error } = await supabase.from(BET_COINS).insert(annictIdsWithCoinValues)
    if (error) throw error
  } catch (error) {
    console.error(error)
    notificationPostError()
  }
}
