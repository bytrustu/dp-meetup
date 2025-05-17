import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LottieRefCurrentProps } from "lottie-react";
import { teamService, participantService } from '../api';
import useTypingText from './useTypingText';
import useJoinQuestions from './useJoinQuestions';
import { Team } from '../features/teams/types';
import { Participant, ParticipantCreate } from '../features/participants/types';

const useJoinFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selections, setSelections] = useState<string[]>([]);
  const { text: displayText, start: startTyping } = useTypingText();
  const { getQuestionText, getOptions } = useJoinQuestions(name, selections);
  const [isLoading, setIsLoading] = useState(false);
  const [showSpark, setShowSpark] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isTeamsLoaded, setIsTeamsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
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

  const startTypingAnimation = () => {
    startTyping(getQuestionText(currentStepRef.current));
  };

  useEffect(() => {
    currentStepRef.current = step;
  }, [step]);

  useEffect(() => {
    startTypingAnimation();
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

  const handleCompleteClick = () => {
    navigate('/main');
  };

  return {
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
  };
};

export default useJoinFlow;
