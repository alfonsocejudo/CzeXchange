import React from 'react';
import styled from 'styled-components/native';

const Emboss = styled.View<{expand?: boolean}>`
  ${({expand}) => expand && 'flex: 1;'}
  border-radius: 16px;
  border-width: 4px;
  border-color: ${({theme}) => theme.colors.embossBorder};
`;

const Wrapper = styled.View<{expand?: boolean}>`
  ${({expand}) => expand && 'flex: 1;'}
  border-radius: 13px;
  overflow: hidden;
`;

const Content = styled.View<{expand?: boolean; padded?: boolean}>`
  ${({expand}) => expand && 'flex: 1;'}
  background-color: ${({theme}) => theme.colors.surfaceContainerLowest};
  padding: ${({padded, theme}) => (padded ? theme.spacing.md : '0px')};
`;

const ShimmerOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ShimmerBand = styled.View`
  position: absolute;
  top: -20%;
  left: -50%;
  width: 70%;
  height: 160%;
  background-color: ${({theme}) => theme.colors.shimmerBand};
  transform: rotate(25deg);
`;

const ShimmerEdge = styled.View`
  position: absolute;
  top: -20%;
  left: 19%;
  width: 2px;
  height: 160%;
  background-color: ${({theme}) => theme.colors.shimmerEdge};
  transform: rotate(25deg);
`;

interface GlassPanelProps {
  children: React.ReactNode;
  padded?: boolean;
  expand?: boolean;
}

export default function GlassPanel({children, padded = true, expand = true}: GlassPanelProps) {
  return (
    <Emboss expand={expand}>
      <Wrapper expand={expand}>
        <Content expand={expand} padded={padded}>{children}</Content>
        <ShimmerOverlay pointerEvents="none">
          <ShimmerBand />
          <ShimmerEdge />
        </ShimmerOverlay>
      </Wrapper>
    </Emboss>
  );
}
