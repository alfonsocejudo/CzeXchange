import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import styled from 'styled-components/native';

const DigitText = styled.Text<{stale?: boolean; size?: number}>`
  font-size: ${({size}) => size ?? 48}px;
  font-weight: bold;
  color: ${({stale, theme}) =>
    stale ? theme.colors.textDisabled : theme.colors.success};
  text-shadow-color: ${({stale, theme}) =>
    stale ? 'transparent' : theme.colors.successGlow};
  text-shadow-offset: 0px 0px;
  text-shadow-radius: 10px;
  text-align: center;
`;

const DIGITS = '0123456789';

function SlotDigit({
  char,
  delay,
  animate,
  stale,
  fontSize,
}: {
  char: string;
  delay: number;
  animate: number;
  stale?: boolean;
  fontSize?: number;
}) {
  const isDigit = DIGITS.includes(char);
  const [display, setDisplay] = useState(char);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isDigit || animate === 0) {
      setDisplay(char);
      return;
    }

    // Start cycling random digits
    intervalRef.current = setInterval(() => {
      setDisplay(DIGITS[Math.floor(Math.random() * 10)]);
    }, 80);

    // Stop cycling and show final digit after delay
    const timeout = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setDisplay(char);
    }, delay + 300);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearTimeout(timeout);
    };
  }, [char, delay, animate, isDigit]);

  return <DigitText stale={stale} size={fontSize}>{isDigit ? display : char}</DigitText>;
}

interface SlotTextProps {
  value: string;
  animate: number;
  stale?: boolean;
  fontSize?: number;
}

export default function SlotText({value, animate, stale, fontSize}: SlotTextProps) {
  const chars = value.split('');
  let digitIndex = 0;

  return (
    <View style={styles.row}>
      {chars.map((char, i) => {
        const isDigit = DIGITS.includes(char);
        const delay = isDigit ? digitIndex * 150 : 0;
        if (isDigit) {
          digitIndex++;
        }
        return (
          <SlotDigit key={i} char={char} delay={delay} animate={animate} stale={stale} fontSize={fontSize} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
