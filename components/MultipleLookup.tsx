"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface MultipleLookupProps {
  colNumber: number;
  rowNumber: number;
  initialImage?: string;
}

const MultipleLookup: React.FC<MultipleLookupProps> = ({
  colNumber,
  rowNumber,
  initialImage,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // 2차원 배열 초기화 수정
  const [rotations, setRotations] = useState(() =>
    Array(rowNumber)
      .fill(0)
      .map(() => Array(colNumber).fill(0))
  );

  const [opacity, setOpacity] = useState(() =>
    Array(rowNumber)
      .fill(0)
      .map(() => Array(colNumber).fill(0))
  );

  // null로 초기화하여 hydration 불일치 방지
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [mouseY, setMouseY] = useState<number | null>(null);
  const arrowRefs = useRef<HTMLDivElement[]>([]);
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  const debouncedSetMousePosition = useCallback(
    debounce((x: number, y: number) => {
      setMouseX(x);
      setMouseY(y);
    }, 10),
    []
  );

  // 마운트 상태 관리
  useEffect(() => {
    setIsMounted(true);
    // 초기 마우스 위치 설정
    setMouseX(window.innerWidth / 2);
    setMouseY(window.innerHeight / 2);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        debouncedSetMousePosition(e.clientX, e.clientY);
      } else if (e instanceof TouchEvent && e.touches.length > 0) {
        debouncedSetMousePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("touchmove", handleMouseMove);

    return () => {
      document.body.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("touchmove", handleMouseMove);
    };
  }, [isMounted, debouncedSetMousePosition]);

  function debounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
  ) {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    };
  }

  useEffect(() => {
    if (!isMounted || mouseX === null || mouseY === null) return;

    const newRotation = Array(rowNumber)
      .fill(0)
      .map(() => Array(colNumber).fill(0));
    const newOpacity = Array(rowNumber)
      .fill(0)
      .map(() => Array(colNumber).fill(0));

    for (let rowIndex = 0; rowIndex < rowNumber; rowIndex++) {
      for (let colIndex = 0; colIndex < colNumber; colIndex++) {
        const ref = arrowRefs.current[rowIndex * colNumber + colIndex];
        if (!ref) continue;

        const boundingBox = ref.getBoundingClientRect();
        const cellCenterX = boundingBox.x + boundingBox.width / 2;
        const cellCenterY = boundingBox.y + boundingBox.height / 2;

        const angle =
          Math.atan2(mouseY - cellCenterY, mouseX - cellCenterX) *
          (180 / Math.PI);
        newRotation[rowIndex][colIndex] = (angle + 360 + 90) % 360;

        const distance = Math.hypot(mouseX - cellCenterX, mouseY - cellCenterY);
        const opacity = Math.max(0, Math.min(1, 1 - distance / 800));
        newOpacity[rowIndex][colIndex] = opacity;
      }
    }

    setRotations(newRotation);
    setOpacity(newOpacity);
  }, [mouseX, mouseY, isMounted, rowNumber, colNumber]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!imageRef.current || !isMounted) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    setRotation(angle * (180 / Math.PI));

    const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    const maxDistance = Math.max(width, height);
    setScale(1 + (distance / maxDistance) * 0.5);
  };

  useEffect(() => {
    if (!isMounted) return;

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMounted]);

  // 마운트되기 전에는 아무것도 렌더링하지 않음
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="image-interaction w-full p-4 sm:p-12">
        <div className="filebox flex justify-center items-center">
          <input
            className="upload-name w-full sm:w-auto"
            placeholder="이미지 파일 업로드"
            readOnly
            value={image ? "파일 선택됨" : ""}
          />
          <label htmlFor="file" className="sm:mt-0 sm:ml-2">
            Custom
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      <section className="w-full h-full">
        <div className="inline-block min-w-full">
          {Array(rowNumber)
            .fill(0)
            .map((_, rowIndex) => (
              <div key={rowIndex} className="flex flex-nowrap">
                {Array(colNumber)
                  .fill(0)
                  .map((_, colIndex) => (
                    <div key={`${rowIndex}-${colIndex}`}>
                      <div
                        ref={(elem) => {
                          if (elem) {
                            arrowRefs.current[rowIndex * colNumber + colIndex] =
                              elem;
                          }
                        }}
                        className="w-full h-full"
                      >
                        <Image
                          className="object-cover"
                          src={image ? image : "/arrow-ui.svg"}
                          alt="arrow"
                          width={100}
                          height={100}
                          priority
                          style={{
                            transform: `rotate(${
                              rotations[rowIndex]?.[colIndex] ?? 0
                            }deg) scale(${scale})`,
                            opacity: opacity[rowIndex]?.[colIndex] ?? 0,
                            transition: "transform 0.1s ease-out",
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </section>
    </>
  );
};

export default MultipleLookup;
