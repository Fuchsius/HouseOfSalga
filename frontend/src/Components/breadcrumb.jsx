export default function Breadcrumb() {
  return (
    <div className="w-full max-w-7xl mx-auto px-0">
      <nav className="font-primary text-sm text-gray-600 flex items-center flex-wrap py-4">
        <span className="hover:text-gray-900 cursor-pointer">Home</span>
        <span className="mx-2">{">"}</span>
        <span className="text-gray-900 font-medium">Shop</span>
      </nav>
    </div>
  );
}
