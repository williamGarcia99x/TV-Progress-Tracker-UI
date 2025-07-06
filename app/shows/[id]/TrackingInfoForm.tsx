/* ---------- TrackingInfo.tsx ---------- */
"use client";
import isEqual from "lodash/isEqual";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ShowDetails } from "@/lib/tmdb";
import {
  createTracker,
  TrackerActionState,
  updateTracker,
} from "@/lib/trackerActions";
import { UserTvTracker } from "@/lib/trackerService";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  status: "PLANNING" | "WATCHING" | "COMPLETED";
  episodesWatched: string | "";
  currentSeason: string | "";
  userRating: string | "";
  dateStarted: string;
  dateCompleted: string;
  notes: string;
};

function calculateDefaultFormInput(trackingInfo: UserTvTracker | null): Inputs {
  //user is already updating the show. Defaults come from the given trackingInfo object.

  return {
    status: trackingInfo?.status ?? "PLANNING",
    episodesWatched: String(trackingInfo?.episodesWatched ?? ""),
    currentSeason: String(trackingInfo?.currentSeason ?? ""),
    userRating: String(trackingInfo?.userRating ?? ""),
    dateStarted: trackingInfo?.dateStarted?.toString().slice(0, 10) ?? "",
    dateCompleted: trackingInfo?.dateCompleted?.toString().slice(0, 10) ?? "",
    notes: trackingInfo?.notes ?? "",
  };
}

export function TrackingInfoForm({
  trackingInfo,
  showDetails,
}: {
  trackingInfo: UserTvTracker | null;
  showDetails: ShowDetails;
}) {
  const [isInitialRender, setIsInitialRender] = useState(true);
  //If a user is not tracking a show, these values will be the default values.
  // initial defaults
  const defaults = calculateDefaultFormInput(trackingInfo);

  //useForm hook from react-hook-form. You must specify the schema of form data using generics
  const form = useForm<Inputs>({
    defaultValues: defaults,
  });

  const status = form.watch("status");

  //Executes on submission of form after successful form validation
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //if the user is tracking the show but the form info hasn't changed, don't invoke the server action.

    if (
      trackingInfo &&
      isEqual(form.getValues(), calculateDefaultFormInput(trackingInfo))
    ) {
      toast("No changes made 🙂");
      return;
    }

    const toastId = toast.loading("Submitting tracking info ⏳");
    const fd = new FormData();

    //For each property in the data args object, append it to the fd FormData object. This is what gets passed to the server action
    Object.entries(data).forEach(([key, val]) => fd.append(key, String(val)));

    //Add hidden fields
    fd.append("trackerId", String(trackingInfo?.trackerId || Number.MIN_VALUE));
    fd.append("showId", String(showDetails.id));
    fd.append("name", showDetails.name);
    fd.append("originalName", showDetails.original_name);
    fd.append("posterPath", showDetails.poster_path ?? "");
    fd.append(
      "genreIds",
      showDetails.genres.map((genre) => genre.id).join(",")
    );

    //invoke server action
    const result: TrackerActionState =
      trackingInfo === null
        ? await createTracker({}, fd)
        : await updateTracker({}, fd);

    if (result.error) {
      toast.error(result.error, { id: toastId });
    } else toast.success(result?.success as string, { id: toastId });
  };

  useEffect(() => {
    //We want to reset the status if it changes to "Planning"
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    if (status === "PLANNING") {
      form.reset({
        //Including the defaults objects here would force me to memoize it, otherwise this useEffect would execute on every re-render.
        //Instead, we use the helper function below
        ...calculateDefaultFormInput(trackingInfo),
        notes: form.getValues("notes"),
        status: "PLANNING",
      });
    }
  }, [status, isInitialRender, form, showDetails.id, trackingInfo]);

  return (
    <Form {...form}>
      {/* first arguments passed to handleSubmit is the callback to execute after successful validation */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="rounded-xl border  bg-gray-950/50   p-6 text-slate-100 backdrop-blur-md">
          <h3 className="text-3xl font-bold mb-4">Your Tracking</h3>
          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select {...field}>
                    <option value="PLANNING">planning</option>

                    <option value="WATCHING">watching</option>
                    <option value="COMPLETED">completed</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Episodes Watched */}
          <FormField
            control={form.control}
            name="episodesWatched"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Current Episode</FormLabel>
                <FormControl>
                  <input
                    type="number"
                    min={0}
                    {...field}
                    disabled={status === "PLANNING"}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Seasons Watched */}
          <FormField
            control={form.control}
            name="currentSeason"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Current Season</FormLabel>
                <FormControl>
                  <input
                    type="number"
                    {...field}
                    disabled={status === "PLANNING"}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Personal Rating */}
          <FormField
            control={form.control}
            name="userRating"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Personal Rating</FormLabel>
                <FormControl>
                  <select {...field} disabled={status === "PLANNING"}>
                    <option value={""}>N/A</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Started / Finished */}
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="dateStarted"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Started At</FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      {...field}
                      disabled={status === "PLANNING"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateCompleted"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Finished At</FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      {...field}
                      disabled={status === "PLANNING"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <textarea {...field} disabled={status === "PLANNING"} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="">
            {trackingInfo ? "Edit" : "Track"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
