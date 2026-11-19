import { useState } from "react";
import { X, Trash2, CheckCircle2 } from "lucide-react";
import { TOWNS } from "../data/branches";

export default function QuoteDrawer({
  isOpen,
  onClose,
  items,
  onRemove,
  onClear,
}) {
  const [branch, setBranch] = useState("Harare");
  const [buyerName, setBuyerName] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setBuyerName("");
    setPhoneOrEmail("");
    onClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between overflow-y-auto shadow-xl">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <h3 className="text-lg font-bold text-stone-900">
              Quote &amp; Stock Inquiry
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto mb-3" />
              <p className="font-bold text-stone-900">
                Prototype Inquiry Captured
              </p>
              <p className="text-sm text-stone-600 mt-1">
                In production, this would route to {branch} sales/dispatch or
                email/WhatsApp.
              </p>
              <button
                onClick={resetAndClose}
                className="mt-6 rounded-lg bg-emerald-800 text-white text-sm font-semibold px-4 py-2 cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-stone-500 py-10 text-center">
              No items added yet. Select inputs from the catalog to build a
              quote request.
            </p>
          ) : (
            <>
              <ul className="divide-y divide-stone-100 my-4">
                {items.map((item, idx) => (
                  <li
                    key={`${item.id}-${idx}`}
                    className="py-3 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-500">{item.unit}</p>
                    </div>
                    <button
                      onClick={() => onRemove(idx)}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>

              <form
                onSubmit={handleSubmit}
                className="space-y-3 pt-4 border-t border-stone-200"
              >
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Preferred Town / Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                  >
                    {TOWNS.filter((t) => t !== "All").map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Name / Farm or Organisation
                  </label>
                  <input
                    required
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g., Chibondo Farms"
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Phone or Email
                  </label>
                  <input
                    required
                    type="text"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="+263 77..."
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold py-2.5 transition cursor-pointer"
                >
                  Submit Sample Quote Request
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
