export default function CartItemQuantity({
  quantity,
  onIncrease,
  onDecrease,
  disabled,
}) {
  return (
    <div className="flex items-center border border-gray-300 rounded">
      <button
        onClick={onDecrease}
        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        -
      </button>
      <span className="px-3 py-1 text-center w-10">{quantity}</span>
      <button
        onClick={onIncrease}
        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
}
