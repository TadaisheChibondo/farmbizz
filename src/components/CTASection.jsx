import { ArrowRight, PhoneCall } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24 bg-emerald-950 overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-800 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
          Let's Grow Together.
        </h2>
        <p className="text-emerald-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Looking for quality agricultural products or expert guidance? Get in
          touch with the Farmbiz team today and take your farming business to
          the next level.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-8 py-3.5 text-base font-bold transition shadow-lg cursor-pointer">
            <PhoneCall className="w-5 h-5" />
            Contact Us
          </button>
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-transparent border border-emerald-500 hover:bg-emerald-800/50 text-white px-8 py-3.5 text-base font-bold transition cursor-pointer">
            Explore Products
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
