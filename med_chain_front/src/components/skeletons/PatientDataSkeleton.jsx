
import React from 'react';

const SkeletonLine = ({ width, height = 'h-4' }) => (
  <div className={`bg-gray-200 rounded-full animate-pulse ${width} ${height}`}></div>
);

const PatientDataSkeleton = () => {
  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div className="w-2/3 space-y-3">
            <SkeletonLine width="w-1/2" height="h-8" />
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-3/4" />
            <SkeletonLine width="w-4/5" />
          </div>
          <div className="w-1/3 text-right space-y-2">
            <SkeletonLine width="w-1/2 ml-auto" />
            <SkeletonLine width="w-full ml-auto" height="h-3" />
            <div className="mt-2 w-24 h-8 bg-gray-200 rounded ml-auto animate-pulse"></div>
          </div>
        </div>

        {/* Medical History Skeleton */}
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Carnet de Santé</h2>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="w-full space-y-2">
                  <SkeletonLine width="w-1/4" height="h-6" />
                  <SkeletonLine width="w-1/2" height="h-3" />
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <SkeletonLine width="w-full" />
                <SkeletonLine width="w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDataSkeleton;
