import { IconButton } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useContext } from "react";
import { LanThemeContext, LanThemeContextT } from "../../common/LanThemeContext";

export function ThemeSwitchBtn() {
  const { switchTheme, isDarkTheme } = useContext<LanThemeContextT>(LanThemeContext);

  return (
    <IconButton color={'inherit'} aria-label={'switch theme'} onClick={switchTheme}>
      {isDarkTheme() ? <WbSunnyIcon fontSize={'large'} /> : <DarkModeIcon fontSize={'large'} />}
    </IconButton>
  );
}