const EditImagePageSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full animate-pulse">
      {/* --- Image Preview and Info --- */}
      <div className="lg:w-2/3 flex flex-col">
        {/* Image preview block */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="w-full h-[300px] bg-gray-200 rounded" />
        </div>

        {/* Author + Download block */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-200 rounded" />
              <div className="w-48 h-4 bg-gray-100 rounded" />
            </div>
            <div className="w-40 h-10 bg-gray-300 rounded" />
          </div>
        </div>
      </div>

      {/* --- Settings Panel --- */}
      <div className="lg:w-1/3">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          {/* Panel heading */}
          <div className="w-40 h-6 bg-gray-300 rounded" />
          {/* Placeholder for control UI */}
          <div className="h-[400px] bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )
}

export default EditImagePageSkeleton
