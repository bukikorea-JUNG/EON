import React from 'react';
import SectionTitle from '../components/UI/SectionTitle';
import { TECH_BLUEPRINT } from '../images/assets';
import { Zap, Wind, Layers } from 'lucide-react';

const TechPage: React.FC = () => {
  return (
    <div className="pt-24">
      {/* Intro */}
      <div className="bg-primary text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">The Science of Distance</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
            비거리는 마법이 아닙니다. 물리학입니다.<br/>
            이온만의 독자적인 기술력을 확인하세요.
          </p>
        </div>
      </div>

      {/* Blueprint Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <img src={TECH_BLUEPRINT} alt="Blueprint" className="w-full shadow-2xl border-4 border-gray-100" />
            </div>
            <div className="lg:w-1/2 space-y-12">
              <div className="flex gap-6">
                <div className="bg-secondary/10 p-4 h-fit rounded-lg">
                  <Zap className="text-secondary w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">초박형 티타늄 페이스</h3>
                  <p className="text-gray-600 leading-relaxed">
                    기존 소재 대비 20% 얇지만 30% 더 강한 탄성을 지닌 특수 가공 티타늄을 사용했습니다. 
                    임팩트 순간 스프링처럼 튕겨내는 반발력을 극대화하여 초기 볼 스피드를 획기적으로 높입니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="bg-secondary/10 p-4 h-fit rounded-lg">
                   <Wind className="text-secondary w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">공기역학적 헤드 디자인</h3>
                  <p className="text-gray-600 leading-relaxed">
                    스윙 시 발생하는 공기 저항을 최소화하는 Aero-Stream 디자인을 적용했습니다.
                    다운스윙 구간에서 헤드 스피드 감속을 막아 더 빠른 임팩트를 실현합니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                 <div className="bg-secondary/10 p-4 h-fit rounded-lg">
                   <Layers className="text-secondary w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">저중심 설계 (Low CG)</h3>
                  <p className="text-gray-600 leading-relaxed">
                    무게 중심을 헤드 후방 깊숙한 곳으로 배치하여 관성 모멘트(MOI)를 높였습니다.
                    미스샷에서도 헤드의 뒤틀림을 방지하고, 볼을 쉽게 띄워 최적의 탄도를 만들어냅니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <SectionTitle title="Performance Data" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-8 shadow-sm">
                <h4 className="text-gray-500 uppercase text-sm tracking-widest mb-2">COR (반발계수)</h4>
                <p className="text-5xl font-bold text-primary">0.87+</p>
                <p className="text-sm text-secondary mt-2">업계 최고 수준</p>
            </div>
             <div className="bg-white p-8 shadow-sm">
                <h4 className="text-gray-500 uppercase text-sm tracking-widest mb-2">Sweet Spot</h4>
                <p className="text-5xl font-bold text-primary">20%</p>
                <p className="text-sm text-secondary mt-2">유효 타구 면적 확대</p>
            </div>
             <div className="bg-white p-8 shadow-sm">
                <h4 className="text-gray-500 uppercase text-sm tracking-widest mb-2">Spin Rate</h4>
                <p className="text-5xl font-bold text-primary">-300</p>
                <p className="text-sm text-secondary mt-2">백스핀 감소 (rpm)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechPage;