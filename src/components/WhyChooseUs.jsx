import { Map, ShieldCheck, Sprout, HeartHandshake } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import ScrollItem from "./ScrollItem";

export default function WhyChooseUs() {
  const features = [
    {
      id: "nationwide",
      Icon: Map,
      title: "Nationwide Presence",
      description: "Serving farmers across multiple locations in Zimbabwe.",
      iconColor: "text-sky-700",
      wrapperBg: "bg-sky-100/50 group-hover:bg-sky-100",
      cardHover: "hover:border-sky-200",
    },
    {
      id: "trusted-brands",
      Icon: ShieldCheck,
      title: "Trusted Agricultural Brands",
      description:
        "Working with established suppliers to provide proven agricultural products.",
      iconColor: "text-emerald-700",
      wrapperBg: "bg-emerald-100/50 group-hover:bg-emerald-100",
      cardHover: "hover:border-emerald-200",
    },
    {
      id: "diverse-range",
      Icon: Sprout,
      title: "Diverse Product Range",
      description:
        "Comprehensive solutions for both crop farming and animal husbandry.",
      iconColor: "text-amber-700",
      wrapperBg: "bg-amber-100/50 group-hover:bg-amber-100",
      cardHover: "hover:border-amber-200",
    },
    {
      id: "customer-service",
      Icon: HeartHandshake,
      title: "Customer-Focused Service",
      description:
        "Supporting farmers with product guidance and practical agricultural solutions.",
      iconColor: "text-rose-700",
      wrapperBg: "bg-rose-100/50 group-hover:bg-rose-100",
      cardHover: "hover:border-rose-200",
    },
  ];

  return (
    <section
      id="why-choose-us"
      className="py-20 bg-white border-y border-stone-100"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Why Choose Farmbiz?
            </h2>
            <p className="text-stone-500 mt-4 max-w-2xl mx-auto text-sm md:text-base">
              Delivering consistency, quality, and results to meet the
              expectations of commercial and small-scale farmers alike.
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Cards Grid */}
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(
              ({
                id,
                Icon,
                title,
                description,
                iconColor,
                wrapperBg,
                cardHover,
              }) => (
                <ScrollItem key={id} className="h-full">
                  <div
                    className={`bg-stone-50 border border-stone-100 rounded-2xl p-8 hover:shadow-lg ${cardHover} transition-all duration-300 group h-full`}
                  >
                    {/* Icon Wrapper */}
                    <div
                      className={`w-14 h-14 ${wrapperBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300`}
                    >
                      <Icon className={`w-7 h-7 ${iconColor}`} />
                    </div>

                    {/* Text Content */}
                    <h3 className="text-lg font-bold text-stone-900 mb-3">
                      {title}
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </ScrollItem>
              ),
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
