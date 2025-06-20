export default function Footer() {
  const features = [
    {
      title: "High Quality",
      description: "Crafted from top materials",
      image: "../public/quality.png",
    },
    {
      title: "Safety Payment",
      description: "Secure",
      image: "../public/safe.png",
    },
    {
      title: "Fast Delivery",
      description: "deliver in 2-3 days",
      image: "../public/delivery.png",
    },
    {
      title: "24/7 Support",
      description: "Dedicated support",
      image: "../public/support.png",
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 w-full py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div>
                <img src={feature.image} className="w-12 h-12"></img>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm md:text-base font-primary">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 font-primary">
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
