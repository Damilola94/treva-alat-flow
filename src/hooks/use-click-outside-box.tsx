import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useClickOutsideBox = (ref: any, closeBox: any) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeBox();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, closeBox]);
};
export default useClickOutsideBox;
