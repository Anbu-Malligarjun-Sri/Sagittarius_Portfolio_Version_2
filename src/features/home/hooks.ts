import { useEffect, useState } from 'react';

export const useTypewriter = (texts: string[], speed = 50, pause = 2000) => {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const currentText = texts[index];

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayed(currentText.substring(0, displayed.length - 1));
        if (displayed.length <= 1) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % texts.length);
        }
      }, speed / 2);
    } else if (displayed === currentText) {
      timer = setTimeout(() => setIsDeleting(true), pause);
    } else {
      timer = setTimeout(() => {
        setDisplayed(currentText.substring(0, displayed.length + 1));
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, index, texts, speed, pause]);

  return displayed;
};
