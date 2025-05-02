import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bg.webp';
import heroImage from '../../assets/hero.gif';
import loaderImage from '../../assets/loader.png';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import congratsAnimation from '../../assets/congrats.json';
import MobileLayout from '../../components/layouts/MobileLayout.tsx';
import { teamService, participantService } from '../../api';
import { Team } from '../../types/team.types';
import { Participant, ParticipantCreate } from '../../types/participant.types';

const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const progressKeyframes = `
  @keyframes progress {
    0% {
      stroke-dasharray: 0 320;
    }
    100% {
      stroke-dasharray: 320 0;
    }
  }
`;

const pulseKeyframes = `
  @keyframes pulse {
    0% {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.3);
    }
    50% {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 50px rgba(255, 255, 255, 0.5);
    }
    100% {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.3);
    }
  }
`;

const sparkleKeyframes = `
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
`;

const fadeInKeyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const RootPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selections, setSelections] = useState<string[]>([]);
  const [displayText, setDisplayText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSpark, setShowSpark] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isTeamsLoaded, setIsTeamsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const hasAnimatedRef = useRef<Record<number, boolean>>({});
  const typingIntervalRef = useRef<number | null>(null);
  const currentStepRef = useRef<number>(1);
  const congratsRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    const savedParticipantId = localStorage.getItem('participantId');
    if (savedParticipantId) {
      checkSavedParticipant(savedParticipantId);
    }
  }, []);

  const checkSavedParticipant = async (participantId: string) => {
    try {
      const participant = await participantService.getById(participantId);
      if (participant) {
        saveParticipantToLocalStorage(participant);
        navigate('/main');
      }
    } catch (error) {
      console.error('저장된 참가자 정보 확인 실패:', error);
      localStorage.removeItem('participantId');
    }
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await teamService.getByBatch(1);
        if (teamsData && teamsData.length > 0) {
          setTeams(teamsData);
          setIsTeamsLoaded(true);
        } else {
          console.error('팀 데이터가 없습니다.');
        }
      } catch (error) {
        console.error('팀 데이터 로딩 중 오류 발생:', error);
      }
    };

    fetchTeams();
  }, []);

  const checkNameExists = async (name: string) => {
    if (!name.trim()) return false;

    try {
      setIsChecking(true);
      const participants = await participantService.getByName(name.trim());
      setIsChecking(false);

      if (participants && participants.length > 0) {
        saveParticipantToLocalStorage(participants[0]);
        navigate('/main');
        return true;
      }
      return false;
    } catch (error) {
      console.error('이름 중복 확인 중 오류 발생:', error);
      setIsChecking(false);
      return false;
    }
  };

  const saveParticipantToLocalStorage = (participant: Participant) => {
    localStorage.setItem('participantId', participant.id);
    localStorage.setItem('participantName', participant.name);
    localStorage.setItem('participantTeam', participant.team);
    localStorage.setItem('participantRole', participant.role);
    localStorage.setItem('participantBatch', participant.batch.toString());
  };

  const handleNext = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    hasAnimatedRef.current[step] = true;

    if (step === 3) {
      setIsLoading(true);

      setTimeout(() => {
        setShowSpark(true);

        setTimeout(() => {
          setShowSpark(false);
          setIsLoading(false);
          const nextStep = step + 1;
          currentStepRef.current = nextStep;
          setStep(nextStep);

          setTimeout(() => {
            startTypingAnimation();
          }, 100);
        }, 500);
      }, 5000);

      return;
    }

    const nextStep = step + 1;
    currentStepRef.current = nextStep;
    setStep(nextStep);

    setTimeout(() => {
      startTypingAnimation();
    }, 100);
  };

  const selectLeastPopulatedTeam = async () => {
    try {
      if (!isTeamsLoaded || teams.length === 0) {
        console.error('팀 데이터가 로드되지 않았습니다.');
        return null;
      }

      const teamCounts = await participantService.getTeamCounts(1);
      if (!teamCounts) {
        console.error('팀별 참가자 수를 가져오는 데 실패했습니다.');
        return teams[Math.floor(Math.random() * teams.length)];
      }

      const teamsWithCounts = teams.map(team => ({
        ...team,
        count: teamCounts[team.name] || 0,
      }));

      const minCount = Math.min(...teamsWithCounts.map(t => t.count));
      const leastPopulatedTeams = teamsWithCounts.filter(t => t.count === minCount);

      const selectedTeam =
        leastPopulatedTeams[Math.floor(Math.random() * leastPopulatedTeams.length)];

      return selectedTeam;
    } catch (error) {
      console.error('팀 선택 중 오류 발생:', error);
      return teams[Math.floor(Math.random() * teams.length)];
    }
  };

  const createParticipant = async (team: Team) => {
    try {
      if (!name.trim()) {
        console.error('참가자 이름이 없습니다.');
        return false;
      }

      const newParticipant: ParticipantCreate = {
        name: name.trim(),
        team: team.name,
        role: '참가자',
        batch: 1,
      };

      const result = await participantService.create(newParticipant);
      if (result && result.length > 0) {
        saveParticipantToLocalStorage(result[0]);
        return true;
      } else {
        console.error('참가자 생성 실패');
        return false;
      }
    } catch (error) {
      console.error('참가자 생성 중 오류 발생:', error);
      return false;
    }
  };

  const handleSelection = (option: string) => {
    setSelections(prev => [...prev, option]);

    if (step === 3) {
      if (isTeamsLoaded && teams.length > 0) {
        selectLeastPopulatedTeam().then(team => {
          if (team) {
            setSelectedTeam(team);
            createParticipant(team).then(success => {
              if (!success) {
                setError('참가자 정보를 저장하는데 실패했습니다.');
              }
            });
          } else {
            console.error('팀 선택에 실패했습니다.');
          }
        });
      } else {
        console.error('팀 데이터가 로드되지 않았습니다.');
      }
    }

    handleNext();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameSubmit = async () => {
    if (!name.trim()) return;

    const nameExists = await checkNameExists(name);

    if (!nameExists) {
      handleNext();
    }
  };

  const getFullText = () => {
    const currentStep = currentStepRef.current;

    switch (currentStep) {
      case 1:
        return '<strong>의식적인 연습 밋업</strong>에 참여한 걸 환영해. 이름을 입력해줘!';
      case 2:
        if (!name.trim()) {
          return '두 번째 단계야. 이름을 알려줘!';
        }
        return `친구들과 주말에 만나기로 했어. 너의 선택은?`;
      case 3:
        return '마지막 질문이야! 스트레스를 받았을 때 주로 어떻게 해소해?';
      case 4:
        return `흥미로운 결과가 나왔어! ${name}은(는) ${selections[0]}와(과) ${selections[1]}를 선호하는 유형이네!`;
      default:
        return '';
    }
  };

  const startTypingAnimation = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    const fullText = getFullText();
    setDisplayText('');

    let currentIndex = 0;
    const textRef = { current: '' };

    typingIntervalRef.current = window.setInterval(() => {
      if (currentIndex < fullText.length) {
        textRef.current += fullText.charAt(currentIndex);
        setDisplayText(textRef.current);
        currentIndex++;
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        hasAnimatedRef.current[currentStepRef.current] = true;
      }
    }, 30);
  };

  useEffect(() => {
    currentStepRef.current = step;

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [step]);

  useEffect(() => {
    startTypingAnimation();
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (step === 2) {
      startTypingAnimation();
    }
  }, [name, step]);

  useEffect(() => {
    if (congratsRef.current) {
      congratsRef.current.setSpeed(0.5);
    }
  }, [step]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <style>{spinKeyframes}</style>
          <style>{progressKeyframes}</style>
          <style>{sparkleKeyframes}</style>
          <div className="flex flex-col items-center justify-center p-8 rounded-xl">
            <div className="relative flex items-center justify-center">
              <img src={loaderImage} alt="로딩 중" className="w-[120px] h-[120px] rounded-full" />

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
    }

    switch (step) {
      case 1:
        return (
          <div className="w-4/5 my-5">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="이름을 입력해주세요"
              className="w-full p-3 text-lg rounded-lg border-2 border-gray-300 text-center"
            />
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center gap-3 my-5 w-full">
            {!name.trim() && (
              <div className="w-4/5 mb-3">
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="이름을 입력해주세요"
                  className="w-full p-3 text-lg rounded-lg border-2 border-gray-300 text-center"
                />
              </div>
            )}
            <div className="flex flex-col gap-3 w-full items-center">
              <button
                className="bg-white p-3 rounded-lg text-center cursor-pointer shadow-md transition-transform hover:scale-105 w-4/5"
                onClick={() => handleSelection('즉흥적인 모험')}
              >
                <p className="font-medium">가서 보고 좋은곳 가자!</p>
              </button>
              <button
                className="bg-white p-3 rounded-lg text-center cursor-pointer shadow-md transition-transform hover:scale-105 w-4/5"
                onClick={() => handleSelection('세부적인 계획')}
              >
                <p className="font-medium">우리 어디서 만날까?</p>
              </button>
              <button
                className="bg-white p-3 rounded-lg text-center cursor-pointer shadow-md transition-transform hover:scale-105 w-4/5"
                onClick={() => handleSelection('개인적인 시간')}
              >
                <p className="font-medium">피곤한데.. 다음에 볼래?</p>
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center gap-3 my-5 w-full">
            <div className="flex flex-col gap-3 w-full items-center">
              <button
                className="bg-white p-3 rounded-lg text-center cursor-pointer shadow-md transition-transform hover:scale-105 w-4/5"
                onClick={() => handleSelection('활동적인 방법')}
              >
                <p className="font-medium">운동으로 스트레스 해소</p>
              </button>
              <button
                className="bg-white p-3 rounded-lg text-center cursor-pointer shadow-md transition-transform hover:scale-105 w-4/5"
                onClick={() => handleSelection('예술적인 표현')}
              >
                <p className="font-medium">음악이나 창작 활동으로 표현</p>
              </button>
              <button
                className="bg-white p-3 rounded-lg text-center cursor-pointer shadow-md transition-transform hover:scale-105 w-4/5"
                onClick={() => handleSelection('편안한 휴식')}
              >
                <p className="font-medium">집에서 잠자기</p>
              </button>
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
            <style>{fadeInKeyframes}</style>

            <div className="absolute top-0 left-0 w-full z-10">
              <Lottie
                animationData={congratsAnimation}
                loop={true}
                lottieRef={congratsRef}
                style={{ width: '100%' }}
              />
            </div>

            <div className="relative mb-5">
              <style>{pulseKeyframes}</style>
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

  const handleCompleteClick = () => {
    navigate('/main');
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
