import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DeskApp } from "@/components/desk/desk-app";
import { loadQuotes } from "@/lib/macro/quotes";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await loadQuotes();
    } catch {
      return null;
    }
  },
  component: Home,
});

function Home() {
  const initialQuotes = Route.useLoaderData();
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <DeskApp initialQuotes={initialQuotes} />
    </QueryClientProvider>
  );
}
