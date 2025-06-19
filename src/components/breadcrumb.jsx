export default function Breadcrumb() {
  return (
    <nav className="font-primary text-sm text-gray-600">
      <span className="hover:text-gray-900 cursor-pointer">Home</span>
      <span className="mx-2">{">"}</span>
      <span className="text-gray-900 font-medium">Shop</span>
    </nav>
  );
}
