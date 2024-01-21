"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const rowNumber = 30; // 행의 수
  const colNumber = 30; // 열의 수
  const [rotations, setRotations] = useState(
    Array(rowNumber).fill(Array(colNumber).fill(0))
  );

  const [opacity, setOpacity] = useState(
    Array(rowNumber).fill(Array(colNumber).fill(0))
  );
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const arrowRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    document.body.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.body.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const newRotation = [[], []] as number[][];
    const newOpacity = [[], []] as number[][];
    let rowIndex = 0;
    let colIndex = 0;
    for (rowIndex = 0; rowIndex < rowNumber; rowIndex++) {
      for (colIndex = 0; colIndex < colNumber; colIndex++) {
        const ref = arrowRefs.current[rowIndex * colNumber + colIndex];
        const boundingBox = ref.getBoundingClientRect();
        const cellCenterX = boundingBox.x;
        const cellCenterY = boundingBox.y;
        // 앵글
        // 0 위
        // 90 우
        // 180 아래
        // 270 좌
        const angle =
          Math.atan2(mouseY - cellCenterY, mouseX - cellCenterX) *
          (180 / Math.PI);
        if (typeof newRotation[rowIndex] === "undefined")
          newRotation[rowIndex] = [];
        newRotation[rowIndex][colIndex] = (angle + 360 + 90) % 360;

        // 거리 계산
        const distance = Math.hypot(mouseX - cellCenterX, mouseY - cellCenterY);
        // 거리에 따른 투명도 계산
        const opacity = Math.max(0, Math.min(1, 1 - distance / 1500));
        if (typeof newOpacity[rowIndex] === "undefined")
          newOpacity[rowIndex] = [];
        newOpacity[rowIndex][colIndex] = opacity;
      }
    }
    setRotations(newRotation);
    setOpacity(newOpacity);
    // 리액트 불변성 배열 할당
  }, [mouseX, mouseY]);

  return (
    <main className="flex flex-wrap justify-center h-screen w-screen bg-black">
      {Array(rowNumber)
        .fill(0)
        .map((_, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap min-h-2 min-w-20">
            {Array(colNumber)
              .fill(0)
              .map((_, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="flex-1">
                  <div
                    ref={(elem) => {
                      if (elem) {
                        arrowRefs.current[rowIndex * colNumber + colIndex] =
                          elem;
                      }
                    }}
                  >
                    <Image
                      className="object-cover"
                      src="/arrow-ui.svg"
                      alt="arrow"
                      width={100}
                      height={100}
                      priority
                      style={{
                        transform: `rotate(${rotations[rowIndex][colIndex]}deg)`,
                        opacity: opacity[rowIndex][colIndex],
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
