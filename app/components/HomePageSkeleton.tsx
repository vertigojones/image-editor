export const HomePageSkeleton = () => {
  return (
    <div className="flex-shrink-0 w-64 snap-start bg-white border border-gray-200 rounded-lg shadow-sm p-3 animate-pulse">
      <div className="h-40 w-full bg-gray-200 rounded mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  )
}
