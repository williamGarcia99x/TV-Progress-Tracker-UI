import { getAllUserTrackings } from "@/lib/trackerService";
import ShowCardGrid from "../ShowCardGrid";

import { cookies } from "next/headers";

async function Watching() {
  const cookieStore = await cookies();
  const watching = await getAllUserTrackings(
    cookieStore.get("token")?.value as string,
    { status: "WATCHING" }
  );

  return (
    <div>
      <ShowCardGrid shows={watching} />
    </div>
  );
}

export default Watching;
