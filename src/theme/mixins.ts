import {css} from 'styled-components/native';
import type {Theme} from './index';

export const primaryGlowShadow = (radius = 6) => css`
  text-shadow-color: ${({theme}) => theme.colors.primaryGlow};
  text-shadow-offset: 0px 0px;
  text-shadow-radius: ${radius}px;
`;

export const successGlowShadow = css`
  text-shadow-color: ${({theme}) => theme.colors.successGlow};
  text-shadow-offset: 0px 0px;
  text-shadow-radius: 10px;
`;

export const embossedShadow = (offsetY = 1) => css`
  text-shadow-color: ${({theme}) => theme.colors.embossedHighlight};
  text-shadow-offset: 0px ${offsetY}px;
  text-shadow-radius: 0px;
`;

export const primaryGlowStyle = (t: Theme, radius = 6) => ({
  textShadowColor: t.colors.primaryGlow,
  textShadowOffset: {width: 0, height: 0},
  textShadowRadius: radius,
});

export const embossedShadowStyle = (t: Theme, offsetY = 1) => ({
  textShadowColor: t.colors.embossedHighlight,
  textShadowOffset: {width: 0, height: offsetY},
  textShadowRadius: 0,
});
