import type { AppProps } from 'next/app';
import { QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { useState } from 'react';
import { createQueryClient } from '@/lib/query-client';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

