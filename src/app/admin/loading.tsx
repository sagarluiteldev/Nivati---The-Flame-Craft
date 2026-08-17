export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <img 
          src="/images/logo.png" 
          alt="Nivati Logo" 
          className="h-16 w-16 object-contain animate-pulse"
        />
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#283322] border-t-transparent" />
          <span className="font-serif text-sm text-[#283322]/70 font-semibold tracking-wide">
            Loading Nivati Business Panel...
          </span>
        </div>
      </div>
    </div>
  );
}
