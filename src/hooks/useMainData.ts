import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamService, participantService } from '../api';
import { Team } from '../features/teams/types';
import { Participant } from '../features/participants/types';

const useMainData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<Participant[]>([]);
  const [currentParticipant, setCurrentParticipant] =
    useState<Participant | null>(null);

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
          const sameTeamMembers = allParticipants.filter(
            p => p.team === participantTeam,
          );
          setTeamMembers(sameTeamMembers);
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
  }, [navigate]);

  const handleLeaveTeam = () => {
    localStorage.removeItem('participantId');
    localStorage.removeItem('participantName');
    localStorage.removeItem('participantTeam');
    localStorage.removeItem('participantRole');
    localStorage.removeItem('participantBatch');
    navigate('/');
  };

  return {
    loading,
    error,
    team,
    teamMembers,
    currentParticipant,
    handleLeaveTeam,
  };
};

export default useMainData;
