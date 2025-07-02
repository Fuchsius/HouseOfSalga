import { ShoppingBag, CreditCard, Truck } from "lucide-react";

export default function CheckoutModal({
  isOpen,
  onClose,
  cartTotal,
  itemCount,
}) {
  if (!isOpen) return null;

  const handleProceedToPayment = () => {
    // Here you would redirect to payment page or payment gateway
    alert("Redirecting to payment gateway...");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-primary">
            Ready to Checkout!
          </h2>
          <p className="text-gray-600 mt-2">Review your order details below</p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Items in cart:</span>
            <span className="font-semibold">{itemCount} items</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Amount:</span>
            <span className="text-xl font-bold text-green-600">
              Rs.{cartTotal.toLocaleString("en-IN")}.00
            </span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <CreditCard className="w-4 h-4 mr-3 text-blue-500" />
            <span>Secure payment processing</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Truck className="w-4 h-4 mr-3 text-green-500" />
            <span>Free delivery on orders above Rs.2000</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleProceedToPayment}
            className="flex-1 py-3 px-4 bg-yellow-400 hover:bg-yellow-500 rounded-xl text-black font-medium"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
