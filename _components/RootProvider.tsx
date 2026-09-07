"use client";
import React, { FC, useState } from "react";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import {
  QueryClient,
  QueryClientProvider,
  // Hydrate,
} from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import { TenderProvider } from "@/context/TenderContext";
import { VendorProvider } from "@/context/VendorContext";

type Props = {
  children: React.ReactNode;
  // server can pass initial session & trpc dehydrated state
  session?: any;
  trpcState?: unknown;
};

const RootProvider: FC<Props> = ({ children, session, trpcState }: Props) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    })
  );
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <trpc.Provider
          client={trpcClient}
          queryClient={queryClient}>
          {/* <Hydrate state={trpcState}> */}
          <TenderProvider>
            <VendorProvider>{children}</VendorProvider>
          </TenderProvider>
          {/* </Hydate> */}
        </trpc.Provider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default RootProvider;
