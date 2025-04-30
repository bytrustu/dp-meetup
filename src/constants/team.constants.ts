import { Team } from '../hooks/useTeamAssignment';

// 팀 정보 리스트
export const TEAMS: Team[] = [
  {
    id: 0,
    name: '호랑이',
    image: '/src/assets/team1.png',
    characteristic: '용감한',
    description: '목표를 향해 도전하고 꾸준히 실천하는 의식적인 연습의 진정한 리더',
  },
  {
    id: 1,
    name: '여우',
    image: '/src/assets/team2.png',
    characteristic: '재치있는',
    description: '창의적 사고로 문제를 다양한 각도에서 접근하며 성장을 이끄는 연습가',
  },
  {
    id: 2,
    name: '곰',
    image: '/src/assets/team3.png',
    characteristic: '든든한',
    description: '안정적이고 꾸준한 연습으로 단단한 기초를 쌓아 장기적 성장을 이루는 꾸준한 실천가',
  },
  {
    id: 3,
    name: '팬더',
    image: '/src/assets/team4.png',
    characteristic: '창의적인',
    description: '독창적인 방식으로 연습 과정을 설계하고 새로운 발전 가능성을 발견하는 혁신가',
  },
  {
    id: 4,
    name: '늑대',
    image: '/src/assets/team5.png',
    characteristic: '지혜로운',
    description: '깊은 통찰력으로 배움의 본질을 파악하고 효율적인 연습 방법을 찾아내는 전략가',
  },
];

// 팀 ID로 팀 정보 찾기
export const getTeamById = (teamId: number): Team | undefined => {
  return TEAMS.find(team => team.id === teamId);
};

// 팀 이름으로 팀 정보 찾기
export const getTeamByName = (teamName: string): Team | undefined => {
  return TEAMS.find(team => team.name === teamName);
};

// 랜덤 팀 배정
export const getRandomTeam = (): Team => {
  const randomIndex = Math.floor(Math.random() * TEAMS.length);
  return TEAMS[randomIndex];
};
