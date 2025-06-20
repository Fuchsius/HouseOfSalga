import CartItemQuantity from "./cart-quantity";
import { Trash2 } from "lucide-react";

export default function CartItems({ items, updateQuantity, removeItem }) {
  return (
    <div className="bg-[#F0EADC] w-[645px] h-[532px] top-[320px] left-[160px] pt-[20px] pr-[24px] pb-[20px] pl-[24px] ml-40 border-1 rounded-lg shadow-sm overflow-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center p-6 border-b border-[#6C7275] last:border-b-0"
        >
          <div className="flex-shrink-0  relative overflow-hidden">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="object-contain max-w-[93px] max-h-[123px] max-top-[8px] max-left-[28px] "
            />
          </div>

          <div className="ml-4 flex-grow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium text-gray-900 font-primary">
                  {item.name}
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
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold">
                Rs.{item.price.toLocaleString("en-IN")}.00
              </span>
              <CartItemQuantity
                quantity={item.quantity}
                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
