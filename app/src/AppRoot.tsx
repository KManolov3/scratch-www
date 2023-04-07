import { ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";
import { apolloClient } from "./config/graphql";

export function AppRoot({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  )
}
