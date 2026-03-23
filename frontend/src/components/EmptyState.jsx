export default function EmptyState({
  message = "No data found",
  icon = "🔍",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-[#F8F9FB] rounded-[3rem] border-2 border-dashed border-[#EBF2FC] text-center animate-fade-in">
      {/* Icon with Soft Blue Glow */}
      <div className="w-20 h-20 rounded-full bg-white shadow-xl shadow-[#145CF3]/5 flex items-center justify-center text-4xl mb-6">
        {icon}
      </div>

      {/* Message with High-Tech Typography */}
      <h3 className="text-xl font-bold text-[#190E0E] font-poppins mb-2">
        Nothing to show yet
      </h3>
      <p className="text-[#190E0E]/50 max-w-xs mx-auto leading-relaxed">
        {message}
      </p>

      {/* Optional Action Button (e.g., "Add New Product") */}
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-8 px-8 py-3 bg-[#145CF3] text-white rounded-full font-bold shadow-lg shadow-[#145CF3]/20 hover:scale-105 transition-transform"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
