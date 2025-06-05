import Lottie from 'lottie-react';
import loaderAnimation from '@/app/assets/json/loader-lottie.json';
import { useEffect } from 'react';

const PageLoader = ({
  message = 'Please wait',
  showMessage = true,
  isTransparent = true,
}: {
  message?: string;
  showMessage?: boolean;
  isTransparent?: boolean;
}) => {
  useEffect(() => {
    if (document && document.body) {
      const { body } = document;

      body.classList.add('overflow-hidden');
      return () => {
        body.classList.remove('overflow-hidden');
      };
    }
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 flex justify-center items-center w-full h-full p-5 !z-[99999] overflow-hidden ${
        !isTransparent
          ? 'bg-white'
          : 'bg-white/30 backdrop-blur-md backdrop-filter'
      }`}
      style={{ margin: 0 }}
    >
      <center
        className={`z-10 flex flex-col items-center justify-center ${
          showMessage ? 'gap-2' : 'gap-4'
        }`}
      >
        <div className="flex flex-col items-center justify-center animate-pulse absolute max-w-full max-h-full">
          <Lottie
            animationData={loaderAnimation}
            loop
            autoPlay
            className="w-[80px] h-[80px]"
          />
          {showMessage && (
            <p className="text-[#4d4d4d] text-md font-normal">
              {message}...
            </p>
          )}
        </div>
      </center>
    </div>
  );
};

export default PageLoader;
