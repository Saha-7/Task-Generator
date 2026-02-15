import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Tasks Generator
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink to="/" active={isActive('/')}>Home</NavLink>
            <NavLink to="/history" active={isActive('/history')}>History</NavLink>
            <NavLink to="/status" active={isActive('/status')}>Status</NavLink>
          </div>

          {/* Mobile button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink to="/" active={isActive('/')} onClick={() => setMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/history" active={isActive('/history')} onClick={() => setMobileMenuOpen(false)}>
              History
            </MobileNavLink>
            <MobileNavLink to="/status" active={isActive('/status')} onClick={() => setMobileMenuOpen(false)}>
              Status
            </MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, active, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
        active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
}

export default Navbar;