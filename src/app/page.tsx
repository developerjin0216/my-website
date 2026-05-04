export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">My Website</h1>
          <nav className="flex gap-6 text-sm">
            <a href="#features" className="hover:text-blue-600 transition-colors">
              기능
            </a>
            <a href="#about" className="hover:text-blue-600 transition-colors">
              소개
            </a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">
              문의
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-2xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            나만의 웹 서비스를
            <br />
            <span className="text-blue-600">무료로</span> 시작하세요
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
            간단하고 빠르게 만드는 웹사이트.
            <br />
            Next.js + Vercel로 비용 없이 온라인에 배포할 수 있습니다.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#features"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              시작하기
            </a>
            <a
              href="#about"
              className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              더 알아보기
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-zinc-50 dark:bg-zinc-900 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-12">주요 기능</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "빠른 속도",
                desc: "Next.js의 서버 사이드 렌더링으로 빠른 페이지 로딩을 제공합니다.",
                icon: "⚡",
              },
              {
                title: "반응형 디자인",
                desc: "모바일, 태블릿, 데스크톱 어디서든 최적화된 화면을 보여줍니다.",
                icon: "📱",
              },
              {
                title: "무료 배포",
                desc: "Vercel을 통해 무료로 전 세계에 서비스를 배포할 수 있습니다.",
                icon: "🚀",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">소개</h3>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            이 웹사이트는 Next.js와 Tailwind CSS로 제작되었습니다.
            GitHub에 코드를 푸시하면 Vercel이 자동으로 빌드하고 배포합니다.
            별도의 서버 비용 없이 안정적인 웹 서비스를 운영할 수 있습니다.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-zinc-50 dark:bg-zinc-900 px-6 py-20">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">문의</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            궁금한 점이 있으시면 아래로 연락해 주세요.
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            이메일 보내기
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-6">
        <div className="max-w-5xl mx-auto text-center text-sm text-zinc-500">
          © 2026 My Website. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
