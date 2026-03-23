export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) {
  const baseStyles =
    "relative inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-sm transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:pointer-events-none overflow-hidden";

  const variants = {
    // Deep Royal Blue with Shadow
    primary:
      "bg-[#145CF3] text-white shadow-lg shadow-[#145CF3]/20 hover:bg-[#1149c2] hover:shadow-xl hover:-translate-y-0.5",

    // Soft Blue background with Blue text (The 'Secondary' look in the Dribbble shot)
    outline:
      "bg-[#EBF2FC] text-[#145CF3] hover:bg-[#145CF3] hover:text-white shadow-sm",

    // Minimalist Ghost
    ghost:
      "bg-transparent text-[#190E0E]/60 hover:text-[#145CF3] hover:bg-[#EBF2FC]/50",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="loading loading-spinner loading-xs"></span>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
