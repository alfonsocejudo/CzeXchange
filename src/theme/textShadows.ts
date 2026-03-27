import { css } from 'styled-components/native';
import type { Theme } from './index';

type ShadowKey = keyof Theme['textShadows'];

export const textShadow = (key: ShadowKey) => css`
  text-shadow-color: ${({ theme }) => theme.textShadows[key].color};
  text-shadow-offset: 0px ${({ theme }) => theme.textShadows[key].offsetY}px;
  text-shadow-radius: ${({ theme }) => theme.textShadows[key].radius}px;
`;

export const textShadowStyle = (shadow: Theme['textShadows'][ShadowKey]) => ({
  textShadowColor: shadow.color,
  textShadowOffset: { width: 0, height: shadow.offsetY },
  textShadowRadius: shadow.radius,
});
