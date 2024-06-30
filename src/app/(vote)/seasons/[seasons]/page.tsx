type Props = {
  params: {
    seasons: string;
  };
};

export default async function Home({ params }: Props) {
  return (
    <div className="flex-1 grid container my-4">
      <div>params:</div>
      <div>{params.seasons}</div>
    </div>
  );
}
