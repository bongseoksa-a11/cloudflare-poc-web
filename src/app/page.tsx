"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {`env: ${process.env.NEXT_PUBLIC_ENV}, test: ${process.env.TEST}, 'test2': ${process.env.TEST2}`}
        <button onClick={() => router.push("/home")}>Route to Home</button>
      </main>
    </div>
  );
}
