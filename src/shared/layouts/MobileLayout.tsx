import { ReactNode } from 'react';
import keyframes from '../../styles/animations/keyframes';

type MobileLayoutProps = {
  children: ReactNode;
  backgroundColor?: string;
  backgroundImage?: string;
};

export const MobileLayout = ({
  children,
  backgroundColor,
  backgroundImage,
}: MobileLayoutProps) => {
  return (
    <div
      className="flex items-center justify-center min-h-screen w-screen"
      style={{ backgroundColor: '#e5e7eb59' }}
    >
      <style>{keyframes.fadeIn}</style>
      <style>{keyframes.pulse}</style>

      <div
        className="relative w-full max-w-[390px] max-h-[700px] h-dvh overflow-auto border-gray-300 border-[1px]"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;
