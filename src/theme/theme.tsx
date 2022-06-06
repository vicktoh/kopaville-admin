import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    500: "#2A9A4A",
    400: "#5DB777",
    300: "#9CCDAA",
    200: "#CFE1D4",
    100: "#EEF5F0",
  },
  secondary: {
    500: "#FBEB85",
    400: "#F5EEBF",
    300: "#FAF6DE",
    200: "#FDFBF0",
    100: "#FEFCF4",
  },
};

const fonts = {
  heading: "Poppins, sans-serif",
  body: "Poppins, sans-serif",
};

export const theme = extendTheme({ colors, fonts });
