// Skeleton row component
export const SkeletonRow = ({ index }: { index: number }) => {
    const isOdd = index % 2 === 1
    const backgroundClass = isOdd 
      ? "bg-background" 
      : "bg-gradient-to-r from-background via-[rgb(24,24,27)] to-background"
    
    // Generate deterministic width based on index to avoid hydration issues
    const widthPercentage = 60 + (index * 7) % 40; // Varies between 60-100%
    
    return (
      <div className={`grid grid-cols-12 gap-6 px-6 py-3 ${backgroundClass}`}>
        <div className="col-span-3">
          <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="col-span-2 flex justify-center">
          <div className="h-6 w-12 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="col-span-6">
          <div className="h-4 bg-gray-700 rounded animate-pulse" style={{ width: `${widthPercentage}%` }}></div>
        </div>
        <div className="col-span-1">
          <div className="h-4 w-8 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    )
  };