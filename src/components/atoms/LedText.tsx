import React, { useMemo } from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import { useTheme } from 'styled-components/native';

interface LedTextProps {
  children: string;
  style?: StyleProp<TextStyle>;
}

export default function LedText({ children, style }: LedTextProps) {
  const theme = useTheme();
  const baseStyle = useMemo(
    () => ({ fontFamily: theme.fonts.ledDisplay }),
    [theme.fonts.ledDisplay],
  );

  return <Text style={[baseStyle, style]}>{children}</Text>;
}
