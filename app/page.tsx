"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const rowNumber = 30; // 행의 수
  const colNumber = 30; // 열의 수
  const [rotations, setRotations] = useState(
    Array(rowNumber).fill(Array(colNumber).fill(0))
  );
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const arrowRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
      console.log({ x: e.clientX, y: e.clientY });
      console.log({ positionRef: arrowRefs.current });
    };
    document.body.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.body.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // let angle;
    // angle = Math.atan2(mouseY - 50, mouseX - 50) * (180 / Math.PI);
    // const newRotation = [...rotations];
    // // rowIndex와 colIndex 계산
    // const rowIndex = Math.floor(mouseY / (window.innerHeight / rows));
    // const colIndex = Math.floor(mouseX / (window.innerWidth / cols));
    // console.log({ rowIndex, colIndex, mouseX, mouseY });
    // newRotation[rowIndex][colIndex] = angle;
    // setRotations(newRotation);
    const newRotation = [[], []] as number[][];
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
      }

      console.log({ newRotation });
    }
    setRotations(newRotation);
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
