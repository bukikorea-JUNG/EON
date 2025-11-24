import React from 'react';
import SectionTitle from '../components/UI/SectionTitle';
import { BRAND_CRAFTSMAN } from '../images/assets';

const BrandPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-primary mb-4 animate-fade-in">이온의 철학</h1>
          <p className="text-xl text-gray-500 font-light font-serif">The Philosophy of AEON</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
          <div className="w-full md:w-1/2">
            <img 
              src={BRAND_CRAFTSMAN} 
              alt="Craftsman working" 
              className="w-full h-[600px] object-cover shadow-xl"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-8 animate-slide-up">
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-4">
                골프는 과학입니다.
              </h2>
              <div className="w-12 h-1 bg-secondary mb-6"></div>
              <p className="text-gray-600 leading-loose font-sans">
                주식회사 이온은 단순한 골프채를 넘어, 물리학의 정수를 담아냅니다.
                우리는 "왜 비거리는 줄어드는가?"라는 질문에서 시작했습니다.
                답은 근력이 아닌 효율에 있었습니다.
              </p>
            </div>
            <div>
              <p className="text-gray-600 leading-loose font-sans">
                40년 경력의 클럽 마이스터의 손길과 최첨단 소재 공학의 만남.
                0.01mm의 오차도 허용하지 않는 정밀함으로,
                당신의 스윙 에너지를 100% 볼에 전달하는 것이 우리의 목표입니다.
              </p>
            </div>
            <div className="pt-8">
              <p className="font-serif italic text-xl text-primary">
                "최고의 기술은 사용자가 기술임을 잊게 만드는 것이다."
              </p>
              <p className="mt-4 text-sm font-bold text-secondary uppercase tracking-widest">
                - CEO James Park
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-16 text-center">
            <SectionTitle title="Our Heritage" subtitle="끊임없는 혁신의 역사" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="p-6">
                    <h3 className="text-4xl font-serif font-bold text-secondary mb-2">1985</h3>
                    <p className="text-gray-600">장인 공방 설립</p>
                </div>
                 <div className="p-6 border-l border-r border-gray-200">
                    <h3 className="text-4xl font-serif font-bold text-secondary mb-2">2010</h3>
                    <p className="text-gray-600">Hyper-Spring 특허 취득</p>
                </div>
                 <div className="p-6">
                    <h3 className="text-4xl font-serif font-bold text-secondary mb-2">2023</h3>
                    <p className="text-gray-600">AEON-X 시리즈 런칭</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPage;