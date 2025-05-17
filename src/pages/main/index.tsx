import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../../shared/layouts/MobileLayout';
import { teamService, participantService } from '../../api';
import { Team } from '../../features/teams/types';
import { Participant } from '../../features/participants/types';
import keyframes from '../../styles/animations/keyframes';

const MainPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<Participant[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const participantId = localStorage.getItem('participantId');
        const participantTeam = localStorage.getItem('participantTeam');

        if (!participantId || !participantTeam) {
          navigate('/join');
          return;
        }

        const participant = await participantService.getById(participantId);
        if (!participant) {
          throw new Error('참가자 정보를 찾을 수 없습니다.');
        }
        setCurrentParticipant(participant);

        const teams = await teamService.getByName(participantTeam);
        if (!teams) {
          throw new Error('팀 정보를 찾을 수 없습니다.');
        }
        setTeam(teams);

        const batch = participant.batch;
        const allParticipants = await participantService.getByBatch(batch);
        if (allParticipants) {
          const sameTeamMembers = allParticipants.filter(p => p.team === participantTeam);
          setTeamMembers(sameTeamMembers);
        }

        setLoading(false);
      } catch (err) {
        console.error('데이터 로딩 중 오류 발생:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLeaveTeam = () => {
    localStorage.removeItem('participantId');
    localStorage.removeItem('participantName');
    localStorage.removeItem('participantTeam');
    localStorage.removeItem('participantRole');
    localStorage.removeItem('participantBatch');
    navigate('/');
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">팀 정보를 불러오는 중...</p>
        </div>
      </MobileLayout>
    );
  }

  if (error || !team || !currentParticipant) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-white">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-md">
            <p className="font-bold">오류 발생</p>
            <p>{error || '팀 또는 참가자 정보를 불러올 수 없습니다.'}</p>
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-lg mt-4"
            onClick={handleLeaveTeam}
          >
            다시 시작하기
          </button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <style>{keyframes.fadeIn}</style>
      <div className="min-h-screen w-full overflow-auto bg-white">
        {/* 헤더 */}
        <div className="py-4 px-4 border-b border-gray-100 sticky top-0 z-10 bg-white shadow-sm">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-gray-800 text-xl font-bold">의식적인 연습 밋업</h1>
              <button
                onClick={handleLeaveTeam}
                className="text-red-600 border border-red-200 px-3 py-1 rounded-full text-sm"
              >
                나가기
              </button>
            </div>
          </div>
        </div>

        {/* 숨겨진 관리자 영역 - 더블 클릭시 teams 페이지로 이동 */}
        <div 
          className="absolute left-0 top-[65px] w-20 h-20 opacity-0"
          onDoubleClick={() => navigate('/teams')}
        />

        {/* 메인 컨텐츠 */}
        <div className="container mx-auto p-4 pb-16">
          {/* 팀 로고 섹션 */}
          <div
            className="flex flex-col items-center my-4"
            style={{ animation: 'fadeIn 0.4s ease-out forwards' }}
          >
            <div 
              className="w-[120px] h-[120px] rounded-full overflow-hidden mb-3 flex items-center justify-center bg-gray-50 p-2 border border-gray-100 shadow-sm cursor-pointer"
              onDoubleClick={() => navigate('/teams')}
            >
              <img
                src={team.image_url}
                alt={`${team.name} 팀 로고`}
                className="max-w-full max-h-full object-contain"
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                }}
              />
            </div>
            <h2 className="text-gray-800 text-xl font-bold">{team.name} 팀</h2>
          </div>

          {/* 내 정보 카드 */}
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-4"
            style={{ animation: 'fadeIn 0.5s ease-out forwards' }}
          >
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {currentParticipant.role}
                </span>
                <p className="text-blue-800 font-medium">{currentParticipant.name}</p>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                <span className="font-bold">{team.name}</span> 팀에 오신 것을 환영합니다!
              </p>
            </div>
          </div>

          {/* 팀원 목록 */}
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4"
            style={{ animation: 'fadeIn 0.6s ease-out forwards' }}
          >
            <h3 className="text-gray-800 text-lg font-bold mb-4">
              팀원 목록
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {teamMembers.length}명
              </span>
            </h3>

            <div className="divide-y divide-gray-100">
              {teamMembers.map(member => (
                <div
                  key={member.id}
                  className={`py-3 px-2 flex items-center justify-between ${
                    member.id === currentParticipant.id ? 'bg-blue-50 rounded' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center text-blue-500 font-bold mr-3">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.name}
                        {member.id === currentParticipant.id && (
                          <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                            나
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {new Date(member.registered_at).toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {teamMembers.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-gray-500">아직 팀원이 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* 밋업 일정 */}
          {/* <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6"
            style={{ animation: 'fadeIn 0.7s ease-out forwards' }}
          >
            <h3 className="text-gray-800 text-lg font-bold mb-4">다음 밋업</h3>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-500 rounded-lg p-2 mr-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">다음 밋업 일정</h4>
                  <p className="text-gray-600 mt-1">토요일 오후 2시 - 4시</p>
                  <p className="text-sm text-gray-500 mt-2">
                    세부 일정과 장소는 조만간 공지됩니다!
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </MobileLayout>
  );
};

export default MainPage;
