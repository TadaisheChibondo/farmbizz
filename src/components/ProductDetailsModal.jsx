import { X, ClipboardList } from "lucide-react";

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  onAddQuote,
}) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] min-h-0 overflow-hidden flex flex-col md:flex-row relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 inline-flex min-h-11 min-w-11 items-center justify-center bg-white/90 backdrop-blur rounded-full p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image */}
        <div className="h-36 shrink-0 sm:h-48 md:h-auto md:w-2/5 bg-stone-100 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-emerald-800 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
            {product.category}
          </div>
        </div>

        {/* Right Side: Product Information Table */}
        <div className="min-h-0 flex-1 md:w-3/5 p-4 sm:p-6 md:p-10 overflow-y-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
            {product.name}
          </h2>
          <p className="text-sm text-stone-500 mb-8">{product.summary}</p>

          {/* Specification Table - Based directly on the provided layout */}
          <div className="border border-stone-200 rounded-xl overflow-x-auto mb-8">
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
                <tr className="hover:bg-stone-50 transition">
                  <td className="py-3 px-4 text-stone-500 font-medium">
                    Product name
                  </td>
                  <td className="py-3 px-4 text-stone-900">{product.name}</td>
                </tr>
                <tr className="hover:bg-stone-50 transition">
                  <td className="py-3 px-4 text-stone-500 font-medium">
                    Brand
                  </td>
                  <td className="py-3 px-4 text-stone-900">{product.brand}</td>
                </tr>
                <tr className="hover:bg-stone-50 transition">
                  <td className="py-3 px-4 text-stone-500 font-medium">
                    Variety
                  </td>
                  <td className="py-3 px-4 text-stone-900">
                    {product.variety}
                  </td>
                </tr>
                <tr className="hover:bg-stone-50 transition">
                  <td className="py-3 px-4 text-stone-500 font-medium">
                    Packaging
                  </td>
                  <td className="py-3 px-4 text-stone-900">{product.unit}</td>
                </tr>
                <tr className="hover:bg-stone-50 transition">
                  <td className="py-3 px-4 text-stone-500 font-medium">
                    Description
                  </td>
                  <td className="py-3 px-4 text-stone-900 text-xs leading-relaxed">
                    {product.summary}
                  </td>
                </tr>
                <tr className="hover:bg-stone-50 transition">
                  <td className="py-3 px-4 text-stone-500 font-medium">
                    Availability
                  </td>
                  <td className="py-3 px-4 text-amber-600 font-medium">
                    {product.availability}
                  </td>
                </tr>
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

          {/* Action Area */}
          <button
            onClick={() => {
              onAddQuote(product);
              onClose(); // Optional: close modal after adding
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 transition shadow-md cursor-pointer"
          >
            <ClipboardList className="w-5 h-5" />
            Add to Quote Request
          </button>
        </div>
      </div>
    </div>
  );
}
