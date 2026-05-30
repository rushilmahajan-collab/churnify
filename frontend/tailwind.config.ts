import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#09090b',
          surface: '#0f0f12',
          'surface-raised': '#18181b',
          'surface-overlay': '#1c1c20',
          'surface-inset': '#0a0a0e',
        },
        border: {
          default: '#27272a',
          subtle: '#1e1e22',
          emphasis: '#3f3f46',
        },
        text: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          muted: '#71717a',
          faint: '#52525b',
        },
        status: {
          healthy: '#22c55e',
          'healthy-subtle': '#22c55e18',
          'healthy-muted': '#16a34a',
          warning: '#f59e0b',
          'warning-subtle': '#f59e0b18',
          'warning-muted': '#d97706',
          critical: '#ef4444',
          'critical-subtle': '#ef444418',
          'critical-muted': '#dc2626',
        },
        accent: {
          default: '#8b5cf6',
          hover: '#7c3aed',
          subtle: '#8b5cf615',
          muted: '#6d28d9',
        },
        info: {
          default: '#3b82f6',
          subtle: '#3b82f618',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        'sidebar': '256px',
        'sidebar-collapsed': '64px',
        'header': '56px',
      },
      width: {
        'sidebar': '256px',
        'sidebar-collapsed': '64px',
      },
      height: {
        'header': '56px',
      },
      animation: {
        'pulse': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      transitionDuration: {
        fast: '150ms',
        default: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;
