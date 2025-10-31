
import React from 'react';

const SkeletonLine = ({ width, height = 'h-4' }) => (
  <div className={`bg-gray-200 rounded-full animate-pulse ${width} ${height}`}></div>
);

const DashboardSkeleton = () => {
  return (
    <div className="container mx-auto py-10">
      {/* Title Skeleton */}
      <SkeletonLine width="w-1/3" height="h-8" />

      {/* Quick Actions Skeleton - These are static, so no skeleton needed, but we match the layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
        <div className="bg-gray-200 p-8 rounded-lg shadow-lg h-36 animate-pulse"></div>
        <div className="bg-gray-200 p-8 rounded-lg shadow-lg h-36 animate-pulse"></div>
      </div>

      {/* Recent Activity Skeleton */}
      <div>
        <SkeletonLine width="w-1/4" height="h-7" />
        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
          <SkeletonLine width="w-1/3" height="h-6" />
          <ul className="space-y-4 mt-4">
            {[...Array(3)].map((_, i) => (
              <li key={i} className="flex justify-between items-center p-3">
                <div className="w-2/3 space-y-2">
                  <SkeletonLine width="w-1/2" />
                  <SkeletonLine width="w-1/3" height="h-3" />
                </div>
                <div className="w-1/3">
                    <SkeletonLine width="w-3/4 ml-auto" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
