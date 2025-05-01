import React, { useState, useEffect } from 'react';
import { participantService, teamService, storageService } from '../../api';
import { Participant, ParticipantCreate } from '../../types/participant.types';
import { Team, TeamCreate } from '../../types/team.types';

enum Tab {
  TEAMS = 'teams',
  PARTICIPANTS = 'participants',
}

enum Mode {
  LIST = 'list',
  CREATE = 'create',
  EDIT = 'edit',
}

const SettingPage = () => {
  // 상태 관리
  const [tab, setTab] = useState<Tab>(Tab.TEAMS);
  const [mode, setMode] = useState<Mode>(Mode.LIST);
  const [batch, setBatch] = useState<number>(1);
  const [teams, setTeams] = useState<Team[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 팀 폼 상태
  const [teamForm, setTeamForm] = useState<Partial<TeamCreate>>({
    name: '',
    description: '',
    characteristic: '',
    image_url: '',
    is_active: true,
    batch: 1,
  });
  
  // 참가자 폼 상태
  const [participantForm, setParticipantForm] = useState<Partial<ParticipantCreate>>({
    name: '',
    team: '',
    role: '',
    batch: 1,
  });

  // 이미지 업로드용 상태
  const [teamImage, setTeamImage] = useState<File | null>(null);
  
  // 초기 데이터 로드
  useEffect(() => {
    fetchTeams();
    fetchParticipants();
  }, [batch]);

  // 팀 데이터 가져오기
  const fetchTeams = async () => {
    try {
      setLoading(true);
      // getAllByBatch를 사용하여 모든 팀(활성화 여부와 관계없이)을 가져옴
      const result = await teamService.getAllByBatch(batch);
      if (result) {
        setTeams(result);
      } else {
        setError('팀 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 참가자 데이터 가져오기
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const result = await participantService.getByBatch(batch);
      if (result) {
        setParticipants(result);
      } else {
        setError('참가자 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 팀 생성 핸들러
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      let imageUrl = teamForm.image_url;
      
      // 이미지 파일이 있으면 업로드
      if (teamImage) {
        const path = `teams/${Date.now()}_${teamImage.name}`;
        const uploadedUrl = await storageService.uploadImage(teamImage, path);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setError('이미지 업로드에 실패했습니다.');
          setLoading(false);
          return;
        }
      }
      
      const newTeam: TeamCreate = {
        name: teamForm.name || '',
        description: teamForm.description || '',
        characteristic: teamForm.characteristic || '',
        image_url: imageUrl || '',
        is_active: teamForm.is_active !== undefined ? teamForm.is_active : true,
        batch: teamForm.batch || batch,
      };
      
      const result = await teamService.create(newTeam);
      if (result) {
        setSuccess('팀이 성공적으로 생성되었습니다.');
        setMode(Mode.LIST);
        fetchTeams();
        resetTeamForm();
      } else {
        setError('팀 생성에 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 팀 수정 핸들러
  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let imageUrl = teamForm.image_url;
      
      // 이미지 파일이 있으면 업로드
      if (teamImage) {
        const path = `teams/${Date.now()}_${teamImage.name}`;
        const uploadedUrl = await storageService.uploadImage(teamImage, path);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setError('이미지 업로드에 실패했습니다.');
          setLoading(false);
          return;
        }
      }
      
      const updatedTeam: Partial<TeamCreate> = {
        name: teamForm.name,
        description: teamForm.description,
        characteristic: teamForm.characteristic,
        is_active: teamForm.is_active,
        batch: teamForm.batch,
      };
      
      // 이미지가 변경된 경우에만 추가
      if (imageUrl && imageUrl !== selectedTeam.image_url) {
        updatedTeam.image_url = imageUrl;
      }
      
      const result = await teamService.update(selectedTeam.id, updatedTeam);
      if (result) {
        setSuccess('팀이 성공적으로 수정되었습니다.');
        setMode(Mode.LIST);
        fetchTeams();
        resetTeamForm();
      } else {
        setError('팀 수정에 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 팀 삭제 핸들러
  const handleDeleteTeam = async (id: string) => {
    if (!window.confirm('정말로 이 팀을 삭제하시겠습니까?')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const success = await teamService.delete(id);
      if (success) {
        setSuccess('팀이 성공적으로 삭제되었습니다.');
        fetchTeams();
      } else {
        setError('팀 삭제에 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 참가자 생성 핸들러
  const handleCreateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const newParticipant: ParticipantCreate = {
        name: participantForm.name || '',
        team: participantForm.team || '',
        role: participantForm.role || '',
        batch: participantForm.batch || batch,
      };
      
      const result = await participantService.create(newParticipant);
      if (result) {
        setSuccess('참가자가 성공적으로 생성되었습니다.');
        setMode(Mode.LIST);
        fetchParticipants();
        resetParticipantForm();
      } else {
        setError('참가자 생성에 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 참가자 수정 핸들러
  const handleUpdateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const updatedParticipant: Partial<ParticipantCreate> = {
        name: participantForm.name,
        team: participantForm.team,
        role: participantForm.role,
        batch: participantForm.batch,
      };
      
      const result = await participantService.update(selectedParticipant.id, updatedParticipant);
      if (result) {
        setSuccess('참가자가 성공적으로 수정되었습니다.');
        setMode(Mode.LIST);
        fetchParticipants();
        resetParticipantForm();
      } else {
        setError('참가자 수정에 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 참가자 삭제 핸들러
  const handleDeleteParticipant = async (id: string) => {
    if (!window.confirm('정말로 이 참가자를 삭제하시겠습니까?')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const success = await participantService.delete(id);
      if (success) {
        setSuccess('참가자가 성공적으로 삭제되었습니다.');
        fetchParticipants();
      } else {
        setError('참가자 삭제에 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 팀 편집 모드 시작
  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setTeamForm({
      name: team.name,
      description: team.description,
      characteristic: team.characteristic,
      image_url: team.image_url,
      is_active: team.is_active,
      batch: team.batch,
    });
    setMode(Mode.EDIT);
  };

  // 참가자 편집 모드 시작
  const handleEditParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
    setParticipantForm({
      name: participant.name,
      team: participant.team,
      role: participant.role,
      batch: participant.batch,
    });
    setMode(Mode.EDIT);
  };

  // 폼 필드 변경 핸들러 - 팀
  const handleTeamFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setTeamForm(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'batch') {
      setTeamForm(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setTeamForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // 폼 필드 변경 핸들러 - 참가자
  const handleParticipantFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'batch') {
      setParticipantForm(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setParticipantForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // 이미지 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTeamImage(e.target.files[0]);
    }
  };

  // 폼 초기화
  const resetTeamForm = () => {
    setTeamForm({
      name: '',
      description: '',
      characteristic: '',
      image_url: '',
      is_active: true,
      batch: batch,
    });
    setTeamImage(null);
    setSelectedTeam(null);
  };

  const resetParticipantForm = () => {
    setParticipantForm({
      name: '',
      team: '',
      role: '',
      batch: batch,
    });
    setSelectedParticipant(null);
  };

  // 생성 모드 시작
  const startCreateMode = () => {
    if (tab === Tab.TEAMS) {
      resetTeamForm();
    } else {
      resetParticipantForm();
    }
    setMode(Mode.CREATE);
  };

  // 취소 핸들러
  const handleCancel = () => {
    setMode(Mode.LIST);
    if (tab === Tab.TEAMS) {
      resetTeamForm();
    } else {
      resetParticipantForm();
    }
  };

  // 알림 메시지 초기화
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">관리자 설정</h1>
      
      {/* 탭 네비게이션 */}
      <div className="flex mb-4 border-b">
        <button
          className={`py-2 px-4 ${tab === Tab.TEAMS ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => { setTab(Tab.TEAMS); setMode(Mode.LIST); clearMessages(); }}
        >
          팀 관리
        </button>
        <button
          className={`py-2 px-4 ${tab === Tab.PARTICIPANTS ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => { setTab(Tab.PARTICIPANTS); setMode(Mode.LIST); clearMessages(); }}
        >
          참가자 관리
        </button>
      </div>
      
      {/* 기수 선택 */}
      <div className="mb-4">
        <label className="block mb-2">기수 선택:</label>
        <div className="flex">
          <button
            className={`mr-2 px-3 py-1 rounded ${batch === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setBatch(1)}
          >
            1기
          </button>
          <button
            className={`mr-2 px-3 py-1 rounded ${batch === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setBatch(2)}
          >
            2기
          </button>
        </div>
      </div>
      
      {/* 알림 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button className="float-right" onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
          <button className="float-right" onClick={() => setSuccess(null)}>×</button>
        </div>
      )}
      
      {/* 로딩 표시 */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            로딩 중...
          </div>
        </div>
      )}
      
      {/* 모드에 따른 UI 렌더링 */}
      {mode === Mode.LIST && (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {tab === Tab.TEAMS ? `${batch}기 팀 목록` : `${batch}기 참가자 목록`}
            </h2>
            <button
              onClick={startCreateMode}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {tab === Tab.TEAMS ? '새 팀 추가' : '새 참가자 추가'}
            </button>
          </div>
          
          {tab === Tab.TEAMS ? (
            // 팀 목록
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">이름</th>
                    <th className="border px-4 py-2 hidden md:table-cell">특성</th>
                    <th className="border px-4 py-2 hidden md:table-cell">이미지</th>
                    <th className="border px-4 py-2">상태</th>
                    <th className="border px-4 py-2 hidden md:table-cell">기수</th>
                    <th className="border px-4 py-2">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.length > 0 ? (
                    teams.map(team => (
                      <tr key={team.id}>
                        <td className="border px-4 py-2">
                          <div className="flex items-center">
                            <div className="md:hidden mr-2">
                              {team.image_url ? (
                                <img
                                  src={team.image_url}
                                  alt={team.name}
                                  className="h-8 w-8 object-cover rounded"
                                  onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                                  }}
                                />
                              ) : null}
                            </div>
                            <span>{team.name}</span>
                          </div>
                        </td>
                        <td className="border px-4 py-2 hidden md:table-cell">{team.characteristic}</td>
                        <td className="border px-4 py-2 hidden md:table-cell">
                          {team.image_url ? (
                            <img
                              src={team.image_url}
                              alt={team.name}
                              className="h-10 w-10 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                              }}
                            />
                          ) : (
                            '이미지 없음'
                          )}
                        </td>
                        <td className="border px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${team.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {team.is_active ? '활성' : '비활성'}
                          </span>
                        </td>
                        <td className="border px-4 py-2 hidden md:table-cell">{team.batch}기</td>
                        <td className="border px-4 py-2">
                          <div className="flex">
                            <button
                              onClick={() => handleEditTeam(team)}
                              className="bg-blue-500 text-white px-2 py-1 rounded mr-1 text-sm flex-shrink-0"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteTeam(team.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-sm flex-shrink-0"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="border px-4 py-2 text-center">
                        데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            // 참가자 목록
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">이름</th>
                    <th className="border px-4 py-2">팀</th>
                    <th className="border px-4 py-2 hidden md:table-cell">역할</th>
                    <th className="border px-4 py-2 hidden md:table-cell">기수</th>
                    <th className="border px-4 py-2 hidden md:table-cell">등록일</th>
                    <th className="border px-4 py-2">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.length > 0 ? (
                    participants.map(participant => (
                      <tr key={participant.id}>
                        <td className="border px-4 py-2">{participant.name}</td>
                        <td className="border px-4 py-2">{participant.team}</td>
                        <td className="border px-4 py-2 hidden md:table-cell">{participant.role}</td>
                        <td className="border px-4 py-2 hidden md:table-cell">{participant.batch}기</td>
                        <td className="border px-4 py-2 hidden md:table-cell">
                          {new Date(participant.registered_at).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="border px-4 py-2">
                          <div className="flex">
                            <button
                              onClick={() => handleEditParticipant(participant)}
                              className="bg-blue-500 text-white px-2 py-1 rounded mr-1 text-sm flex-shrink-0"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteParticipant(participant.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-sm flex-shrink-0"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="border px-4 py-2 text-center">
                        데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* 팀 생성/수정 폼 */}
      {tab === Tab.TEAMS && (mode === Mode.CREATE || mode === Mode.EDIT) && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            {mode === Mode.CREATE ? '새 팀 추가' : '팀 정보 수정'}
          </h2>
          
          <form onSubmit={mode === Mode.CREATE ? handleCreateTeam : handleUpdateTeam}>
            <div className="mb-4">
              <label className="block mb-1">팀 이름 *</label>
              <input
                type="text"
                name="name"
                value={teamForm.name || ''}
                onChange={handleTeamFormChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">특성 *</label>
              <input
                type="text"
                name="characteristic"
                value={teamForm.characteristic || ''}
                onChange={handleTeamFormChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">설명 *</label>
              <textarea
                name="description"
                value={teamForm.description || ''}
                onChange={handleTeamFormChange}
                className="w-full px-3 py-2 border rounded"
                rows={3}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">현재 이미지</label>
              {teamForm.image_url ? (
                <div className="mb-2">
                  <img
                    src={teamForm.image_url}
                    alt="팀 이미지"
                    className="h-24 w-24 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 mb-2">이미지 없음</p>
              )}
              
              <label className="block mb-1">새 이미지 업로드</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {teamImage && (
                <p className="text-sm text-blue-500 mt-1">
                  선택됨: {teamImage.name}
                </p>
              )}
            </div>
            
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={teamForm.is_active}
                onChange={(e) => setTeamForm(prev => ({ ...prev, is_active: e.target.checked }))}
                className="mr-2"
                id="is_active"
              />
              <label htmlFor="is_active">활성화</label>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">기수 *</label>
              <select
                name="batch"
                value={teamForm.batch || 1}
                onChange={handleTeamFormChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value={1}>1기</option>
                <option value={2}>2기</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border rounded"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
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
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            {mode === Mode.CREATE ? '새 참가자 추가' : '참가자 정보 수정'}
          </h2>
          
          <form onSubmit={mode === Mode.CREATE ? handleCreateParticipant : handleUpdateParticipant}>
            <div className="mb-4">
              <label className="block mb-1">이름 *</label>
              <input
                type="text"
                name="name"
                value={participantForm.name || ''}
                onChange={handleParticipantFormChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">팀 *</label>
              <select
                name="team"
                value={participantForm.team || ''}
                onChange={handleParticipantFormChange}
                className="w-full px-3 py-2 border rounded"
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
            
            <div className="mb-4">
              <label className="block mb-1">역할 *</label>
              <input
                type="text"
                name="role"
                value={participantForm.role || ''}
                onChange={handleParticipantFormChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">기수 *</label>
              <select
                name="batch"
                value={participantForm.batch || 1}
                onChange={handleParticipantFormChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value={1}>1기</option>
                <option value={2}>2기</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border rounded"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={loading}
              >
                {mode === Mode.CREATE ? '추가' : '수정'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingPage;
