import React, { createContext, useContext, useEffect, useState } from "react";
import { readTextFile, writeTextFile, BaseDirectory, mkdir } from "@tauri-apps/plugin-fs";
import * as path from '@tauri-apps/api/path';

const folderPath = await path.documentDir();
const SETTINGS_FILE = await path.join(folderPath, ('sealNotepad/settings.json'));

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
                const content = await readTextFile(SETTINGS_FILE);

                const parsed = JSON.parse(content);
                const merged = { ...defaultSettings, ...parsed };

                setSettings(merged);

                await writeTextFile(
                    SETTINGS_FILE,
                    JSON.stringify(merged, null, 2)
                );

            } catch (e) {
                await mkdir('sealNotepad', { baseDir: BaseDirectory.Document }); // Ensure folder exists
                await writeTextFile(
                    SETTINGS_FILE,
                    JSON.stringify(defaultSettings, null, 2)
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
            await writeTextFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
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