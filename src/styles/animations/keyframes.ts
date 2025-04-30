// 모든 애니메이션 키프레임 정의
const keyframes = {
  spin: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,

  progress: `
    @keyframes progress {
      0% {
        stroke-dasharray: 0 320;
      }
      100% {
        stroke-dasharray: 320 0;
      }
    }
  `,

  pulse: `
    @keyframes pulse {
      0% {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.3);
      }
      50% {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 50px rgba(255, 255, 255, 0.5);
      }
      100% {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.3);
      }
    }
  `,

  sparkle: `
    @keyframes sparkle {
      0% {
        transform: scale(0) rotate(0deg);
        opacity: 0;
      }
      50% {
        transform: scale(1.5) rotate(180deg);
        opacity: 1;
      }
      100% {
        transform: scale(0) rotate(360deg);
        opacity: 0;
      }
    }
  `,

  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
};

export default keyframes;
