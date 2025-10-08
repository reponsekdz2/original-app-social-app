import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  words: string[];
  className?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ words, className }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (index === words.length) {
      setIndex(0);
      return;
    }

    // Finished typing a word
    if (subIndex === words[index].length + 1 && !isDeleting) {
      setBlink(false);
      setTimeout(() => {
        setIsDeleting(true);
        setBlink(true);
      }, 1500);
      return;
    }

    // Finished deleting a word
    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      setText(words[index].substring(0, subIndex + (isDeleting ? -1 : 1)));
    }, isDeleting ? 75 : 120);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words]);

  return (
    <span className={`${className}`}>
      {text}
      <span className={blink ? 'animate-blink' : ''}>|</span>
    </span>
  );
};

export default TypingEffect;
