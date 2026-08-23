import Image from "next/image";
const PaymentMerchants = () => {
  const merchants = [
    {
      name: "bKash",
      img: "/images/bkash01.png",
      number: "01550-666900",
    },
    {
      name: "Nagad",
      img: "/images/nagad01.png",
      number: "01550-666900",
    },
    {
      name: "Rocket",
      img: "/images/roket01.png",
      number: "01550-666900",
    },
  ];

  return (
    <section className="md:pb-8 pb-6 pt-0 px-4 bg-secondary text-white">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-white md:mb-10 mb-4">
          Our Payment Merchants
        </h2>
        <div className="max-w-full md:max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-3 gap-2">
          {merchants?.map((merchant) => (
            <div key={merchant?.name} className="">
              <div className="w-full h-18 relative py-2">
                <Image
                  src={merchant?.img}
                  alt={merchant?.name}
                  fill
                  className="sm:object-cover object-contain sm:rounded-2xl rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentMerchants;
