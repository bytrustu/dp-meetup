/**
 * 주어진 텍스트를 한 글자씩 표시하는 함수
 * @param text 전체 텍스트
 * @param currentIndex 현재 표시할 인덱스
 * @returns 현재 인덱스까지의 부분 텍스트
 */
export const getPartialText = (text: string, currentIndex: number): string => {
  return text.substring(0, currentIndex);
};

/**
 * 선택지에 따라 결과 문장을 생성하는 함수
 * @param template 템플릿 문자열
 * @param selection1 첫 번째 선택
 * @param selection2 두 번째 선택
 * @returns 선택지가 적용된 문자열
 */
export const formatResultText = (
  template: string,
  selection1: string,
  selection2: string
): string => {
  return template.replace('{selection1}', selection1).replace('{selection2}', selection2);
};

/**
 * 문자열 길이에 따라 적절한 폰트 크기를 결정하는 함수
 * @param text 확인할 텍스트
 * @param baseSize 기본 폰트 크기
 * @returns 조정된 폰트 크기
 */
export const getAdaptiveFontSize = (text: string, baseSize: number = 16): number => {
  if (text.length > 20) {
    return baseSize * 0.8;
  } else if (text.length > 10) {
    return baseSize * 0.9;
  }
  return baseSize;
};

/**
 * 텍스트에서 HTML 태그를 제거하는 함수
 * @param html HTML이 포함된 문자열
 * @returns HTML 태그가 제거된 순수 텍스트
 */
export const stripHtml = (html: string): string => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};
