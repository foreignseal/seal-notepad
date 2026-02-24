import React, { createContext, useContext, useEffect, useState } from "react";
import { create, exists, readTextFile, writeTextFile, mkdir, BaseDirectory } from "@tauri-apps/plugin-fs";

const folderPath = ({ baseDir: BaseDirectory.Document });
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
            try {
                const content = await readTextFile(SETTINGS_FILE, {
                    baseDir: BaseDirectory.Document,
                    });

                const parsed = JSON.parse(content);
                const merged = { ...defaultSettings, ...parsed };

                setSettings(merged);

                await writeTextFile(
                    SETTINGS_FILE,
                    JSON.stringify(merged, null, 2),
                    { baseDir: BaseDirectory.Document }
                );

            } catch (e) {
                await writeTextFile(
                    SETTINGS_FILE,
                    JSON.stringify(defaultSettings, null, 2),
                    { baseDir: BaseDirectory.Document }
                );

                setSettings(defaultSettings);
            }

/*
            const fileExists = await exists(SETTINGS_FILE, folderPath);

            if (!fileExists) {
                // await create(SETTINGS_FILE, folderPath);
                await writeTextFile(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), folderPath);
                setSettings(defaultSettings);
            } else {
                const content = await readTextFile(SETTINGS_FILE, folderPath);
                const parsed = JSON.parse(content);

                const merged = { ...defaultSettings, ...parsed };

                setSettings(merged);
                await writeTextFile(
                    SETTINGS_FILE, 
                    JSON.stringify(merged, null, 2),
                    folderPath
                );
            }
*/

            setLoaded(true);
        }
        init();
    }, []);

    useEffect(() => {
        if (!loaded) return;

        async function save() {
            await writeTextFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), folderPath);
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