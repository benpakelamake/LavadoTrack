import { useState } from "react";

const ESTADOS = ["todos", "recibida", "en proceso", "lista", "entregada"];

const PRECIOS = {
  lavado: 150,
  planchado: 100,
  "lavado+planchado": 220,
};

const estadoStyles = {
  recibida:     { badge: "bg-gray-100 text-gray-600",     dot: "bg-gray-400" },
  "en proceso": { badge: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  lista:        { badge: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  entregada:    { badge: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
};

const formatFecha = (fecha) => {
  if (!fecha) return "—";
  const d = fecha.toDate ? fecha.toDate() : new Date(fecha);
  return d.toLocaleString("es-DO", {
    day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
};

const formatFechaCompleta = (fecha) => {
  if (!fecha) return "—";
  const d = fecha.toDate ? fecha.toDate() : new Date(fecha);
  return d.toLocaleString("es-DO", {
    weekday: "long", year: "numeric",
    month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const servicioLabel = {
  lavado: "Lavado",
  planchado: "Planchado",
  "lavado+planchado": "Lavado + Planchado",
};

// ── Función de impresión ─────────────────────────────────────────────────────
const imprimirFactura = (orden) => {
  const precio = PRECIOS[orden.servicio] || 0;
  const fecha = formatFechaCompleta(orden.createdAt);

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8"/>
      <title>Factura ${orden.ticket}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: #fff;
          color: #1a1a1a;
          padding: 40px;
          max-width: 420px;
          margin: 0 auto;
        }

        /* CABECERA */
        .header {
          text-align: center;
          border-bottom: 2px dashed #d1d5db;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .logo {
          font-size: 24px;
          font-weight: 800;
          color: #2563eb;
          letter-spacing: -0.5px;
        }
        .logo span { color: #1e40af; }
        .subtitulo {
          font-size: 11px;
          color: #6b7280;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* TICKET */
        .ticket-num {
          text-align: center;
          margin: 16px 0;
        }
        .ticket-num .num {
          font-size: 28px;
          font-weight: 900;
          font-family: monospace;
          color: #111827;
          letter-spacing: 2px;
        }
        .ticket-num .label {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* DETALLES */
        .seccion {
          margin-bottom: 16px;
        }
        .seccion-titulo {
          font-size: 10px;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 4px;
        }
        .fila {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
          font-size: 13px;
        }
        .fila .key { color: #6b7280; }
        .fila .val { font-weight: 600; color: #111827; text-align: right; }

        /* TOTAL */
        .total-box {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 10px;
          padding: 14px 16px;
          margin: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .total-box .total-label {
          font-size: 13px;
          font-weight: 700;
          color: #1d4ed8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .total-box .total-monto {
          font-size: 26px;
          font-weight: 900;
          color: #1d4ed8;
        }

        /* ESTADO */
        .estado-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: capitalize;
          background: #f3f4f6;
          color: #374151;
        }
        .estado-entregada { background: #ede9fe; color: #6d28d9; }
        .estado-lista     { background: #dcfce7; color: #15803d; }
        .estado-proceso   { background: #dbeafe; color: #1d4ed8; }

        /* PIE */
        .footer {
          text-align: center;
          border-top: 2px dashed #d1d5db;
          padding-top: 16px;
          margin-top: 20px;
        }
        .footer p { font-size: 11px; color: #9ca3af; line-height: 1.8; }
        .footer .gracias {
          font-size: 14px;
          font-weight: 700;
          color: #374151;
          margin-bottom: 4px;
        }

        @media print {
          body { padding: 20px; }
          @page { margin: 10mm; size: 80mm auto; }
        }
      </style>
    </head>
    <body>

      <div class="header">
        <div class="logo">DEYPA<span>Lavado</span></div>
        <div class="subtitulo">Comprobante de servicio</div>
      </div>

      <div class="ticket-num">
        <div class="label">N° de Ticket</div>
        <div class="num">${orden.ticket}</div>
      </div>

      <div class="seccion">
        <div class="seccion-titulo">Cliente</div>
        <div class="fila">
          <span class="key">Nombre</span>
          <span class="val">${orden.cliente}</span>
        </div>
      </div>

      <div class="seccion">
        <div class="seccion-titulo">Servicio</div>
        <div class="fila">
          <span class="key">Tipo</span>
          <span class="val">${servicioLabel[orden.servicio] || orden.servicio}</span>
        </div>
        <div class="fila">
          <span class="key">Estado</span>
          <span class="val">
            <span class="estado-badge estado-${orden.estado === 'en proceso' ? 'proceso' : orden.estado}">
              ${orden.estado}
            </span>
          </span>
        </div>
        <div class="fila">
          <span class="key">Fecha</span>
          <span class="val" style="font-size:11px">${fecha}</span>
        </div>
      </div>

      <div class="total-box">
        <span class="total-label">Total</span>
        <span class="total-monto">RD$${precio.toLocaleString("es-DO")}</span>
      </div>

      <div class="footer">
        <p class="gracias">¡Gracias por su preferencia!</p>
        <p>Guarde este comprobante para<br/>reclamar su pedido.</p>
      </div>

    </body>
    </html>
  `;

  const ventana = window.open("", "_blank", "width=480,height=700");
  ventana.document.write(html);
  ventana.document.close();
  ventana.focus();
  setTimeout(() => ventana.print(), 400);
};

// ── Componente principal ─────────────────────────────────────────────────────
const OrdenList = ({ hook }) => {
  const { ordenes, updateEstado, deleteOrden, loading } = hook;
  const [filtro, setFiltro] = useState("todos");

  const ordenesFiltradas = filtro === "todos"
    ? ordenes
    : ordenes.filter((o) => o.estado === filtro);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ENCABEZADO + FILTROS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Órdenes</h2>
          <p className="text-xs text-gray-400">{ordenes.length} en total</p>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {ESTADOS.map((e) => (
            <button
              key={e}
              onClick={() => setFiltro(e)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                filtro === e
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300"
              }`}
            >
              {e === "todos" ? "Todos" : e}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA */}
      {ordenesFiltradas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-sm">
            No hay órdenes {filtro !== "todos" ? `con estado "${filtro}"` : ""}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ordenesFiltradas.map((o) => {
            const style = estadoStyles[o.estado] || estadoStyles.recibida;
            return (
              <div
                key={o.id}
                className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* DOT DE ESTADO */}
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.dot} hidden sm:block`} />

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-gray-400">{o.ticket}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                      {o.estado}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800 mt-1">{o.cliente}</p>
                  <p className="text-sm text-gray-500">{servicioLabel[o.servicio] || o.servicio}</p>
                  <p className="text-xs text-gray-300 mt-1">{formatFecha(o.createdAt)}</p>
                </div>

                {/* CAMBIAR ESTADO */}
                <div className="shrink-0">
                  <select
                    value={o.estado}
                    onChange={(e) => updateEstado(o.id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="recibida">Recibida</option>
                    <option value="en proceso">En proceso</option>
                    <option value="lista">Lista</option>
                    <option value="entregada">Entregada</option>
                  </select>
                </div>

                {/* IMPRIMIR */}
                <button
                  onClick={() => imprimirFactura(o)}
                  className="shrink-0 p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                  title="Imprimir factura"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>

                {/* ELIMINAR */}
                <button
                  onClick={() => {
                    if (window.confirm(`¿Eliminar la orden ${o.ticket}?`)) {
                      deleteOrden(o.id);
                    }
                  }}
                  className="shrink-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Eliminar orden"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default OrdenList;
