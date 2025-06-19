import { Shield, CreditCard, Truck, Headphones } from "lucide-react";

export default function Footer() {
  const features = [
    {
      icon: Shield,
      title: "High Quality",
      description: "Crafted from top materials",
    },
    {
      icon: CreditCard,
      title: "Safety Payment",
      description: "Secure payment methods",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Same day & 2-3 days",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated support",
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 w-[1440px] h-[156px] top-[1785px]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <feature.icon className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
