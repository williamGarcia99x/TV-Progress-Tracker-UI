type TrackShowProps = {
  params: Promise<{ show_id: string }>;
};

async function TrackShow({ params }: TrackShowProps) {
  const { show_id } = await params;

  return <div>{show_id}</div>;
}

export default TrackShow;
