import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ClienteList from './components/clientes/ClienteList';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from "./components/Dashboard";
import NuevaOrdenModal from './components/ordenes/NuevaOrdenModal';
import OrdenList from './components/ordenes/OrdenList';
import { useOrdenes } from './hooks/useOrdenes';
import { useClientes } from './hooks/useClientes';

const WashIcon = () => (
  <img src="/public/favicon.png" alt="Wash Icon" className="w-7 h-7" />
);

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
        }`}
    >
      {children}
    </Link>
  );
};

function App() {
  const { currentUser, logout } = useAuth();
  const ordenesHook = useOrdenes();
  const clientesHook = useClientes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col">

      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-blue-600 text-white p-1.5 rounded-xl shadow-sm group-hover:bg-blue-700 transition-colors">
              <WashIcon />
            </div>
            <div className="leading-tight">
              <span className="text-xl font-extrabold text-blue-600 group-hover:text-blue-700 transition-colors">
                DEYPA Lavado
              </span>
              <span className="hidden sm:block text-xs text-gray-400 font-normal -mt-0.5">
                Panel de gestión
              </span>
            </div>
          </Link>

          {currentUser && (
            <div className="flex items-center gap-2 sm:gap-4">
              <nav className="flex gap-1">
                <NavLink to="/">Inicio</NavLink>
                <NavLink to="/clientes">Clientes</NavLink>
                <NavLink to="/ordenes">Órdenes</NavLink>
              </nav>

              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {currentUser.email?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block text-xs text-gray-500 max-w-[120px] truncate">
                  {currentUser.email}
                </span>
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:block">Salir</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>

          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/" replace /> : (
                <div className="flex justify-center items-center min-h-[70vh]">
                  <LoginForm />
                </div>
              )
            }
          />

          <Route
            path="/register"
            element={
              currentUser ? <Navigate to="/" replace /> : (
                <div className="flex justify-center items-center min-h-[70vh]">
                  <RegisterForm />
                </div>
              )
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Panel Principal</h2>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {new Date().toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        to="/clientes"
                        className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
                      >
                        Clientes
                      </Link>
                      <NuevaOrdenModal hook={ordenesHook} clientesHook={clientesHook} />
                    </div>
                  </div>
                  <Dashboard ordenesHook={ordenesHook} />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <ClienteList hook={clientesHook} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ordenes"
            element={
              <ProtectedRoute>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Órdenes</h2>
                    <NuevaOrdenModal hook={ordenesHook} clientesHook={clientesHook} />
                  </div>
                  <OrdenList hook={ordenesHook} />
                </div>
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>

      <footer className="text-center text-xs text-gray-300 py-4">
        DEYPA Lavado © {new Date().getFullYear()}
      </footer>

    </div>
  );
}

export default App;