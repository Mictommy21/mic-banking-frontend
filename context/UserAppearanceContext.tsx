"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AppearanceMode = "light" | "dark" | "system";

interface UserAppearanceContextType {
  appearance: AppearanceMode;
  darkMode: boolean;
  setAppearance: (appearance: AppearanceMode) => void;
}

const UserAppearanceContext =
  createContext<UserAppearanceContextType | undefined>(
    undefined
  );

export function UserAppearanceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [appearance, setAppearanceState] =
    useState<AppearanceMode>("light");

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedAppearance =
      localStorage.getItem(
        "mic_user_appearance"
      ) as AppearanceMode | null;

    const selectedAppearance =
      savedAppearance || "light";

    setAppearanceState(selectedAppearance);

    applyAppearance(selectedAppearance);
  }, []);

  useEffect(() => {
    if (appearance !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemThemeChange = (
      event: MediaQueryListEvent
    ) => {
      setDarkMode(event.matches);
      applyThemeClass(event.matches);
    };

    setDarkMode(mediaQuery.matches);
    applyThemeClass(mediaQuery.matches);

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );
    };
  }, [appearance]);

  const setAppearance = (
    newAppearance: AppearanceMode
  ) => {
    setAppearanceState(newAppearance);

    localStorage.setItem(
      "mic_user_appearance",
      newAppearance
    );

    applyAppearance(newAppearance);
  };

  const applyAppearance = (
    selectedAppearance: AppearanceMode
  ) => {
    if (selectedAppearance === "dark") {
      setDarkMode(true);
      applyThemeClass(true);
      return;
    }

    if (selectedAppearance === "light") {
      setDarkMode(false);
      applyThemeClass(false);
      return;
    }

    const prefersDark =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

    setDarkMode(prefersDark);
    applyThemeClass(prefersDark);
  };

  const applyThemeClass = (
    isDark: boolean
  ) => {
    document.documentElement.classList.toggle(
      "user-dark",
      isDark
    );
  };

  return (
    <UserAppearanceContext.Provider
      value={{
        appearance,
        darkMode,
        setAppearance,
      }}
    >
      {children}
    </UserAppearanceContext.Provider>
  );
}

export function useUserAppearance() {
  const context = useContext(
    UserAppearanceContext
  );

  if (!context) {
    throw new Error(
      "useUserAppearance must be used inside UserAppearanceProvider"
    );
  }

  return context;
}