import React from 'react';
import SectionTitle from '../components/UI/SectionTitle';
import Button from '../components/UI/Button';
import { CONTACT_OFFICE } from '../images/assets';
import { MapPin, Phone, Clock } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6">
        <SectionTitle title="Reserve Your Experience" subtitle="프리미엄 시타 라운지 예약" />

        <div className="flex flex-col lg:flex-row gap-12 mt-12">
          {/* Form */}
          <div className="lg:w-1/2 bg-white p-8 shadow-lg border-t-4 border-secondary">
            <h3 className="text-2xl font-serif font-bold text-primary mb-6">시타 예약 신청</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">이름</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-300 p-3 focus:outline-none focus:border-secondary transition-colors" placeholder="홍길동" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">연락처</label>
                  <input type="tel" className="w-full bg-gray-50 border border-gray-300 p-3 focus:outline-none focus:border-secondary transition-colors" placeholder="010-0000-0000" />
                </div>
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">구력 (년)</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-300 p-3 focus:outline-none focus:border-secondary transition-colors" placeholder="예: 5" />
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">현재 사용중인 드라이버</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-300 p-3 focus:outline-none focus:border-secondary transition-colors" placeholder="브랜드 / 모델명" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">희망 방문 일정</label>
                <input type="datetime-local" className="w-full bg-gray-50 border border-gray-300 p-3 focus:outline-none focus:border-secondary transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">추가 문의사항</label>
                <textarea rows={4} className="w-full bg-gray-50 border border-gray-300 p-3 focus:outline-none focus:border-secondary transition-colors" placeholder="궁금하신 점을 남겨주세요."></textarea>
              </div>

              <Button fullWidth type="submit">예약 신청하기</Button>
            </form>
          </div>

          {/* Info */}
          <div className="lg:w-1/2 space-y-8">
            <div className="relative h-64 w-full">
              <img src={CONTACT_OFFICE} alt="Office" className="w-full h-full object-cover shadow-md" />
              <div className="absolute inset-0 bg-primary/20"></div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="text-secondary w-6 h-6 mr-4 mt-1" />
                <div>
                  <h4 className="font-bold text-primary text-lg">AEON Showroom</h4>
                  <p className="text-gray-600">서울특별시 강남구 도산대로 123 이온타워 1층<br/>(발렛파킹 가능)</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="text-secondary w-6 h-6 mr-4 mt-1" />
                <div>
                  <h4 className="font-bold text-primary text-lg">Customer Center</h4>
                  <p className="text-gray-600">02-555-0123<br/>contact@aeongolf.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="text-secondary w-6 h-6 mr-4 mt-1" />
                <div>
                  <h4 className="font-bold text-primary text-lg">Hours</h4>
                  <p className="text-gray-600">
                    평일: 10:00 - 20:00<br/>
                    주말/공휴일: 11:00 - 18:00
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-none border-l-4 border-primary">
              <p className="text-sm text-gray-600 leading-relaxed">
                * 시타 예약은 100% 사전 예약제로 운영됩니다.<br/>
                * 1:1 트랙맨 분석을 통해 고객님께 최적화된 스펙을 제안해 드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;