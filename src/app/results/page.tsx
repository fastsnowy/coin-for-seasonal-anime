interface SearchParams {
  id: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default async function Results({
  searchParams,
}: { searchParams: SearchParams }) {
  const id = searchParams.id;

  // JSONPlaceholderのAPIからデータを取得
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const data: Post = await res.json();

  // データを元にコンポーネントをレンダリング
  return (
    <div>
      <h1>Results for ID: {id}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
