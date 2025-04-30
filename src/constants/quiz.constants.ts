// 퀴즈 단계별 질문 텍스트
export const QUIZ_QUESTIONS = {
  STEP_1: '<strong>의식적인 연습 밋업</strong>에 참여한 걸 환영해. 이름을 입력해줘!',
  STEP_2: '친구들과 주말에 만나기로 했어. 너의 선택은?',
  STEP_3: '마지막 질문이야! 스트레스를 받았을 때 주로 어떻게 해소해?',
  STEP_4: (name: string) =>
    `흥미로운 결과가 나왔어! ${name}은(는) {selection1}와(과) {selection2}를 선호하는 유형이네!`,
};

// 퀴즈 단계별 선택지
export const QUIZ_OPTIONS = {
  STEP_2: [
    { text: '가서 보고 좋은곳 가자!', value: '즉흥적인 모험' },
    { text: '우리 어디서 만날까?', value: '세부적인 계획' },
    { text: '피곤한데.. 다음에 볼래?', value: '개인적인 시간' },
  ],
  STEP_3: [
    { text: '운동으로 스트레스 해소', value: '활동적인 방법' },
    { text: '음악이나 창작 활동으로 표현', value: '예술적인 표현' },
    { text: '집에서 잠자기', value: '편안한 휴식' },
  ],
};

// 퀴즈 단계 수
export const TOTAL_STEPS = 4;

// 애니메이션 시간
export const ANIMATION_DURATIONS = {
  TYPING: 30, // ms
  LOADING: 5000, // ms
  SPARKLE: 500, // ms
};

// 결과 계산에 사용되는 상수
export const RESULT_CONSTANTS = {
  MAX_TEAM_INDEX: 4,
};
