export const colors = {
  primary: "#6366f1",
  primaryDark: "#4f46e5",
  secondary: "#ec4899",
  accent: "#06b6d4",
  background: "#0f172a",
  backgroundLight: "#1e293b",
  surface: "#334155",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  gradient1: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  gradient2: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  gradient3: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  gradient4: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
};

export const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: ${colors.background};
    color: ${colors.text};
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background: ${colors.primary};
    color: white;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.backgroundLight};
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.surface};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.primary};
  }
`;
