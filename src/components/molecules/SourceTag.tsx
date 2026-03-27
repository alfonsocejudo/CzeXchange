import React from 'react';
import {Pressable} from 'react-native';
import styled from 'styled-components/native';
import Label from '../atoms/Label';

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({theme}) => theme.spacing.xs};
`;

const Name = styled(Label)``;

const RefreshButton = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.sm};
  color: ${({theme}) => theme.colors.onSurfaceVariant};
  margin-left: ${({theme}) => theme.spacing.sm};
`;

interface SourceTagProps {
  name: string;
  onRefresh?: () => void;
}

export default function SourceTag({name, onRefresh}: SourceTagProps) {
  return (
    <Row>
      <Name>{name}</Name>
      {onRefresh && (
        <Pressable onPress={onRefresh} hitSlop={8}>
          <RefreshButton>{'\u21BB'}</RefreshButton>
        </Pressable>
      )}
    </Row>
  );
}
