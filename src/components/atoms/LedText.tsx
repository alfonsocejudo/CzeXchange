import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import { useTheme } from 'styled-components/native';

interface LedTextProps {
  children: string;
  style?: StyleProp<TextStyle>;
}

export default function LedText({ children, style }: LedTextProps) {
  const theme = useTheme();

  return (
    <Text style={[{ fontFamily: theme.fonts.ledDisplay }, style]}>
      {children}
    </Text>
  );
}
