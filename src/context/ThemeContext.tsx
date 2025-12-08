import { ReactNode, createContext, useState, useEffect } from "react";
import { Appearance, useColorScheme } from "react-native";
import { Colors } from "@/constants";

type Theme = typeof Colors.light | typeof Colors.dark;

interface ThemeProviderProps {
  children: ReactNode;
};

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: Colors.light,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(Colors.light);

  useEffect(() => {
    setTheme(Colors[colorScheme!] ?? Colors.light);
  }, [colorScheme]);
  
  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === Colors.light ? Colors.dark : Colors.light;
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};