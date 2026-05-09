import { useState } from 'react';
import ClienteForm from './ClienteForm';

export const ClienteList = ({ hook }) => {
  const { clientes, loading, error, deleteCliente } = hook;
  const [clienteAEditar, setClienteAEditar] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setIsDeleting(id);
      try {
        await deleteCliente(id);
      } catch (err) {
        alert('Error al eliminar el cliente');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleEdit = (cliente) => {
    setClienteAEditar(cliente);
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setClienteAEditar(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="p-4 text-red-700 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mis Clientes</h2>
        {!isFormVisible && (
          <button
            onClick={() => setIsFormVisible(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Añadir Cliente
          </button>
        )}
      </div>

      {isFormVisible && (
        <ClienteForm
          clienteAEditar={clienteAEditar}
          onSuccess={closeForm}
          onCancel={closeForm}
          hook={hook}
        />
      )}

      {!isFormVisible && clientes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No tienes clientes registrados aún.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {!isFormVisible && clientes.map((cliente, index) => (
              <li key={cliente.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-lg font-medium text-gray-900 truncate">
                      {index + 1}. {cliente.nombre} - {cliente.telefono}
                    </p>
                    {cliente.email && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium mr-1">Email:</span>{cliente.email}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(cliente)}
                      disabled={isDeleting === cliente.id}
                      className="px-3 py-1 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 disabled:opacity-50 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      disabled={isDeleting === cliente.id}
                      className="px-3 py-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      {isDeleting === cliente.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClienteList;