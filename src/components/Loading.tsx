import React from 'react';

type LoadingProps = {
  showSpark: boolean;
  selections: string[];
};

const Loading = ({ showSpark, selections }: LoadingProps): React.ReactNode => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes progress {
          0% {
            stroke-dasharray: 0 320;
          }
          100% {
            stroke-dasharray: 320 0;
          }
        }
        @keyframes sparkle {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      <div className="flex flex-col items-center justify-center p-8 rounded-xl">
        <div className="relative flex items-center justify-center">
          <img
            src="/src/assets/loader.png"
            alt="로딩 중"
            className="w-[120px] h-[120px] rounded-full"
          />

          {!showSpark ? (
            <svg
              className="absolute top-0 left-0 w-[135%] h-[135%] -ml-[17.5%] -mt-[17.5%]"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                style={{
                  animation: 'progress 5s linear forwards',
                  transformOrigin: 'center',
                  transform: 'rotate(-90deg)',
                }}
              />
            </svg>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full">
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[80%]"
                style={{ animation: 'sparkle 1s ease-out forwards' }}
              >
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="#FFD700"
                    stroke="#FFF"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="text-center mt-6 max-w-[320px] w-full">
          <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur-sm w-[320px]">
            <div className="mb-3">
              <span className="text-white text-base uppercase tracking-wider font-semibold">
                당신의 선택
              </span>
            </div>
            <div className="flex flex-col space-y-3 mb-4">
              <span className="text-white font-bold text-lg bg-white bg-opacity-20 px-3 py-2 rounded">
                "{selections[0]}"
              </span>
              <span className="text-white font-bold text-lg bg-white bg-opacity-20 px-3 py-2 rounded">
                "{selections[1]}"
              </span>
            </div>
            <div className="text-center mt-1">
              <p className="text-white text-lg leading-relaxed">
                선택한 당신에게 <span className="font-bold text-xl">딱 맞는 팀</span>을<br />
                <span className="font-bold">{showSpark ? '찾았어!' : '선정 중'}</span>
                {!showSpark && <span className="inline-block animate-pulse">...</span>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
