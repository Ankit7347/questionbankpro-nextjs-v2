"use client";
import React, { useEffect, useState } from "react";

type SettingOption = {
  key: string;
  label: string;
  description?: string;
};

const SETTINGS: SettingOption[] = [
  {
    key: "darkMode",
    label: "Dark Mode",
    description: "Enable or disable dark theme",
  },
  {
    key: "notifications",
    label: "Notifications",
    description: "Receive notifications about updates",
  },
];

const SettingToggle: React.FC<{
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
}> = ({ enabled, onToggle, label, description }) => (
  <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4 min-w-[320px]">
    <div>
      <div className="font-medium text-gray-900 dark:text-white">{label}</div>
      {description && (
        <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
      )}
    </div>
    <button
      onClick={onToggle}
      className={`w-10 h-6 rounded-full relative transition-colors ${
        enabled ? "bg-gray-900" : "bg-gray-400"
      }`}
      aria-pressed={enabled}
    >
      <span
        className="block w-5 h-5 bg-white rounded-md shadow absolute top-0.5 left-0.5 transition-transform"
        style={{
          transform: enabled ? "translateX(16px)" : "translateX(0px)",
        }}
      />
    </button>
  </div>
);

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    autoSave: false,
  });

  useEffect(() => {
    // On mount, load theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setSettings((prev) => ({ ...prev, darkMode: true }));
      document.documentElement.classList.add("dark");
    } else {
      setSettings((prev) => ({ ...prev, darkMode: false }));
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleToggle = (key: string) => {
    const newValue = !settings[key as keyof typeof settings];
    setSettings((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    if (key === "darkMode") {
      if (newValue) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      {SETTINGS.map((setting) => (
        <SettingToggle
          key={setting.key}
          enabled={settings[setting.key as keyof typeof settings]}
          onToggle={() => handleToggle(setting.key)}
          label={setting.label}
          description={setting.description}
        />
      ))}
    </div>
  );
};

export default SettingsPage;
