export const theme = {
  colors: {
    background: '#131313',
    surface: '#131313',
    surfaceContainerLowest: '#0e0e0e',
    surfaceContainerLow: '#1c1b1b',
    surfaceContainerHigh: '#2a2a2a',
    surfaceBright: '#393939',
    surfaceVariant: '#353534',
    primary: '#ffb4aa',
    primaryContainer: '#ff5545',
    secondary: '#ffb74d',
    onSurface: '#e6e1e5',
    onSurfaceVariant: '#e7bdb7',
    outlineVariant: '#49454f',
    textDisabled: '#555555',
    text: '#e6e1e5',
    textSecondary: '#e7bdb7',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};

export type Theme = typeof theme;
