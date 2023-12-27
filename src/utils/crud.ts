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

const notificationDeleteError = () => {
  showNotification({
    title: 'エラー',
    message: 'データの削除が出来ませんでした',
    color: 'red',
  })
}

const notificationDeleteSuccess = () => {
  showNotification({
    title: '成功',
    message: 'データを削除しました！',
    color: 'green',
  })
}

export const createBetData = async (
  annictIdsWithCoinValues: {
    annict_id: number
    coin_value: number
    season: string
    created_id: string
    deleted_id?: string
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

export const deleteBetData = async (deletedId: string) => {
  try {
    const { error } = await supabase.from(BET_COINS).delete().eq('delete_id', deletedId)

    if (!error) {
      notificationDeleteSuccess()
    }
    if (error) throw error
  } catch (error) {
    console.error(error)
    notificationDeleteError()
  }
}
