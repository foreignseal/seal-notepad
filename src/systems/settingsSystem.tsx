import React, { createContext, useContext, useEffect, useState } from "react";
import { exists, readTextFile, writeTextFile, create } from "@tauri-apps/plugin-fs";
import { appConfigDir } from "@tauri-apps/api/path";

const SETTINGS_FILE = "settings.json";

export type Settings = {
    // Saves
    recentAmount: number;
    autoSave: boolean;

    // Theme
};

// Default Settings
const defaultSettings: Settings = {
    recentAmount: 5,
    autoSave: true,
};

// Context
const SettingsCtx = createContext<{
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
} | null>(null);

// Provider
export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function init() {
            const configDir = await appConfigDir();
            const settingsPath = configDir + SETTINGS_FILE;

            const fileExists = await exists(settingsPath);

            if (!fileExists) {
                await writeTextFile(
                    settingsPath, 
                    JSON.stringify(defaultSettings, null, 2)
                );
                setSettings(defaultSettings);
            } else {
                const content = await readTextFile(settingsPath);
                const parsed = JSON.parse(content);

                const merged = { ...defaultSettings, ...parsed };

                setSettings(merged);
                await writeTextFile(
                    settingsPath, 
                    JSON.stringify(merged, null, 2)
                );
            }

            setLoaded(true);
        }
        init();
    }, []);

    useEffect(() => {
        if (!loaded) return;

        async function save() {
            const configDir = await appConfigDir();
            const settingsPath = configDir + SETTINGS_FILE;

            await writeTextFile(
                settingsPath, 
                JSON.stringify(settings, null, 2)
            );
        }

        save();
    }, [settings, loaded]);

    if (!loaded) return null; // Optional loading screen

    return (
        <SettingsCtx.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsCtx.Provider>
    );
};

/* =========================
   Hook
========================= */
export const useSettings = () => {
  const context = useContext(SettingsCtx);
  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return context;
};