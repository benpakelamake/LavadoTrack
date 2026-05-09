import { useState } from "react";

const PRECIOS = {
  lavado: 150,
  planchado: 100,
  "lavado+planchado": 220,
};

const OrdenForm = ({ hook, clientesHook }) => {
  const { addOrden } = hook;
  const { clientes } = clientesHook;

  const [clienteNombre, setClienteNombre] = useState("");
  const [servicio, setServicio] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteNombre || !servicio) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await addOrden({ cliente: clienteNombre, servicio });
      setClienteNombre("");
      setServicio("");
      setExito(true);
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      setError("Error al crear la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h2 className="font-bold text-gray-800">Nueva Orden</h2>
          <p className="text-xs text-gray-400">Completa los campos para registrar</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      {exito && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          ¡Orden creada exitosamente!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          {clientes.length > 0 ? (
            <select
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.nombre}>
                  {c.nombre} — {c.telefono}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(PRECIOS).map(([key, precio]) => {
              const labels = {
                lavado: "Lavado",
                planchado: "Planchado",
                "lavado+planchado": "Lavado + Planchado",
              };
              const isSelected = servicio === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setServicio(key)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  <div>{labels[key]}</div>
                  <div className={`text-xs mt-0.5 ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                    RD${precio}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? "Creando orden..." : "Crear Orden"}
        </button>

      </form>
    </div>
  );
};

export default OrdenForm;