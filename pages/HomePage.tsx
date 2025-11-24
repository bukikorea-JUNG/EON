import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, ShieldCheck } from 'lucide-react';
import Button from '../components/UI/Button';
import SectionTitle from '../components/UI/SectionTitle';
import { HERO_BG, FEATURE_IMG_1, FEATURE_IMG_2, TESTIMONIAL_USER, PRODUCT_DRIVER } from '../images/assets';

const HomePage: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-primary/90 z-10"></div>
        
        <div className="relative z-20 container mx-auto px-6 text-center text-white">
          <h2 className="text-lg md:text-xl font-sans font-light tracking-[0.3em] uppercase mb-4 text-secondary animate-slide-up">
            Premium High-Rebound Golf Club
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.2s' }}>
            다시, 250미터의 <br />
            짜릿함을 손끝으로
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-sans font-light animate-slide-up" style={{ animationDelay: '0.4s' }}>
            비거리의 한계를 넘어서는 주식회사 이온의 기술력.<br/>
            잃어버린 300000미터를 되찾아 드립니다.
          </p>
          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Link to="/contact">
              <Button variant="primary" className="text-lg px-10 py-4">
                무료 시타 예약하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <img 
                src={FEATURE_IMG_1} 
                alt="Aeon Driver Detail" 
                className="w-full h-[500px] object-cover shadow-2xl rounded-none"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-secondary font-bold tracking-widest uppercase mb-2">The Solution</h3>
              <h2 className="text-4xl font-serif font-bold text-primary mb-6">
                스윙은 그대로,<br /> 결과는 놀랍게.
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed font-sans">
                나이가 들수록 줄어드는 비거리, 당신의 잘못이 아닙니다. 
                이온의 <strong>Hyper-Spring</strong> 페이스 기술은 반발계수(COR) 0.87을 초과하여 
                같은 스윙 스피드에서도 폭발적인 볼 스피드를 만들어냅니다.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-primary font-medium">
                  <div className="bg-secondary/20 p-2 rounded-full mr-4">
                    <TrendingUp size={20} className="text-primary" />
                  </div>
                  평균 비거리 +25m 증가 효과
                </li>
                <li className="flex items-center text-primary font-medium">
                  <div className="bg-secondary/20 p-2 rounded-full mr-4">
                    <ShieldCheck size={20} className="text-primary" />
                  </div>
                  관용성을 높인 저중심 설계
                </li>
              </ul>
              <Link to="/tech">
                <span className="group inline-flex items-center text-primary font-bold border-b-2 border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors cursor-pointer">
                  기술 자세히 보기 <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase - Parallax Feel */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-6 relative z-10">
          <SectionTitle 
            title="AEON-X Masterpiece" 
            subtitle="타협하지 않는 성능과 아름다움의 조화" 
          />
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
              <div className="h-64 overflow-hidden mb-6">
                <img src={PRODUCT_DRIVER} alt="Driver" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-2">AEON-X Driver</h3>
              <p className="text-gray-600 mb-4 text-sm">극강의 반발력과 최적의 탄도 설계.</p>
              <Link to="/products" className="text-secondary font-bold text-sm uppercase tracking-wider">Discover More</Link>
            </div>
            
            <div className="bg-white p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 group mt-0 md:-mt-12">
               <div className="h-64 overflow-hidden mb-6">
                <img src={FEATURE_IMG_2} alt="Ball" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-2">Precision Control</h3>
              <p className="text-gray-600 mb-4 text-sm">원하는 곳으로 정확하게 보내는 컨트롤.</p>
              <Link to="/tech" className="text-secondary font-bold text-sm uppercase tracking-wider">See Tech</Link>
            </div>

            <div className="bg-white p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
               <div className="h-64 overflow-hidden mb-6">
                <img src={PRODUCT_DRIVER} alt="Shaft" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-2">Custom Shaft</h3>
              <p className="text-gray-600 mb-4 text-sm">한국인의 체형에 맞춘 최적화된 샤프트.</p>
              <Link to="/products" className="text-secondary font-bold text-sm uppercase tracking-wider">View Specs</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} fill="#d4af37" color="#d4af37" className="w-6 h-6 mx-1" />)}
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-8">
              "이온 드라이버를 만나고 골프 인생 제 2막이 시작되었습니다."
            </h2>
            <div className="flex flex-col items-center">
              <img src={TESTIMONIAL_USER} alt="User" className="w-20 h-20 rounded-full border-2 border-secondary mb-4 object-cover" />
              <p className="font-bold text-lg">김철수 님 (58세)</p>
              <p className="text-gray-400 text-sm">구력 25년, 핸디캡 12</p>
            </div>
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-white/10 pt-12">
              <div>
                <p className="text-4xl font-bold text-secondary mb-2">98%</p>
                <p className="text-sm text-gray-300">사용자 만족도</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-secondary mb-2">+25m</p>
                <p className="text-sm text-gray-300">평균 비거리 증가</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-secondary mb-2">0.87</p>
                <p className="text-sm text-gray-300">최대 반발 계수</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-secondary mb-2">5년</p>
                <p className="text-sm text-gray-300">무상 A/S 보증</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle title="Experience It Yourself" />
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            망설이지 마세요. 지금 바로 예약하고 이온의 퍼포먼스를 직접 경험해보세요.
            전문 피터가 당신에게 꼭 맞는 스펙을 찾아드립니다.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <Link to="/contact">
              <Button variant="primary">무료 시타 예약하기</Button>
            </Link>
            <Link to="/products">
              <Button variant="outline">제품 카탈로그 보기</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;