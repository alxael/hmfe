import { createTheme, PaletteMode } from "@mui/material";

export const getTheme = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            default: "#fafafa",
            paper: "#fff",
          },
        }
      : {
          background: {
            default: "#303030",
            paper: "#424242",
          },
        }),
  },
});

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },
});
