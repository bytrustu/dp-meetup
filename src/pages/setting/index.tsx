import MobileLayout from '../../shared/layouts/MobileLayout';
import useSettingManager, { Tab, Mode } from '../../hooks/useSettingManager';

const SettingPage = () => {
  const {
    tab,
    setTab,
    mode,
    setMode,
    batch,
    setBatch,
    teams,
    participants,
    selectedTeam,
    selectedParticipant,
    loading,
    error,
    success,
    teamFilter,
    setTeamFilter,
    teamForm,
    participantForm,
    teamImage,
    filteredParticipants,
    handleCreateTeam,
    handleUpdateTeam,
    handleDeleteTeam,
    handleCreateParticipant,
    handleUpdateParticipant,
    handleDeleteParticipant,
    handleEditTeam,
    handleEditParticipant,
    handleTeamFormChange,
    handleParticipantFormChange,
    handleImageChange,
    resetTeamForm,
    resetParticipantForm,
    startCreateMode,
    handleCancel,
    clearMessages,
    setError,
    setSuccess,
    handleGoHome,
  } = useSettingManager();

    <MobileLayout>
      <div className="p-4">
        <div className="flex items-center mb-4">
          <button
            className="mr-2 p-2 rounded-full hover:bg-gray-100"
            onClick={handleGoHome}
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
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex mb-6 border-b">
          <button
            className={`py-2 px-4 ${tab === Tab.TEAMS ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => {
              setTab(Tab.TEAMS);
              setMode(Mode.LIST);
              clearMessages();
            }}
          >
            팀 관리
          </button>
          <button
            className={`py-2 px-4 ${tab === Tab.PARTICIPANTS ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => {
              setTab(Tab.PARTICIPANTS);
              setMode(Mode.LIST);
              clearMessages();
            }}
          >
            참가자 관리
          </button>
        </div>

        {/* 기수 선택 */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">기수 선택:</label>
          <div className="flex">
            <button
              className={`mr-2 px-4 py-2 rounded ${batch === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setBatch(1)}
            >
              1기
            </button>
            <button
              className={`mr-2 px-4 py-2 rounded ${batch === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setBatch(2)}
            >
              2기
            </button>
          </div>
        </div>

        {/* 알림 메시지 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button className="float-right" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
            <button className="float-right" onClick={() => setSuccess(null)}>
              ×
            </button>
          </div>
        )}

        {/* 로딩 표시 */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">로딩 중...</div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          {/* 모드에 따른 UI 렌더링 */}
          {mode === Mode.LIST && (
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h2 className="text-xl font-semibold mb-4 sm:mb-0">
                  {tab === Tab.TEAMS ? `${batch}기 팀 목록` : `${batch}기 참가자 목록`}
                </h2>
                <button
                  onClick={startCreateMode}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                >
                  {tab === Tab.TEAMS ? '새 팀 추가' : '새 참가자 추가'}
                </button>
              </div>

              {tab === Tab.TEAMS ? (
                <div className="overflow-x-auto -mx-6">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          이름
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          상태
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          작업
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teams.length > 0 ? (
                        teams.map(team => (
                          <tr key={team.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="mr-2">
                                  {team.image_url ? (
                                    <img
                                      src={team.image_url}
                                      alt={team.name}
                                      className="h-8 w-8 object-cover rounded"
                                      onError={e => {
                                        e.currentTarget.src =
                                          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                                      }}
                                    />
                                  ) : null}
                                </div>
                                <span className="font-medium">{team.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded text-xs ${team.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                              >
                                {team.is_active ? '활성' : '비활성'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditTeam(team)}
                                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDeleteTeam(team.id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                >
                                  삭제
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-gray-500 align-top">
                            <div className="flex flex-col items-center">
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
                                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                              </svg>
                              <p className="font-medium">데이터가 없습니다</p>
                              <p className="text-sm mt-1">새 항목을 추가해 보세요</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <label className="block mb-2 font-medium">팀 필터:</label>
                    <select
                      value={teamFilter}
                      onChange={e => setTeamFilter(e.target.value)}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="전체">전체 팀</option>
                      {teams
                        .filter(team => team.is_active)
                        .map(team => (
                          <option key={team.id} value={team.name}>
                            {team.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="overflow-x-auto -mx-6">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            이름
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            팀
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            작업
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredParticipants.length > 0 ? (
                          filteredParticipants.map(participant => (
                            <tr key={participant.id}>
                              <td className="px-6 py-4 whitespace-nowrap font-medium">
                                {participant.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{participant.team}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditParticipant(participant)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={() => handleDeleteParticipant(participant.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                  >
                                    삭제
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="px-6 py-8 text-center text-gray-500 align-top"
                            >
                              <div className="flex flex-col items-center">
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
                                <p className="font-medium">
                                  {teamFilter === '전체'
                                    ? '데이터가 없습니다'
                                    : `${teamFilter} 팀의 참가자가 없습니다`}
                                </p>
                                <p className="text-sm mt-1">새 항목을 추가해 보세요</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 팀 생성/수정 폼 */}
          {tab === Tab.TEAMS && (mode === Mode.CREATE || mode === Mode.EDIT) && (
            <div>
              <h2 className="text-xl font-semibold mb-6">
                {mode === Mode.CREATE ? '새 팀 추가' : '팀 정보 수정'}
              </h2>

              <form
                onSubmit={mode === Mode.CREATE ? handleCreateTeam : handleUpdateTeam}
                className="space-y-6"
              >
                <div>
                  <label className="block mb-2 font-medium">팀 이름 *</label>
                  <input
                    type="text"
                    name="name"
                    value={teamForm.name || ''}
                    onChange={handleTeamFormChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">특성 *</label>
                  <input
                    type="text"
                    name="characteristic"
                    value={teamForm.characteristic || ''}
                    onChange={handleTeamFormChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">설명 *</label>
                  <textarea
                    name="description"
                    value={teamForm.description || ''}
                    onChange={handleTeamFormChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">현재 이미지</label>
                  {teamForm.image_url ? (
                    <div className="mb-4">
                      <img
                        src={teamForm.image_url}
                        alt="팀 이미지"
                        className="h-24 w-24 object-cover rounded"
                        onError={e => {
                          e.currentTarget.src =
                            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 mb-4">이미지 없음</p>
                  )}

                  <label className="block mb-2 font-medium">새 이미지 업로드</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border rounded"
                  />
                  {teamImage && (
                    <p className="text-sm text-blue-500 mt-2">선택됨: {teamImage.name}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={teamForm.is_active}
                    onChange={e => setTeamForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="mr-2 h-4 w-4"
                    id="is_active"
                  />
                  <label htmlFor="is_active" className="font-medium">
                    활성화
                  </label>
                </div>

                <div>
                  <label className="block mb-2 font-medium">기수 *</label>
                  <select
                    name="batch"
                    value={teamForm.batch || 1}
                    onChange={handleTeamFormChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={1}>1기</option>
                    <option value={2}>2기</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {mode === Mode.CREATE ? '추가' : '수정'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 참가자 생성/수정 폼 */}
          {tab === Tab.PARTICIPANTS && (mode === Mode.CREATE || mode === Mode.EDIT) && (
            <div>
              <h2 className="text-xl font-semibold mb-6">
                {mode === Mode.CREATE ? '새 참가자 추가' : '참가자 정보 수정'}
              </h2>

              <form
                onSubmit={mode === Mode.CREATE ? handleCreateParticipant : handleUpdateParticipant}
                className="space-y-6"
              >
                <div>
                  <label className="block mb-2 font-medium">이름 *</label>
                  <input
                    type="text"
                    name="name"
                    value={participantForm.name || ''}
                    onChange={handleParticipantFormChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">팀 *</label>
                  <select
                    name="team"
                    value={participantForm.team || ''}
                    onChange={handleParticipantFormChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">팀 선택</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium">역할 *</label>
                  <input
                    type="text"
                    name="role"
                    value={participantForm.role || ''}
                    onChange={handleParticipantFormChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">기수 *</label>
                  <select
                    name="batch"
                    value={participantForm.batch || 1}
                    onChange={handleParticipantFormChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={1}>1기</option>
                    <option value={2}>2기</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {mode === Mode.CREATE ? '추가' : '수정'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default SettingPage;
