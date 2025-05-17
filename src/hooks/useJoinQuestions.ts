import { useCallback } from 'react';

export type QuestionOption = {
  value: string;
  label: string;
};

export type Question = {
  text: string;
  options: QuestionOption[];
};

const INTRO_TEXT = '<strong>의식적인 연습 밋업</strong>에 참여한 걸 환영해. 이름을 입력해줘!';
const NAME_PROMPT = '두 번째 단계야. 이름을 알려줘!';
const RESULT_TEMPLATE =
  '흥미로운 결과가 나왔어! {name}은(는) {selection1}와(과) {selection2}를 선호하는 유형이네!';

const QUESTIONS: Question[] = [
  {
    text: '친구들과 주말에 만나기로 했어. 너의 선택은?',
    options: [
      { value: '즉흥적인 모험', label: '가서 보고 좋은곳 가자!' },
      { value: '세부적인 계획', label: '우리 어디서 만날까?' },
      { value: '개인적인 시간', label: '피곤한데.. 다음에 볼래?' },
    ],
  },
  {
    text: '마지막 질문이야! 스트레스를 받았을 때 주로 어떻게 해소해?',
    options: [
      { value: '활동적인 방법', label: '운동으로 스트레스 해소' },
      { value: '예술적인 표현', label: '음악이나 창작 활동으로 표현' },
      { value: '편안한 휴식', label: '집에서 잠자기' },
    ],
  },
];

const useJoinQuestions = (name: string, selections: string[]) => {
  const getQuestionText = useCallback(
    (step: number) => {
      switch (step) {
        case 1:
          return INTRO_TEXT;
        case 2:
          if (!name.trim()) {
            return NAME_PROMPT;
          }
          return QUESTIONS[0].text;
        case 3:
          return QUESTIONS[1].text;
        case 4:
          return RESULT_TEMPLATE.replace('{name}', name)
            .replace('{selection1}', selections[0] || '')
            .replace('{selection2}', selections[1] || '');
        default:
          return '';
      }
    },
    [name, selections]
  );

  const getOptions = useCallback((step: number) => {
    if (step === 2) {
      return QUESTIONS[0].options;
    }
    if (step === 3) {
      return QUESTIONS[1].options;
    }
    return [];
  }, []);

  return { getQuestionText, getOptions };
};

export default useJoinQuestions;
