import CartItemQuantity from "./cart-quantity";

export default function CartItems({ items, updateQuantity, removeItem }) {
  return (
    <div className="bg-[#F0EADC] border-1 rounded-lg shadow-sm overflow-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center p-4 border-b border-gray-100 last:border-b-0"
        >
          <div className="flex-shrink-0 w-20 h-20 relative">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="ml-4 flex-grow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.size}</p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
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
