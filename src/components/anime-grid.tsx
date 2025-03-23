"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Anime } from "@/lib/anime-data"

interface AnimeGridProps {
  animeList: Anime[]
}

export default function AnimeGrid({ animeList }: AnimeGridProps) {
  // クライアント側で評価スコアを管理
  const [scores, setScores] = useState<Record<number, number>>(
    animeList.reduce((acc, anime) => ({ ...acc, [anime.id]: 0 }), {}),
  )

  // 選択されたアニメ（スコアが1以上）の数を追跡
  const [selectedCount, setSelectedCount] = useState(0)

  // モーダルの表示状態
  const [showModal, setShowModal] = useState(false)

  // スコアが変更されたときに選択数を更新
  useEffect(() => {
    const count = Object.values(scores).filter((score) => score > 0).length
    setSelectedCount(count)
  }, [scores])

  const handleVote = (id: number, value: number) => {
    setScores((prev) => ({ ...prev, [id]: value }))
  }

  // 投票モーダルを表示
  const handleOpenVoteModal = () => {
    if (selectedCount > 0) {
      setShowModal(true)
    }
  }

  // 最終投票処理
  const handleSubmitVotes = () => {
    // 選択されたアニメ（スコアが1以上）のみをフィルタリング
    const selectedAnime = animeList
      .filter((anime) => scores[anime.id] > 0)
      .map((anime) => ({
        id: anime.id,
        title: anime.title,
        score: scores[anime.id],
      }))

    // ここで投票データをAPIに送信する処理を実装
    console.log("投票データ:", selectedAnime)

    // モーダルを閉じる
    setShowModal(false)

    // 成功メッセージなどを表示する処理をここに追加
    alert("投票が完了しました！")

    // 投票後にスコアをリセット（オプション）
    setScores(animeList.reduce((acc, anime) => ({ ...acc, [anime.id]: 0 }), {}))
  }

  // 選択されたアニメのリスト（スコアが1以上）
  const selectedAnime = animeList.filter((anime) => scores[anime.id] > 0)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-24">
        {animeList.length > 0 ? (
          animeList.map((anime) => (
            <Card key={anime.id} className="overflow-hidden">
              <div className="relative h-[300px] w-full">
                <img src={anime.image || "/placeholder.svg"} alt={anime.title} className="object-cover" />
                {scores[anime.id] > 0 && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {scores[anime.id]}
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg line-clamp-2 h-14">{anime.title}</h3>
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">評価</span>
                    <span className="font-medium">{scores[anime.id]}</span>
                  </div>
                  <Slider
                    value={[scores[anime.id]]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleVote(anime.id, value[0])}
                    className="mb-4"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">選択した期間のアニメが見つかりません</p>
          </div>
        )}
      </div>

      {/* 固定フッター - 選択数と投票ボタン */}
      {animeList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-10">
          <div className="container mx-auto flex items-center justify-between">
            <div className="text-lg font-medium">
              選択中: <span className="font-bold text-primary">{selectedCount}</span> 作品
            </div>
            <Button size="lg" onClick={handleOpenVoteModal} disabled={selectedCount === 0}>
              投票する
            </Button>
          </div>
        </div>
      )}

      {/* 投票確認モーダル */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">投票の確認</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="mb-4 text-muted-foreground">以下の{selectedCount}作品に投票します。よろしいですか？</p>

            <ScrollArea className="h-[300px] rounded-md border p-4">
              <ul className="space-y-4">
                {selectedAnime.map((anime) => (
                  <li key={anime.id} className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium line-clamp-1">{anime.title}</span>
                    <span className="ml-2 px-2 py-1 bg-primary/10 rounded-md font-bold">{scores[anime.id]}点</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSubmitVotes}>投票を確定する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

