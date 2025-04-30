/**
 * setTimeout 함수를 Promise로 감싸서 async/await와 함께 사용할 수 있게 해주는 함수
 * @param ms 밀리초 단위의 대기 시간
 * @returns Promise 객체
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * CSS 애니메이션을 동적으로 적용하는 함수
 * @param element 애니메이션을 적용할 HTML 요소
 * @param animationName 애니메이션 이름
 * @param duration 애니메이션 지속 시간(밀리초)
 * @param timingFunction 타이밍 함수 (기본값: ease)
 * @returns 애니메이션이 완료되면 해결되는 Promise
 */
export const applyAnimation = (
  element: HTMLElement,
  animationName: string,
  duration: number,
  timingFunction: string = 'ease'
): Promise<void> => {
  return new Promise(resolve => {
    element.style.animation = `${animationName} ${duration}ms ${timingFunction}`;

    const handleAnimationEnd = () => {
      element.removeEventListener('animationend', handleAnimationEnd);
      resolve();
    };

    element.addEventListener('animationend', handleAnimationEnd);
  });
};

/**
 * 애니메이션 상태를 관리하는 클래스
 */
export class AnimationState {
  private static animatedStates: Record<string, boolean> = {};

  /**
   * 특정 키에 대한 애니메이션 상태를 설정
   * @param key 애니메이션 상태 키
   * @param value 애니메이션 상태 값
   */
  static setAnimated(key: string, value: boolean = true): void {
    this.animatedStates[key] = value;
  }

  /**
   * 특정 키에 대한 애니메이션 상태를 확인
   * @param key 애니메이션 상태 키
   * @returns 애니메이션 상태 값
   */
  static hasAnimated(key: string): boolean {
    return !!this.animatedStates[key];
  }

  /**
   * 특정 키에 대한 애니메이션 상태를 초기화
   * @param key 애니메이션 상태 키
   */
  static resetAnimated(key: string): void {
    delete this.animatedStates[key];
  }

  /**
   * 모든 애니메이션 상태를 초기화
   */
  static resetAll(): void {
    this.animatedStates = {};
  }
}
