import bgImage from '../../assets/bg.webp';
import heroImage from '../../assets/hero.gif';
import MobileLayout from '../../shared/layouts/MobileLayout';
import { Loading, TextInput } from '../../shared/components';
import Lottie from 'lottie-react';
import congratsAnimation from '../../assets/congrats.json';
import useJoinFlow from '../../hooks/useJoinFlow';
import keyframes from '../../styles/animations/keyframes';

const RootPage = () => {
  const {
    step,
    name,
    selections,
    displayText,
    getOptions,
    isLoading,
    showSpark,
    selectedTeam,
    error,
    isChecking,
    congratsRef,
    handleNameChange,
    handleNameSubmit,
    handleSelection,
    handleCompleteClick,
  } = useJoinFlow();

  const renderContent = () => {
    if (isLoading) {
      return <Loading showSpark={showSpark} selections={selections} />;
    }

    switch (step) {
      case 1:
        return (
          <div className="w-4/5 my-5">
            <TextInput value={name} onChange={handleNameChange} placeholder="이름을 입력해주세요" />
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center gap-3 my-5 w-full">
            {!name.trim() && (
              <div className="w-4/5 mb-3">
                <TextInput
                  value={name}
                  onChange={handleNameChange}
                  placeholder="이름을 입력해주세요"
                />
              </div>
            )}
            <div className="flex flex-col gap-3 w-full items-center">
              {getOptions(2).map(option => (
                <button
                  key={option.value}
                  className="bg-white p-3 rounded-lg text-center cursor-pointer shadow-md transition-transform hover:scale-105 w-4/5"
                  onClick={() => handleSelection(option.value)}
                >
                  <p className="font-medium">{option.label}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center gap-3 my-5 w-full">
            <div className="flex flex-col gap-3 w-full items-center">
              {getOptions(3).map(option => (
                <button
                  key={option.value}
                  className="bg-white p-3 rounded-lg text-center cursor-pointer shadow-md transition-transform hover:scale-105 w-4/5"
                  onClick={() => handleSelection(option.value)}
                >
                  <p className="font-medium">{option.label}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 4: {
        if (!selectedTeam) {
          return (
            <div className="flex justify-center items-center h-full">
              <p className="text-center text-gray-500">팀 데이터를 불러오는 중...</p>
            </div>
          );
        }

        if (error) {
          return (
            <div className="flex justify-center items-center h-full">
              <p className="text-center text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                다시 시도하기
              </button>
            </div>
          );
        }

        const { name: teamName, characteristic, description, image_url } = selectedTeam;

        return (
          <div
            className="flex flex-col items-center w-full mt-3"
            style={{ animation: 'fadeIn 0.5s ease-out' }}
          >
            <style>{keyframes.fadeIn}</style>

            <div className="absolute top-0 left-0 w-full z-10">
              <Lottie
                animationData={congratsAnimation}
                loop={true}
                lottieRef={congratsRef}
                style={{ width: '100%' }}
              />
            </div>

            <div className="relative mb-5">
              <style>{keyframes.pulse}</style>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 rounded-lg"></div>
              <img
                src={image_url}
                alt={`${teamName} 팀`}
                className="w-[220px] h-auto rounded-lg"
                style={{
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.3)',
                  animation: 'pulse 2s infinite',
                }}
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.padding = '30px';
                  e.currentTarget.src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                }}
              />
            </div>

            <div className="bg-white p-4 rounded-lg text-center mb-3 w-full max-w-[320px] shadow-md">
              <h2 className="text-lg font-medium">{name}님은</h2>
              <div className="my-2 py-2 px-3 bg-blue-50 rounded-lg">
                <h1 className="text-xl font-bold text-blue-600">
                  {characteristic} {teamName} 팀
                </h1>
                <p className="text-blue-700 text-sm">에 배정되었습니다!</p>
              </div>
              <div className="mt-3 pt-2 pb-1 px-2 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 leading-snug text-left">{description}</p>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <MobileLayout backgroundImage={bgImage}>
      <div className="h-full w-full flex flex-col items-center justify-between relative p-5">
        {step === 4 ? (
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 z-0"></div>
        ) : null}

        <div className="flex flex-col items-center w-full relative mt-[80px] z-10">
          {step !== 4 && (
            <>
              <div className="bg-white p-5 rounded-3xl mb-5 mt-5 text-lg relative shadow-md w-full max-w-[320px] min-h-[100px] flex items-start justify-center">
                <div
                  className="whitespace-pre-wrap break-words w-full text-left px-2"
                  dangerouslySetInnerHTML={{ __html: displayText }}
                ></div>
                <div className="absolute -bottom-[15px] left-1/2 border-[15px_15px_0] border-solid border-t-white border-x-transparent border-b-transparent -translate-x-1/2"></div>
              </div>

              <div className="flex justify-center w-full">
                <img
                  src={heroImage}
                  alt="Hero character"
                  className="w-[180px] h-auto"
                  style={{ marginBottom: '2rem' }}
                />
              </div>
            </>
          )}
        </div>

        <div className="w-full flex-grow flex flex-col items-center z-10">{renderContent()}</div>

        {step === 1 && name.trim() && (
          <button
            className="bg-[#ff9900] text-white text-xl font-bold py-2 px-8 rounded-lg cursor-pointer mt-5 w-full max-w-[320px] z-20 mb-5"
            onClick={handleNameSubmit}
            disabled={isChecking}
          >
            {isChecking ? '확인 중...' : '좋아!'}
          </button>
        )}

        {step === 4 && (
          <button
            className="bg-[#ff9900] text-white text-xl font-bold py-2 px-8 rounded-lg cursor-pointer mt-5 w-full max-w-[320px] z-20 mb-5"
            onClick={handleCompleteClick}
          >
            완료!
          </button>
        )}
      </div>
    </MobileLayout>
  );
};

export default RootPage;
