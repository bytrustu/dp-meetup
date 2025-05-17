import MobileLayout from '../../shared/layouts/MobileLayout';
import { useNavigate } from 'react-router-dom';
import useTeamsData from '../../hooks/useTeamsData';

const TeamsPage = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    teams,
    selectedTeam,
    teamMembers,
    changeLoading,
    successMessage,
    totalFirstBatchParticipants,
    handleTeamSelect,
    handleTeamChange,
    setError,
    setSuccessMessage,
  } = useTeamsData();

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
