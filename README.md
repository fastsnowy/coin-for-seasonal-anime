# <img src="https://coin-for-seasonal-anime.vercel.app/icon" alt="" width="28" height="28"> Anicoy

[![Anicoy を開く](https://img.shields.io/badge/Anicoy-%E3%82%B5%E3%82%A4%E3%83%88%E3%82%92%E9%96%8B%E3%81%8F-7C3AED?style=flat-square)](https://coin-for-seasonal-anime.vercel.app/)
![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

Anicoy（旧 coin-for-seasonal-anime）は、シーズンごとに気になるアニメへコインを配分し、期待度を投票する Web アプリです。作品ごとに集まったコイン数は、シーズン別のランキングで確認できます。

## ドキュメント

- [使い方](./docs/usage.md)
- [技術構成](./docs/architecture.md)
- [ローカル開発と環境変数の設定](./docs/local-development.md)
- [Supabase の移行手順](./SUPABASE_MIGRATION.md)

## Quickstart

```bash
git clone https://github.com/fastsnowy/coin-for-seasonal-anime.git
cd coin-for-seasonal-anime
pnpm install --frozen-lockfile
pnpm exec supabase start
${EDITOR:-vi} .env.local
pnpm dev
```
