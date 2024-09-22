"use client";
import MultipleLookup from "./components/MultipleLookup";

export default function Home() {
  const rowNumber = 20; // 행의 수
  const colNumber = 20; // 열의 수

  return (
    <main className="flex flex-wrap justify-center h-full w-full bg-black">
      <MultipleLookup colNumber={colNumber} rowNumber={rowNumber} />
    </main>
  );
}
