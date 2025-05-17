import { QRCodeCanvas } from 'qrcode.react';

export const QRPage = () => {
  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#e9f0ff] overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#d0deff] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-70"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d0deff] rounded-full translate-x-1/3 translate-y-1/3 opacity-70"></div>
      <div className="absolute top-14 right-14 w-24 h-1 bg-[#1e45f2] opacity-40"></div>

      <div className="flex items-start justify-center w-full max-w-6xl px-8 gap-16 z-10">
        {/* 왼쪽: 텍스트 정보 */}
        <div className="max-w-md pt-8">
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-[#1e293b]">의식적인 연습 밋업</span>
          </h1>
          
          <div className="w-24 h-1 bg-[#1e45f2] my-8"></div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">안내</h2>
          <p className="text-xl font-medium text-gray-700 mb-10 leading-relaxed tracking-wide">
            이 QR 코드를 스캔하여 간편하게 체크인하고<br />
            오늘의 밋업에 참여해 주세요.
          </p>
          
          <div className="flex items-center mb-5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#e0e7ff] mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#1e45f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-gray-800">5월 10일 (토요일)</div>
              <div className="text-gray-600">오후 1시 – 5시</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#e0e7ff] mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#1e45f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-gray-800">선릉역 테크살롱</div>
              <div className="text-gray-600">성담빌딩 13층</div>
            </div>
          </div>
        </div>

        {/* 오른쪽: QR 코드 카드 */}
        <div className="bg-white rounded-xl shadow-lg p-8 pt-12 pb-10 w-[400px] relative">
          <div className="absolute top-0 left-10 w-3 h-3 bg-[#4973ff] rounded-full -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-10 w-3 h-3 bg-[#4973ff] rounded-full translate-y-1/2"></div>
          
          <div className="flex justify-center mb-7">
            <QRCodeCanvas
              value="https://dp-meetup.vercel.app/"
              size={280}
              bgColor="#fff"
              fgColor="#1e293b"
              level="H"
              includeMargin={false}
            />
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">QR 코드를 스캔하세요</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              스마트폰 카메라 앱으로 스캔하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPage;
