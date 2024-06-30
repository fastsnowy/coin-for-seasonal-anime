type Props = {
  params: {
    results: string;
  };
};

export default async function Home({ params }: Props) {
  return (
    <div>
      <h1>投票結果</h1>
      <div>params:</div>
      <div>{params.results}</div>
    </div>
  );
}
