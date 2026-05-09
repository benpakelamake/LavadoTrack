import { useState, useEffect } from "react";
import OrdenForm from "./OrdenForm";

const NuevaOrdenModal = ({ hook, clientesHook }) => {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setAbierto(false);
    };
    if (abierto) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [abierto]);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [abierto]);

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Nueva Orden
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setAbierto(false)}
          />
          <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setAbierto(false)}
              className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-1.5 shadow-md text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <OrdenForm
              hook={hook}
              clientesHook={clientesHook}
              onSuccess={() => setAbierto(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default NuevaOrdenModal;