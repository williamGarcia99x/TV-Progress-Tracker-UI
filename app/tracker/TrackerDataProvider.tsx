import { ShowSummary } from "@/lib/tmdb";
import { createContext, useContext } from "react";

type TrackerDataContextType = {
  data: ShowSummary[];
};

const TrackerDataContext = createContext<TrackerDataContextType>({ data: [] });

function TrackerDataProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: ShowSummary[];
}) {
  return (
    <TrackerDataContext.Provider value={{ data }}>
      {children}
    </TrackerDataContext.Provider>
  );
}

function useTrackerData() {
  const context = useContext(TrackerDataContext);
  if (context === undefined) {
    throw new Error(
      "TrackerDataContext was used outside of the TrackerDataProvider "
    );
  }
  return context;
}

export { TrackerDataProvider, useTrackerData };
