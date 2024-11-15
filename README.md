# 🏹 Arrow UI

Arrow UI는 마우스나 터치 움직임에 반응하는 화살표 그리드를 생성하는 동적이고 인터랙티브한 React 컴포넌트입니다. 이 시각적으로 매력적인 컴포넌트는 Next.js 프로젝트에 쉽게 통합되어 상호작용성과 시각적 매력을 더할 수 있습니다.

## ✨ 특징

- 🔄 커서나 터치 포인트를 따라 회전하는 화살표 그리드 생성
- 🔧 사용자 정의 가능한 그리드 크기 (행과 열)
- 🎬 화살표 회전에 대한 부드러운 애니메이션
- 🌫️ 커서와의 거리에 따른 투명도 변화
- 📱 마우스와 터치 이벤트 모두에 작동하는 반응형 디자인
- 🛡️ 향상된 타입 안전성을 위한 TypeScript 사용

## 🚀 설치

프로젝트에 Arrow UI를 사용하려면 다음 단계를 따르세요:

1. 📥 이 저장소를 클론하거나 `MultipleLookup.tsx` 컴포넌트를 프로젝트에 복사합니다.
2. 📦 필요한 의존성(`next`, `react`, `react-dom`)이 설치되어 있는지 확인합니다.
3. 🖼️ 화살표 이미지(`arrow-ui.svg`)를 Next.js 프로젝트의 public 디렉토리에 배치합니다.

## 🛠️ 사용법

Next.js 애플리케이션에서 Arrow UI 컴포넌트를 사용하는 방법:

```jsx
import MultipleLookup from './components/MultipleLookup';

export default function Home() {
  const rowNumber = 10; // 행의 수
  const colNumber = 10; // 열의 수

  return (
    <main className="flex flex-wrap justify-center h-screen w-screen bg-black">
      <MultipleLookup colNumber={colNumber} rowNumber={rowNumber} />
    </main>
  );
}
```

## 🎛️ Props

`MultipleLookup` 컴포넌트는 다음 props를 받습니다:

- 📏 `rowNumber`: 화살표 그리드의 행 수
- 📐 `colNumber`: 화살표 그리드의 열 수

## 🔍 작동 원리

1. 🏗️ 컴포넌트는 지정된 행과 열 수에 따라 화살표 그리드를 생성합니다.
2. 👀 `useEffect` 훅을 사용하여 화면 전체의 마우스 또는 터치 움직임을 추적합니다.
3. 🔄 그리드의 각 화살표에 대해:
   - 📐 화살표의 위치와 커서 위치 사이의 각도를 기반으로 회전을 계산합니다.
   - 🌫️ 화살표와 커서 사이의 거리에 따라 투명도를 결정합니다.
4. ⚡ 컴포넌트는 커서가 움직일 때 실시간으로 각 화살표의 회전과 투명도를 업데이트합니다.

## 🎨 커스터마이징

다음을 수정하여 Arrow UI의 외관과 동작을 사용자 정의할 수 있습니다:

- 🖼️ public 디렉토리의 `arrow-ui.svg`를 교체하여 화살표 이미지를 변경합니다.
- 🔧 `useEffect` 훅의 투명도 계산을 조정하여 페이드 효과를 변경합니다.
- 🎭 컴포넌트의 CSS 클래스를 수정하여 레이아웃과 스타일을 변경합니다.

## 📜 라이선스

[여기에 선택한 라이선스를 추가하세요]

## 🤝 기여

기여는 언제나 환영합니다! Pull Request를 자유롭게 제출해 주세요.
