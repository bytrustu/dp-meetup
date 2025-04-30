import keyframes from '../animations/keyframes';

// 전역 스타일을 정의합니다
const globalStyles = {
  // 애니메이션 키프레임
  keyframes: Object.values(keyframes).join('\n'),

  // 기본 스타일 초기화 및 공통 스타일
  reset: `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f5f5f5;
    }
    
    button {
      border: none;
      outline: none;
      cursor: pointer;
      background: transparent;
    }
    
    input {
      outline: none;
    }
  `,

  // 공통 유틸리티 클래스
  utilities: `
    .text-center {
      text-align: center;
    }
    
    .w-full {
      width: 100%;
    }
    
    .h-full {
      height: 100%;
    }
    
    .flex {
      display: flex;
    }
    
    .flex-col {
      flex-direction: column;
    }
    
    .items-center {
      align-items: center;
    }
    
    .justify-center {
      justify-content: center;
    }
    
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    
    .space-x-4 > * + * {
      margin-left: 1rem;
    }
  `,
};

// 모든 전역 스타일을 하나의 문자열로 결합합니다
const getGlobalStyles = () => {
  return Object.values(globalStyles).join('\n');
};

export default getGlobalStyles;
