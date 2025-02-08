import { createContext, useEffect, useState } from "react";
import { CssBaseline, Theme, ThemeProvider, useMediaQuery } from "@mui/material";
import { lanLight, lanDark } from './BuildInTheme';

export type LanThemeContextT = {
  mode: () => string,
  setLightTheme: () => void,
  setDarkTheme: () => void,
  isDarkTheme: () => boolean,
  isLightTheme: () => boolean,
  switchTheme: () => void,
};

export type LanThemeContextProviderProps = {
  children: JSX.Element,
}

export const LanThemeContext = createContext<LanThemeContextT>({} as LanThemeContextT);

export function LanThemeContextProvider({ children }: LanThemeContextProviderProps) {
  const [theme, setTheme] = useState<Theme>(lanLight);

  // Check the system setting.
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Set default theme depend on the user preference.
  useEffect(() => setTheme(prefersDarkMode ? lanDark : lanLight), [prefersDarkMode]);

  // Some useful method to change mode.
  const mode = () => theme.palette.mode;
  const setLightTheme = () => setTheme(lanLight);
  const setDarkTheme = () => setTheme(lanDark);
  const isDarkTheme = (): boolean => theme === lanDark;
  const isLightTheme = (): boolean => theme === lanLight;
  const switchTheme = () => setTheme(isLightTheme() ? lanDark : lanLight);

  // Assign the value.
  const value: LanThemeContextT = {
    mode: mode,
    setLightTheme: setLightTheme,
    setDarkTheme: setDarkTheme,
    isDarkTheme: isDarkTheme,
    isLightTheme: isLightTheme,
    switchTheme: switchTheme,
  };

  return (
    <LanThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        {/* Reset css rules. */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </LanThemeContext.Provider>
  );
}
