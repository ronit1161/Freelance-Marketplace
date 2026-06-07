export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-black text-[#191c1d]">404</h1>
      <p className="text-lg text-[#424754]">This page doesn&#39;t exist yet.</p>
      <a href="/" className="text-[#0058be] font-semibold hover:underline">
        Back to home
      </a>
    </div>
  );
}
