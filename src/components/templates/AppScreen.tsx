import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
  padding: ${({theme}) => theme.spacing.md};
`;

export default function AppScreen({children}: {children: React.ReactNode}) {
  return <Container>{children}</Container>;
}
