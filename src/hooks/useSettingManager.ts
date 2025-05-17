import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { participantService, teamService, storageService } from '../api';
import { Participant, ParticipantCreate } from '../features/participants/types';
import { Team, TeamCreate } from '../features/teams/types';

export enum Tab {
  TEAMS = 'teams',
  PARTICIPANTS = 'participants',
}

export enum Mode {
  LIST = 'list',
  CREATE = 'create',
  EDIT = 'edit',
}

const useSettingManager = () => {
  const navigate = useNavigate();
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
  const [teamFilter, setTeamFilter] = useState<string>('전체');

  const [teamForm, setTeamForm] = useState<Partial<TeamCreate>>({
    name: '',
    description: '',
    characteristic: '',
    image_url: '',
    is_active: true,
    batch: 1,
  });

  const [participantForm, setParticipantForm] = useState<Partial<ParticipantCreate>>({
    name: '',
    team: '',
    role: '',
    batch: 1,
  });

  const [teamImage, setTeamImage] = useState<File | null>(null);

  useEffect(() => {
    fetchTeams();
    fetchParticipants();
  }, [batch]);

  const fetchTeams = async () => {
    try {
      setLoading(true);

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

  const filteredParticipants =
    teamFilter === '전체' ? participants : participants.filter(p => p.team === teamFilter);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      let imageUrl = teamForm.image_url;

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

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    try {
      setLoading(true);
      setError(null);

      let imageUrl = teamForm.image_url;

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

  const handleTeamFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
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

  const handleParticipantFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'batch') {
      setParticipantForm(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setParticipantForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTeamImage(e.target.files[0]);
    }
  };

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

  const startCreateMode = () => {
    if (tab === Tab.TEAMS) {
      resetTeamForm();
    } else {
      resetParticipantForm();
    }
    setMode(Mode.CREATE);
  };

  const handleCancel = () => {
    setMode(Mode.LIST);
    if (tab === Tab.TEAMS) {
      resetTeamForm();
    } else {
      resetParticipantForm();
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleGoHome = () => navigate('/', { replace: true });

  return {
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
    setTeamForm,
  };
};

export default useSettingManager;
