import { useEffect, useState } from "react";

const TypingEffect = ({ text, speed = 50, delay = 0 }) => {
  const [startType, setStartType] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let interval;

    if (startType) {
      if (!text) return;
      setDisplayedText("");

      let index = 0;
      interval = setInterval(() => {
        setDisplayedText((prev) => {
          const newText = prev + text[index];
          index += 1;
          if (index >= text.length) {
            clearInterval(interval);
          }
          return newText;
        });
      }, speed);
    }

    return () => clearInterval(interval);
  }, [text, setDisplayedText, startType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartType(true);
    }, delay);

    return () => {
      if (timer) {
        clearTimeout(timer);
        setStartType(false);
      }
    };
  }, [delay]);

  return <p className="font-normal">{displayedText}</p>;
};

export default TypingEffect;
