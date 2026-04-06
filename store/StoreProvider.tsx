"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

/**
 * StoreProvider wraps the Redux Provider.
 * Must be a Client Component ("use client") because Redux Provider
 * relies on React context which is client-side only in Next.js App Router.
 */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useRef ensures a single store instance across re-renders
  const storeRef = useRef(store);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
