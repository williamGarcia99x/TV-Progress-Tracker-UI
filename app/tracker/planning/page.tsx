import { getAllUserTrackings } from "@/lib/trackerService";
import ShowCardGrid from "../ShowCardGrid";
import { cookies } from "next/headers";

async function Planning() {
  const cookieStore = await cookies();
  const planning = await getAllUserTrackings(
    cookieStore.get("token")?.value as string,
    { status: "PLANNING" }
  );

  return (
    <div>
      <ShowCardGrid shows={planning} />
    </div>
  );
}

export default Planning;
