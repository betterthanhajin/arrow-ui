"use client";
import MultipleLookup from "./components/MultipleLookup";

export default function Home() {
  const rowNumber = 10; // 행의 수
  const colNumber = 10; // 열의 수

  return (
    <main className="flex flex-wrap justify-center h-screen w-screen bg-black">
      <MultipleLookup colNumber={colNumber} rowNumber={rowNumber} />
    </main>
  );
}
