"use client"; // This directive indicates that this file is a client component
// and should be rendered on the client side, allowing it to use hooks and other client-side
// features.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetching on window focus
    },
  },
});

function Providers({ children }: { children: React.ReactNode }) {
  // This component wraps the children with the QueryClientProvider
  // to provide the query client context to the application.
  // It allows the use of React Query hooks in the children components.
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen />
      {children}
    </QueryClientProvider>
  );
}

export default Providers;
