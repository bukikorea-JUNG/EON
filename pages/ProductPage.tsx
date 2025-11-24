import React, { useState } from 'react';
import SectionTitle from '../components/UI/SectionTitle';
import Button from '../components/UI/Button';
import { PRODUCT_DRIVER, PRODUCT_IRON } from '../images/assets';
import { Product } from '../types';
import { X, Check } from 'lucide-react';

const products: Product[] = [
  {
    id: 'd1',
    name: 'AEON-X Driver',
    category: 'driver',
    price: '1,200,000 KRW',
    description: '압도적 비거리, 관용성의 끝판왕. 고반발 헤드와 저중심 설계의 완벽한 조화.',
    specs: { loft: '9.5° / 10.5°', shaft: 'R / SR / S', composition: 'Beta Titanium' },
    image: PRODUCT_DRIVER
  },
  {
    id: 'w1',
    name: 'AEON-X Fairway Wood',
    category: 'wood',
    price: '650,000 KRW',
    description: '어떤 라이에서도 쉽게 볼을 띄우는 샬로우 페이스 디자인.',
    specs: { loft: '15° (#3) / 18° (#5)', shaft: 'R / SR / S', composition: 'Maraging Steel' },
    image: PRODUCT_DRIVER // Using driver image as placeholder for wood based on prompt constraints
  },
  {
    id: 'i1',
    name: 'AEON-Gold Iron Set',
    category: 'iron',
    price: '2,500,000 KRW',
    description: '부드러운 타구감과 정교한 스핀 컨트롤. 단조 아이언의 명작.',
    specs: { loft: '5-PW, AW, SW', shaft: 'NS Pro 950 / Graphite', composition: 'S20C Forged' },
    image: PRODUCT_IRON
  }
];

const ProductPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<'all' | 'driver' | 'wood' | 'iron'>('all');

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6">
        <SectionTitle 
          title="Masterpiece Collection" 
          subtitle="최고의 퍼포먼스를 위한 라인업" 
        />

        {/* Filter */}
        <div className="flex justify-center space-x-4 mb-12">
          {['all', 'driver', 'wood', 'iron'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-6 py-2 uppercase text-sm font-bold tracking-wider transition-colors ${
                filter === cat 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-500 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300" onClick={() => setSelectedProduct(product)}>
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 w-full bg-primary/90 text-white py-3 px-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-sm font-bold uppercase tracking-wider">View Details</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">{product.category}</p>
                <h3 className="text-xl font-serif font-bold text-primary mb-2">{product.name}</h3>
                <p className="text-gray-500 font-sans mb-4">{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-primary z-10"
              >
                <X size={32} />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-serif font-bold text-primary mb-2">{selectedProduct.name}</h2>
                <p className="text-2xl text-secondary font-medium mb-6">{selectedProduct.price}</p>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="bg-gray-50 p-6 mb-8">
                  <h4 className="font-bold text-primary mb-4 uppercase text-sm tracking-wide">Technical Specs</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex justify-between border-b border-gray-200 pb-2">
                      <span>Loft</span>
                      <span className="font-bold">{selectedProduct.specs.loft}</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-200 pb-2">
                      <span>Shaft</span>
                      <span className="font-bold">{selectedProduct.specs.shaft}</span>
                    </li>
                    <li className="flex justify-between pb-2">
                      <span>Material</span>
                      <span className="font-bold">{selectedProduct.specs.composition}</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-auto">
                   <Button fullWidth onClick={() => alert('구매 문의 페이지로 이동합니다.')}>
                    구매 문의하기
                   </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;