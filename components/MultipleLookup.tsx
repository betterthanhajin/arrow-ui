import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

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
  const [rotations, setRotations] = useState(
    Array(rowNumber).fill(Array(colNumber).fill(0))
  );

  const [opacity, setOpacity] = useState(
    Array(rowNumber).fill(Array(colNumber).fill(0))
  );
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const arrowRefs = useRef<HTMLDivElement[]>([]);
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5; // 초기 볼륨 설정
      audio.load(); // 오디오 로드
      audio.oncanplaythrough = () => {
        setAudioLoaded(true);
        console.log("오디오 로딩 완료");
      };
      audio.onerror = (e) => {
        console.error("오디오 로딩 실패:", e);
      };
    }
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((e) => console.error("오디오 재생 실패:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        setMouseX(e.clientX);
        setMouseY(e.clientY);
      } else if (e instanceof TouchEvent && e.touches.length > 0) {
        setMouseX(e.touches[0].clientX);
        setMouseY(e.touches[0].clientY);
      }
    };
    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("touchmove", handleMouseMove);
    return () => {
      document.body.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("touchmove", handleMouseMove);
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
        const opacity = Math.max(0, Math.min(1, 1 - distance / 800));
        if (typeof newOpacity[rowIndex] === "undefined")
          newOpacity[rowIndex] = [];
        newOpacity[rowIndex][colIndex] = opacity;
      }
    }
    setRotations(newRotation);
    setOpacity(newOpacity);
    // 리액트 불변성 배열 할당
  }, [mouseX, mouseY]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (imageRef.current) {
      const { left, top, width, height } =
        imageRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // 회전 계산
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      setRotation(angle * (180 / Math.PI));

      // 크기 변화 계산
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const maxDistance = Math.max(width, height);
      setScale(1 + (distance / maxDistance) * 0.5); // 최대 1.5배까지 확대
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
      <audio src="/music/buddy.mp3" ref={audioRef} loop />
      <button
        onClick={toggleAudio}
        className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!audioLoaded}
      >
        {isPlaying ? "음악 중지" : "음악 재생"}
      </button>
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
                            transform: `rotate(${rotations[rowIndex][colIndex]}deg) scale(${scale})`,
                            opacity: opacity[rowIndex][colIndex],
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
