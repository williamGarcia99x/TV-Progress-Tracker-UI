/* ---------- TrackingInfo.tsx ---------- */
"use client";

import { ShowDetails } from "@/lib/tmdb";
import { createTracker, TrackerActionState } from "@/lib/trackerActions";
import { UserTvTracker } from "@/lib/trackerService";
import { cn } from "@/lib/utils";
import { useActionState } from "react";
import toast from "react-hot-toast";

//TODO. Component should not re-render if there's an error with createTracker.
//optimize this later.
export function TrackingInfoForm({
  trackingInfo,
  showDetails,
}: {
  trackingInfo: UserTvTracker;
  showDetails: ShowDetails;
}) {
  //To add toast notifications, we must make a helper function that has
  //access to the prevState object and knows when the createTracker has begun, isPending, and isFinished
  const formWithToast = async (
    prevState: TrackerActionState,
    form: FormData
  ) => {
    const toastId = toast.loading("Submitting tracking info ⏳");

    //invoke server action! Pending state
    const result = await createTracker(prevState, form);

    if (result.error) {
      toast.error(result.error, { id: toastId });
    } else toast.success(result?.success as string, { id: toastId });

    return result;
  };

  const [state, formAction] = useActionState(
    formWithToast,
    {} as TrackerActionState
  );

  //TODO If status is either watching || completed, hide the episodes watched and seasons watched inputs or make them
  //display N/A

  return (
    <form action={formAction}>
      <div className="rounded-xl border border-gray-600 bg-gradient-to-br from-0% via-[#40330172] to-100% bg-black p-6 text-slate-100 backdrop-blur-md">
        <h3 className="text-3xl font-bold mb-4">Your Tracking</h3>
        <ul className="flex flex-wrap gap-y-4  mb-4">
          {/* Status (select) */}
          <input name="userId" hidden value={trackingInfo.userId} readOnly />
          <input name="showId" hidden value={trackingInfo.showId} readOnly />
          <input
            name="originalName"
            hidden
            value={showDetails.original_name}
            readOnly
          />
          <input
            name="genreIds"
            hidden
            value={showDetails.genres.map((genre) => genre.id.toString())}
            readOnly
          />
          <Item label="Status:">
            <select
              name="status"
              defaultValue={trackingInfo.status}
              className="s"
            >
              <option value="PLANNING">planning</option>
              <option value="WATCHING">watching</option>
              <option value="COMPLETED">completed</option>
            </select>
          </Item>
          {/* Episodes Watched (number) */}
          <Item label="Episodes Watched:">
            <input
              type="number"
              min={0}
              name="episodesWatched"
              defaultValue={trackingInfo.episodesWatched ?? ""}
              className=""
            />
          </Item>
          {/* Seasons Watched (number) */}
          <Item label="Seasons Watched:">
            <input
              type="number"
              name="currentSeason"
              defaultValue={trackingInfo.currentSeason ?? ""}
              className=""
            />
          </Item>

          {/* Personal Rating (select 1‑10) */}
          <Item label="Personal Rating:">
            <select
              name="userRating"
              defaultValue={trackingInfo.userRating ?? ""}
              className=""
            >
              <option value="">N/A</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Item>
          {/* Started At (date) */}
          <Item label="Started At:">
            <input
              type="date"
              name="dateStarted"
              defaultValue={
                trackingInfo.dateStarted
                  ? new Date(trackingInfo.dateStarted)
                      .toISOString()
                      .substring(0, 10)
                  : ""
              }
              className=""
            />
          </Item>
          {/* Finished At (date) */}
          <Item label="Finished At:">
            <input
              type="date"
              name="dateCompleted"
              defaultValue={
                trackingInfo.dateCompleted
                  ? new Date(trackingInfo.dateCompleted)
                      .toISOString()
                      .substring(0, 10)
                  : ""
              }
              className=""
            />
          </Item>
        </ul>

        {/* Notes */}

        <div className="flex flex-col  ">
          <label className="text-xl">
            <span className="">Notes</span>
          </label>
          <textarea
            defaultValue={trackingInfo.notes ?? ""}
            name="notes"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-gold-main text-cinematic-mocha p-2 rounded-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

function Item({
  label,
  children,
  as,
  className,
}: {
  label: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  const Component = as || "li";
  return (
    <Component className={cn("text-xl basis-1/3 space-x-2", className)}>
      <label className="">
        <span className="">{label}</span>
      </label>
      {children}
    </Component>
  );
}
