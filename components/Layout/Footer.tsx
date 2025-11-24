import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4 tracking-widest text-secondary">AEON</h2>
            <p className="text-gray-300 font-sans text-sm leading-relaxed mb-6">
              물리학의 정수를 담은 프리미엄 골프 클럽.<br/>
              비거리의 한계를 넘어서는 경험을 제공합니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6">Explore</h3>
            <ul className="space-y-3 font-sans text-sm text-gray-300">
              <li><Link to="/brand" className="hover:text-secondary transition-colors">Brand Story</Link></li>
              <li><Link to="/products" className="hover:text-secondary transition-colors">Products</Link></li>
              <li><Link to="/tech" className="hover:text-secondary transition-colors">Technology</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">Reservations</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 font-sans text-sm text-gray-300">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-secondary flex-shrink-0 mt-1" />
                <span>서울 강남구 도산대로 123, <br/>이온타워 1층 쇼룸</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-secondary flex-shrink-0" />
                <span>02-555-0123</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-secondary flex-shrink-0" />
                <span>contact@aeongolf.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4">신제품 출시 소식과 시타 이벤트 정보를 받아보세요.</p>
            <div className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="E-mail Address" 
                className="bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-colors"
              />
              <button className="bg-secondary text-primary font-bold py-2 hover:bg-white transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-sans">
          <p>&copy; {new Date().getFullYear()} AEON GOLF Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;