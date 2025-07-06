import { getAllUserTrackings } from "@/lib/trackerService";
import { cookies } from "next/headers";
import ShowCardGrid from "../ShowCardGrid";

async function Completed() {
  const cookieStore = await cookies();
  const completed = await getAllUserTrackings(
    cookieStore.get("token")?.value as string,
    { status: "COMPLETED" }
  );

  return (
    <div>
      <ShowCardGrid shows={completed} />
    </div>
  );
}

export default Completed;
