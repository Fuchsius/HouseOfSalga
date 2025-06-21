export default function Breadcrumb() {
  return (
    <nav className="font-primary text-sm text-gray-600 ml-4 lg:ml-20 flex items-center flex-wrap">
      <span className="hover:text-gray-900 cursor-pointer">Home</span>
      <span className="mx-2">{">"}</span>
      <span className="text-gray-900 font-medium">Shop</span>
    </nav>
  );
}
