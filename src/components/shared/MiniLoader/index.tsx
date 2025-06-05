'use client';

import { FC } from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '@/app/assets/json/loader-lottie.json';

type MiniLoaderProps = {
  size?: number;
  className?: string;
  message?: string;
};

const MiniLoader: FC<MiniLoaderProps> = ({
  size = 80,
  className = '',
  message,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-full ${className}`}
    >
      <Lottie
        animationData={loaderAnimation}
        loop
        autoPlay
        className="w-[80px] h-[80px] animate-pulse"
        style={{ width: size, height: size }}
      />
      {message && (
        <p className="mt-3 animate-pulse text-sm text-gray-500 text-center">
          {message}
        </p>
      )}
    </div>
  );
};

export default MiniLoader;
