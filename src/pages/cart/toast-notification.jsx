import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

export default function ToastNotification({
  message,
  type = "success",
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center p-4 rounded-lg shadow-lg ${
          type === "success"
            ? "bg-green-500 text-white"
            : "bg-blue-500 text-white"
        }`}
      >
        <CheckCircle className="w-5 h-5 mr-3" />
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-4 hover:bg-white/20 rounded p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
