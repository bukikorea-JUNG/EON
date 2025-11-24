import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NavItem } from '../../types';

const navItems: NavItem[] = [
  { label: 'Brand Story', path: '/brand' },
  { label: 'Products', path: '/products' },
  { label: 'Technology', path: '/tech' },
  { label: 'Contact', path: '/contact' },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClass = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-primary/95 backdrop-blur-sm shadow-md py-4' : 'bg-transparent py-6'
  }`;

  const linkClass = (isActive: boolean) => `font-sans text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${
    isActive ? 'text-secondary' : isScrolled ? 'text-white hover:text-secondary' : 'text-white hover:text-secondary'
  }`;

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="z-50 group">
          <div className="flex flex-col items-center sm:items-start">
             <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-widest group-hover:text-secondary transition-colors">
              AEON
            </h1>
            <span className="text-[0.6rem] text-secondary tracking-[0.3em] uppercase hidden sm:block">
              Premium Golf
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => linkClass(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/contact">
            <button className="bg-secondary text-white px-6 py-2 text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-primary transition-all duration-300 border border-secondary hover:border-white">
              Reserve
            </button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white z-50 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`fixed inset-0 bg-primary z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-500 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-serif text-white hover:text-secondary transition-colors"
          >
            {item.label}
          </NavLink>
        ))}
         <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
            <button className="mt-4 bg-secondary text-white px-8 py-3 text-lg font-bold uppercase hover:bg-white hover:text-primary transition-colors">
              Reserve Now
            </button>
          </Link>
      </div>
    </header>
  );
};

export default Header;