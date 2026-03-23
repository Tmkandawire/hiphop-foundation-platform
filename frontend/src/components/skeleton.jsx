export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-[2.5rem] border border-gray-100 space-y-4"
        >
          <div className="w-full h-48 bg-gray-200 rounded-[2rem] animate-pulse"></div>
          <div className="h-6 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="h-4 w-full bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
