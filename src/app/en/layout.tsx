// 영문 섹션의 언어 표시.
//
// 루트 레이아웃이 <html lang="ko">를 내보내는데, App Router에서 <html>을 그리는
// 레이아웃은 루트 하나뿐입니다. 거기서 경로를 보고 언어를 바꾸려면 headers()를
// 읽어야 하고, 그 순간 254개 정적 페이지가 전부 요청 시 렌더링으로 바뀝니다.
// 그 대가를 치를 만한 이득이 아닙니다.
//
// lang은 어느 요소에나 붙을 수 있고 그 아래 전체에 적용됩니다. 그래서 영문
// 구간만 감싸 표시합니다. display:contents(=className="contents")라 박스가
// 생기지 않아 기존 레이아웃에 영향을 주지 않습니다.
export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="en" className="contents">
      {children}
    </div>
  );
}
