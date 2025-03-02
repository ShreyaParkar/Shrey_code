"use client";

import MotionCard from "@/components/MotionCard";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-6">
      {/* Dashboard Header */}
      <h1 className="text-4xl font-extrabold mt-6 mb-6 text-gray-900 dark:text-gray-200 text-center">
        Admin Dashboard
      </h1>

      {/* Cards Section - Positioned Below Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        <MotionCard
          title="Manage Buses"
          description="Add, Edit, and Remove Buses"
          href="/admin/buses"
          bgColor="bg-blue-500 dark:bg-blue-600"
        />
        <MotionCard
          title="Manage Stations"
          description="Add, Edit, and Remove Stations"
          href="/admin/stations"
          bgColor="bg-green-500 dark:bg-green-600"
        />
        <MotionCard
          title="Manage Routes"
          description="Add, Edit, and Remove Routes"
          href="/admin/routes"
          bgColor="bg-yellow-500 dark:bg-yellow-600"
        />
      </div>
    </div>
  );
}
