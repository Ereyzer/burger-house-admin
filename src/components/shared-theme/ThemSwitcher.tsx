import { Button, type ButtonProps } from "@mui/material";
import { MyTheme } from "./types";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useColorScheme } from "@mui/material/styles";

function ThemeSwitcher(props: ButtonProps) {
  const { systemMode, mode: theme = systemMode, setMode } = useColorScheme();
  const handleThemeChanger = () => {
    const newValue = theme === MyTheme.DARK ? MyTheme.LIGHT : MyTheme.DARK;

    setMode(newValue);
  };

  return (
    <Button type="button" onClick={handleThemeChanger} {...props}>
      {theme === MyTheme.DARK ? (
        <WbSunnyIcon color="action" />
      ) : (
        // TODO: still not shure about color
        <DarkModeIcon />
      )}
    </Button>
  );
}

export default ThemeSwitcher;
