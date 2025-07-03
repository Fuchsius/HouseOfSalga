import qualityImg from "../../Assets/quality.PNG";
import safeImg from "../../Assets/safe.PNG";
import deliveryImg from "../../Assets/delivery.PNG";
import supportImg from "../../Assets/support.PNG";

export default function Footer() {
  const features = [
    {
      title: "High Quality",
      description: "Crafted from top materials",
      image: qualityImg,
    },
    {
      title: "Safety Payment",
      description: "Secure",
      image: safeImg,
    },
    {
      title: "Fast Delivery",
      description: "deliver in 2-3 days",
      image: deliveryImg,
    },
    {
      title: "24/7 Support",
      description: "Dedicated support",
      image: supportImg,
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 w-full py-6 z-10">
      <div className="container mx-auto px-4 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-white">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 bg-white pb-4">
              <div>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-12 h-12"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm md:text-base font-primary bg-white">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 font-primary bg-white">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
