import React, {useRef, useCallback} from 'react';
import {Pressable, Animated, Easing} from 'react-native';
import styled from 'styled-components/native';
import Label from '../atoms/Label';

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({theme}) => theme.spacing.xs};
`;

const Name = styled(Label)``;

const RefreshIcon = styled(Animated.Text)`
  font-size: ${({theme}) => theme.fontSizes.lg};
  line-height: ${({theme}) => theme.fontSizes.lg};
  color: ${({theme}) => theme.colors.onSurfaceVariant};
  margin-left: ${({theme}) => theme.spacing.sm};
`;

interface SourceTagProps {
  name: string;
  onRefresh?: () => void;
}

export default function SourceTag({name, onRefresh}: SourceTagProps) {
  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const handleRefresh = useCallback(() => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    onRefresh?.();
  }, [spinValue, onRefresh]);

  return (
    <Row>
      <Name>{name}</Name>
      {onRefresh && (
        <Pressable onPress={handleRefresh} hitSlop={8}>
          <RefreshIcon style={{transform: [{rotate: spin}]}}>{'\u21BB'}</RefreshIcon>
        </Pressable>
      )}
    </Row>
  );
}
