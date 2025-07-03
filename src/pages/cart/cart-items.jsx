import CartItemQuantity from "./cart-quantity";
import { Trash2 } from "lucide-react";
export default function CartItems({
  items,
  updateQuantity,
  removeItem,
  loading,
  formatPrice,
}) {
  //  Empty cart state
  if (!items || items.length === 0) {
    return (
      <div className="bg-[#F0EADC] w-full lg:max-w-[645px] h-auto p-6 lg:ml-20 border rounded-lg shadow-sm overflow-hidden">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg font-primary">
            Your cart is empty
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F0EADC] w-full lg:max-w-[645px] h-auto p-6 lg:ml-20 border rounded-lg shadow-sm overflow-hidden">
      {items.map((item) => (
        <div
          key={item._id}
          className="flex items-center p-6 border-b border-[#6C7275] last:border-b-0"
        >
          <div className="flex-shrink-0  relative overflow-hidden">
            <img
              src={item.product?.image || item.image || "/placeholder.svg"}
              alt={item.product?.name || item.name}
              className="object-contain max-w-[93px] max-h-[123px] max-top-[8px] max-left-[28px] "
            />
          </div>

          <div className="ml-4 flex-grow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium text-gray-900 font-primary">
                  {item.product?.name || item.name}{" "}
                </h3>
                <p className="text-sm text-gray-900 font-primary">
                  Size: {item.size}
                </p>
                <h3 className="font-medium text-gray-900 font-primary">
                  Color: {item.color}
                </h3>
              </div>

              {/* Delete Button using lucide-react Trash2 icon */}
              <button
                onClick={() => removeItem(item._id)}
                className="text-red-500 hover:text-red-700"
                disabled={loading}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold">
                {formatPrice(item.priceAtTime || item.price || 0)}
              </span>
              <CartItemQuantity
                quantity={item.quantity}
                onIncrease={() => updateQuantity(item._id, item.quantity + 1)}
                onDecrease={() => updateQuantity(item._id, item.quantity - 1)}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
