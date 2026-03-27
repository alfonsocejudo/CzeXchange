import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primaryContainer};
`;

export function LoadingState() {
  const theme = useTheme();
  return (
    <CenteredContainer>
      <ActivityIndicator color={theme.colors.primary} size="large" />
    </CenteredContainer>
  );
}

export function ErrorState({
  message = 'Failed to load rates',
}: {
  message?: string;
}) {
  return (
    <CenteredContainer>
      <ErrorText>{message}</ErrorText>
    </CenteredContainer>
  );
}
