/* ---------- TrackingInfo.tsx ---------- */
"use client";

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
import { createTracker, TrackerActionState } from "@/lib/trackerActions";
import { UserTvTracker } from "@/lib/trackerService";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  trackerId: number;
  userId: number;
  showId: number;
  status: "PLANNING" | "WATCHING" | "COMPLETED";
  episodesWatched: number | "";
  currentSeason: number | "";
  userRating: number | "";
  dateStarted: string;
  dateCompleted: string;
  notes: string;
};

function calculateDefaultFormInput(
  trackingInfo: UserTvTracker,
  showId: number
): Inputs {
  return {
    trackerId: trackingInfo.trackerId,
    userId: trackingInfo.userId,
    showId: showId,
    status: trackingInfo.status,
    episodesWatched: trackingInfo.episodesWatched ?? "",
    currentSeason: trackingInfo.currentSeason ?? "",
    userRating: trackingInfo.userRating ?? 0,
    dateStarted: trackingInfo.dateStarted?.toString().slice(0, 10) ?? "",
    dateCompleted: trackingInfo.dateCompleted?.toString().slice(0, 10) ?? "",
    notes: trackingInfo.notes ?? "",
  };
}

// trackingInfo is the input data meant to be the defaultValues
export function TrackingInfoForm({
  trackingInfo,
  showDetails,
}: {
  trackingInfo: UserTvTracker;
  showDetails: ShowDetails;
}) {
  const [isInitialRender, setIsInitialRender] = useState(true);
  //If a user is not tracking a show, these values will be the default values.
  //If a user switches Status to planning from either watching or completed, set all fields to their default values
  // initial defaults
  const defaults = calculateDefaultFormInput(trackingInfo, showDetails.id);

  //useForm hook from react-hook-form. You must specify the schema of form data using generics
  const form = useForm<Inputs>({
    defaultValues: defaults,
  });

  const status = form.watch("status");

  //Executes on submission of form after successful form validation
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("ON CLIENT onSubmit, ");
    console.log(data);
    const toastId = toast.loading("Submitting tracking info ⏳");
    const fd = new FormData();

    //For each property in the data args object, append it to the fd FormData object. This is what gets passed to the server action
    Object.entries(data).forEach(([key, val]) => fd.append(key, String(val)));

    //Add hidden fields
    fd.append("originalName", showDetails.original_name);
    fd.append(
      "genreIds",
      showDetails.genres.map((genre) => genre.id).join(",")
    );

    //invoke server action! Pending state
    const result: TrackerActionState = await createTracker({}, fd);

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
        ...calculateDefaultFormInput(trackingInfo, showDetails.id),
        notes: form.getValues("notes"),
      });
    }
  }, [status, isInitialRender, form, showDetails.id, trackingInfo]);

  return (
    <Form {...form}>
      {/* first arguments passed to handleSubmit is the callback to execute after successful validation */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="rounded-xl border border-gray-600 bg-gradient-to-br from-0% via-[#40330172] to-100% bg-black p-6 text-slate-100 backdrop-blur-md">
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
                <FormLabel>Episodes Watched</FormLabel>
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
                <FormLabel>Seasons Watched</FormLabel>
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
                    <option value={0}>N/A</option>
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

          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
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
