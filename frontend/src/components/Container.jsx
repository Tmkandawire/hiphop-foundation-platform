export default function Container({ children, className = "" }) {
  return (
    <div
      className={`max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-10 ${className}`}
    >
      {children}
    </div>
  );
}
