import { useState, useEffect } from 'react';
import MobileLayout from '../../shared/layouts/MobileLayout';
import { teamService, participantService } from '../../api';
import { Team } from '../../features/teams/types';
import { Participant } from '../../features/participants/types';
import { useNavigate } from 'react-router-dom';

const TEAM_ORDER = ['호랑이', '사자', '여우', '팬더', '곰', '늑대'];

const TeamsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<Participant[]>([]);
  const [changeLoading, setChangeLoading] = useState<{ [key: string]: boolean }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [totalFirstBatchParticipants, setTotalFirstBatchParticipants] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const teamsData = await teamService.getAll();
        if (teamsData && teamsData.length > 0) {
          const activeTeams = teamsData.filter(team => team.is_active);
          
          const sortedTeams = [...activeTeams].sort((a, b) => {
            const indexA = TEAM_ORDER.indexOf(a.name);
            const indexB = TEAM_ORDER.indexOf(b.name);
            
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            
            return indexA - indexB;
          });
          
          setTeams(sortedTeams);
          
          if (!selectedTeam && sortedTeams.length > 0) {
            setSelectedTeam(sortedTeams[0].name);
          }
          
          const participantsData = await participantService.getAll();
          if (participantsData) {
            // 활성화된 팀 이름 목록
            const activeTeamNames = activeTeams.map(team => team.name);
            
            // 1기 참가자 중 활성화된 팀에 속한 참가자만 필터링
            const firstBatchParticipants = participantsData.filter(
              p => p.batch === 1 && 
                   p.role === '참가자' && 
                   activeTeamNames.includes(p.team)
            );
            setTotalFirstBatchParticipants(firstBatchParticipants.length);
            
            if (selectedTeam) {
              const filteredMembers = participantsData.filter(
                p => p.team === selectedTeam && p.batch === 1
              );
              setTeamMembers(filteredMembers);
            } else {
              setTeamMembers([]);
            }
          }
        } else {
          setTeams([]);
          setSelectedTeam(null);
        }

        setLoading(false);
      } catch (err) {
        console.error('데이터 로딩 중 오류 발생:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTeam]);

  const handleTeamSelect = (teamName: string) => {
    setSelectedTeam(teamName);
  };
  const handleTeamChange = async (participantId: string, newTeam: string, currentName: string) => {
    if (newTeam === selectedTeam) return;

    try {
      setChangeLoading(prev => ({ ...prev, [participantId]: true }));
      setError(null);
      setSuccessMessage(null);

      const result = await participantService.update(participantId, { team: newTeam });

      if (result) {
        setSuccessMessage(`${currentName}님이 ${newTeam} 팀으로 이동되었습니다.`);
        setTeamMembers(prev => prev.filter(p => p.id !== participantId));
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError('팀 변경에 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
      console.error(err);
    } finally {
      setChangeLoading(prev => ({ ...prev, [participantId]: false }));
    }
  };

  return (
    <MobileLayout>
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            className="mr-2 p-2 rounded-full hover:bg-gray-100"
            onClick={() => navigate('/', { replace: true })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="bg-blue-50 px-3 py-2 rounded-lg ml-auto">
            <p className="text-blue-800 text-sm font-medium">
              체크인 완료: <span className="font-bold">{totalFirstBatchParticipants}명</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 font-bold">
              ×
            </button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="animate-pulse text-center">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex overflow-x-auto pb-2 mb-4 border-b">
              {teams.length > 0 ? (
                teams.map(team => (
                  <button
                    key={team.id}
                    className={`px-4 py-2 whitespace-nowrap mr-2 rounded-t-lg ${
                      selectedTeam === team.name
                        ? 'border-b-2 border-blue-500 font-medium'
                        : 'text-gray-500'
                    }`}
                    onClick={() => handleTeamSelect(team.name)}
                  >
                    {team.name}
                  </button>
                ))
              ) : (
                <div className="text-gray-500 p-2">등록된 팀이 없습니다.</div>
              )}
            </div>

            {selectedTeam && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-800 text-lg font-bold">
                    {selectedTeam} 팀원 목록
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                      {teamMembers.length}명
                    </span>
                  </h3>
                </div>

                {teamMembers.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {teamMembers.map(member => (
                      <div key={member.id} className="py-3 px-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center text-blue-500 font-bold mr-3">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <select
                            className="text-sm border rounded py-1 px-2 bg-white"
                            value={member.team}
                            onChange={e => handleTeamChange(member.id, e.target.value, member.name)}
                            disabled={changeLoading[member.id]}
                          >
                            <option value={member.team}>현재 팀</option>
                            {teams
                              .filter(team => team.name !== member.team)
                              .map(team => (
                                <option key={team.id} value={team.name}>
                                  {team.name} 팀으로 이동
                                </option>
                              ))}
                          </select>
                          {changeLoading[member.id] && (
                            <div className="ml-2 animate-spin h-4 w-4 border-t-2 border-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-10 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mb-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <p className="font-medium">팀원이 없습니다</p>
                    <p className="text-sm mt-1">아직 등록된 팀원이 없습니다.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {successMessage && (
        <div className="fixed bottom-4 left-0 right-0 mx-auto w-[90%] max-w-sm bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex justify-between items-center shadow-lg z-50">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-green-700 font-bold">
            ×
          </button>
        </div>
      )}
    </MobileLayout>
  );
};

export default TeamsPage;
