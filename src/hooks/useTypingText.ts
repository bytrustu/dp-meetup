import { useState, useRef, useEffect } from 'react';

const TYPING_INTERVAL = 30;

const useTypingText = () => {
  const [text, setText] = useState('');
  const intervalRef = useRef<number | null>(null);

  const start = (fullText: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setText('');
    let currentIndex = 0;

    intervalRef.current = window.setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(prev => prev + fullText.charAt(currentIndex));
        currentIndex += 1;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, TYPING_INTERVAL);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { text, start };
};

export default useTypingText;
