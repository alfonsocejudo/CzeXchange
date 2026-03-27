const colors = {
  // Surfaces
  background: '#131313',
  surface: '#131313',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainerHigh: '#2a2a2a',
  surfaceBright: '#393939',
  surfaceVariant: '#353534',

  // Primary
  primary: '#ffb4aa',
  primaryContainer: '#ff5545',
  primaryGlow: 'rgba(255, 180, 170, 0.4)',

  // Secondary / Accent
  secondary: '#ffb74d',
  success: '#00dc82',
  successGlow: 'rgba(0, 220, 130, 0.5)',
  successBorder: 'rgba(0, 220, 130, 0.6)',
  warningBorder: 'rgba(255, 140, 50, 0.6)',

  // On-surface text
  onSurface: '#e6e1e5',
  onSurfaceVariant: '#e7bdb7',
  text: '#e6e1e5',
  textSecondary: '#e7bdb7',
  textDisabled: '#555555',

  // Embossed / Industrial UI
  embossedText: '#6b6565',
  embossedHighlight: 'rgba(255, 255, 255, 0.6)',
  embossBorder: '#8a8785',

  // Tab bar
  tabLabelActive: '#1a1a1a',
  tabLabelInactive: '#c8c4bf',

  // Overlay / Shimmer
  overlay: 'rgba(0, 0, 0, 0.7)',
  shimmerBand: 'rgba(255, 255, 255, 0.03)',
  shimmerEdge: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(255, 255, 255, 0.05)',

  // Borders / Outlines
  outlineVariant: '#49454f',
};

export const theme = {
  colors,
  textShadows: {
    primaryGlow: { color: colors.primaryGlow, offsetY: 0, radius: 6 },
    primaryGlowSubtle: { color: colors.primaryGlow, offsetY: 0, radius: 4 },
    successGlow: { color: colors.successGlow, offsetY: 0, radius: 10 },
    embossed: { color: colors.embossedHighlight, offsetY: 1, radius: 0 },
    embossedStrong: { color: colors.embossedHighlight, offsetY: 2, radius: 0 },
  },
  fontSizes: {
    xxs: '11px',
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
