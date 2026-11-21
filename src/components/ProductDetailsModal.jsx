import { X, ClipboardList } from "lucide-react";

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  onAddQuote,
}) {
  if (!isOpen || !product) return null;

  const specs = [
    { label: "Product name", value: product.name },
    { label: "Brand", value: product.brand },
    { label: "Variety", value: product.variety },
    { label: "Packaging", value: product.unit },
    {
      label: "Description",
      value: product.summary,
      valueClass: "text-stone-700 md:text-xs leading-relaxed",
    },
    {
      label: "Availability",
      value: product.availability,
      valueClass: "text-amber-600 font-medium",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      {/* Modal Container: Full-screen on mobile, centered rounded card on sm+ */}
      <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full h-[100dvh] sm:h-auto sm:max-w-4xl sm:max-h-[90vh] min-h-0 overflow-hidden flex flex-col md:flex-row relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 inline-flex min-h-11 min-w-11 items-center justify-center bg-white/90 backdrop-blur rounded-full p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 shadow-sm transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left / Top: Product Image */}
        <div className="h-56 sm:h-64 shrink-0 md:h-auto md:w-2/5 bg-stone-100 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Subtle bottom gradient for visual depth / future overlays */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 via-black/15 to-transparent pointer-events-none" />

          <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 bg-emerald-800 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
            {product.category}
          </div>
        </div>

        {/* Right / Bottom: Scrollable Content + Sticky Action Bar */}
        <div className="min-h-0 flex-1 md:w-3/5 flex flex-col bg-white">
          {/* Scrollable Details Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
              {product.name}
            </h2>
            <p className="text-sm text-stone-500 mb-6 md:mb-8">
              {product.summary}
            </p>

            {/* Mobile View: Stacked Information Cards (< md) */}
            <div className="md:hidden border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden mb-2">
              {specs.map((spec) => (
                <div key={spec.label} className="p-3.5 bg-white">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    {spec.label}
                  </dt>
                  <dd
                    className={`text-sm text-stone-900 ${spec.valueClass || ""}`}
                  >
                    {spec.value}
                  </dd>
                </div>
              ))}
              <div className="p-3.5 bg-emerald-50/60">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
                  Enquiries
                </dt>
                <dd className="text-sm text-emerald-900 font-bold">
                  Request a quotation
                </dd>
              </div>
            </div>

            {/* Desktop View: Two-Column Specification Table (md+) */}
            <div className="hidden md:block border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full table-fixed text-sm text-left">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4 font-bold text-stone-900 w-1/3">
                      Information
                    </th>
                    <th className="py-3 px-4 font-bold text-stone-900">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {specs.map((spec) => (
                    <tr key={spec.label} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-4 text-stone-500 font-medium">
                        {spec.label}
                      </td>
                      <td
                        className={`py-3 px-4 text-stone-900 ${
                          spec.valueClass || ""
                        }`}
                      >
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-50/50">
                    <td className="py-3 px-4 text-emerald-800 font-medium">
                      Enquiries
                    </td>
                    <td className="py-3 px-4 text-emerald-800 font-bold">
                      Request a quotation
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sticky / Fixed Action Area */}
          <div className="shrink-0 p-4 sm:px-6 md:px-8 lg:px-10 md:py-5 bg-white border-t border-stone-200 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] md:shadow-none">
            <button
              onClick={() => {
                onAddQuote(product);
                onClose();
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 transition shadow-md cursor-pointer"
            >
              <ClipboardList className="w-5 h-5" />
              Add to Quote Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}