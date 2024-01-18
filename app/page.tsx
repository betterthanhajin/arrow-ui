"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function Home() {
  const rows = 30; // 행의 수
  const cols = 30; // 열의 수

  const [rotation, setRotation] = useState(
    Array(rows).fill(Array(cols).fill(0))
  );

  const handleTouch = (
    rowIndex: number,
    colIndex: number,
    event: React.MouseEvent | React.TouchEvent<Element>
  ) => {
    const rect = (event.target as Element).getBoundingClientRect();
    let x, y;
    if ("clientX" in event) {
      // MouseEvent
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else {
      // TouchEvent
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    }
    const angle = Math.atan2(y - 50, x - 50) * (180 / Math.PI) + 90;
    const newRotation = Array(rows).fill(Array(cols).fill(angle));
    setRotation(newRotation);
  };

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
                  <div
                    onTouchStart={(event) =>
                      handleTouch(rowIndex, colIndex, event)
                    }
                  >
                    <Image
                      className="object-cover"
                      src="/arrow-ui.svg"
                      alt="arrow"
                      width={100}
                      height={100}
                      priority
                      style={{
                        transform: `rotate(${rotation[rowIndex][colIndex]}deg)`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        ))}
    </main>
  );
}
