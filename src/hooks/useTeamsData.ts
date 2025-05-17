import { useState, useEffect } from 'react';
import { teamService, participantService } from '../api';
import { Team } from '../features/teams/types';
import { Participant } from '../features/participants/types';

const TEAM_ORDER = ['호랑이', '사자', '여우', '팬더', '곰', '늑대'];

const useTeamsData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<Participant[]>([]);
  const [changeLoading, setChangeLoading] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [totalFirstBatchParticipants, setTotalFirstBatchParticipants] =
    useState<number>(0);

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
            const activeTeamNames = activeTeams.map(team => team.name);

            const firstBatchParticipants = participantsData.filter(
              p =>
                p.batch === 1 &&
                p.role === '참가자' &&
                activeTeamNames.includes(p.team),
            );
            setTotalFirstBatchParticipants(firstBatchParticipants.length);

            if (selectedTeam) {
              const filteredMembers = participantsData.filter(
                p => p.team === selectedTeam && p.batch === 1,
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
        setError(
          err instanceof Error
            ? err.message
            : '데이터를 불러오는 중 오류가 발생했습니다.',
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTeam]);

  const handleTeamSelect = (teamName: string) => {
    setSelectedTeam(teamName);
  };

  const handleTeamChange = async (
    participantId: string,
    newTeam: string,
    currentName: string,
  ) => {
    if (newTeam === selectedTeam) return;

    try {
      setChangeLoading(prev => ({ ...prev, [participantId]: true }));
      setError(null);
      setSuccessMessage(null);

      const result = await participantService.update(participantId, {
        team: newTeam,
      });

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

  return {
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
  };
};

export default useTeamsData;
