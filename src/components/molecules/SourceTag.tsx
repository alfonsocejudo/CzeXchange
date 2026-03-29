import React, { useCallback } from 'react';
import { Animated, Pressable } from 'react-native';
import styled from 'styled-components/native';
import Label from '../atoms/Label';
import { useSpinAnimation } from '../../hooks/useAnimations';

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const RefreshIcon = styled(Animated.Text)`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

interface SourceTagProps {
  name: string;
  onRefresh?: () => void;
}

export default function SourceTag({ name, onRefresh }: SourceTagProps) {
  const { spin, triggerSpin } = useSpinAnimation();

  const handleRefresh = useCallback(() => {
    triggerSpin();
    onRefresh?.();
  }, [triggerSpin, onRefresh]);

  return (
    <Row>
      <Label>{name}</Label>
      {onRefresh && (
        <Pressable onPress={handleRefresh} hitSlop={8}>
          <RefreshIcon style={{ transform: [{ rotate: spin }] }}>
            {'\u21BB'}
          </RefreshIcon>
        </Pressable>
      )}
    </Row>
  );
}
