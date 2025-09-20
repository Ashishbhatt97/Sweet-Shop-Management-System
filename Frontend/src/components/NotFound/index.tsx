export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-neutral-950 text-neutral-50 text-center">
      <div>
        <h1 className="text-[150px] font-extrabold">404</h1>
        <p className="text-2xl">Oops! Page not found.</p>
        <p className="mt-2 text-neutral-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-8 py-2 text-lg font-semibold text-neutral-950 bg-white rounded-lg hover:bg-neutral-300"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
