import { createContext, useEffect, useState } from "react";

const INITIAL_STATE = JSON.parse(localStorage.getItem("theme")) || "light";

export const ThemeContext = createContext(INITIAL_STATE);

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(INITIAL_STATE);
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
