import Link from "next/link";


export default function Dashboard() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">👤 User Dashboard</h1>

      <div className="grid gap-4">
        <Link href="/user/pass/history" className="bg-blue-500 text-white p-3 rounded text-center">
          📜 View Pass History
        </Link>

        <Link href="/user/pass" className="bg-green-500 text-white p-3 rounded text-center">
          🎫 Buy a New Pass
        </Link>
      </div>
    </div>
  );
}
