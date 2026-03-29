import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';

const DisplayText = styled.Text<{ stale?: boolean; size?: number }>`
  font-family: ${({ theme }) => theme.fonts.ledDisplay};
  font-size: ${({ size }) => size ?? 48}px;
  color: ${({ stale, theme }) =>
    stale ? theme.colors.textDisabled : theme.colors.success};
  text-shadow-color: ${({ stale, theme }) =>
    stale ? 'transparent' : theme.colors.successGlow};
  text-shadow-offset: 0px 0px;
  text-shadow-radius: 10px;
  text-align: center;
`;

const DIGITS = '0123456789';

interface SlotTextProps {
  value: string;
  animate: number;
  stale?: boolean;
  fontSize?: number;
}

export default function SlotText({
  value,
  animate,
  stale,
  fontSize,
}: SlotTextProps) {
  const [display, setDisplay] = useState(value);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (animate === 0) {
      setDisplay(value);
      return;
    }

    const chars = value.split('');
    const current = [...chars];
    const digitSlots: {
      index: number;
      finalChar: string;
      settleTime: number;
    }[] = [];

    let digitIndex = 0;
    chars.forEach((char, i) => {
      if (!DIGITS.includes(char)) return;
      digitSlots.push({
        index: i,
        finalChar: char,
        settleTime: digitIndex * 150 + 300,
      });
      digitIndex++;
    });

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let allSettled = true;

      digitSlots.forEach(({ index, finalChar, settleTime }) => {
        if (elapsed >= settleTime) {
          current[index] = finalChar;
        } else {
          current[index] = DIGITS[Math.floor(Math.random() * 10)];
          allSettled = false;
        }
      });

      setDisplay(current.join(''));

      if (allSettled && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 80);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [value, animate]);

  return (
    <DisplayText stale={stale} size={fontSize}>
      {display}
    </DisplayText>
  );
}
