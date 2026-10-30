import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-zinc-600">The page you were looking for has moved or no longer exists.</p>
      <Link href="/" className="mt-6 inline-block font-semibold hover:underline">
        Back to the home page
      </Link>
    </div>
  );
}
