import Link from "next/link";

export default function App() {
  return (
    <div>
      <h1>
        Welcome to Expo + Next.js <span>👋</span>
      </h1>
      <Link href="/use-worker"> UseWorker Test </Link>
      <Link href="/camera"> Camera Test </Link>
    </div>
  );
}
