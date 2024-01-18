import Image from "next/image";

export default function Home() {
  const rows = 30; // 행의 수
  const cols = 30; // 열의 수

  return (
    <main className="flex flex-wrap justify-center h-screen w-screen bg-black">
      {Array(rows)
        .fill(0)
        .map((_, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap min-h-2 min-w-20">
            {Array(cols)
              .fill(0)
              .map((_, colIndex) => (
                <div key={colIndex} className="flex-1">
                  <Image
                    className="object-cover"
                    src="/arrow-ui.svg"
                    alt="arrow"
                    width={100}
                    height={100}
                    priority
                  />
                </div>
              ))}
          </div>
        ))}
    </main>
  );
}
