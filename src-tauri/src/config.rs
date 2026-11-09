use serde::{Deserialize, Serialize};
use std::fs;
use tauri::{AppHandle, Manager};

const CONFIG_FILE: &str = "config.json";

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum CloseButtonPosition {
    Left,
    Center,
    #[default]
    Right,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    #[serde(default = "default_true")]
    pub auto_update: bool,
    #[serde(default = "default_true")]
    pub titlebar: bool,
    #[serde(default)]
    pub titlebar_close_button: CloseButtonPosition,
}

fn default_true() -> bool {
    true
}

impl Default for Config {
    fn default() -> Self {
        Self {
            auto_update: true,
            titlebar: true,
            titlebar_close_button: CloseButtonPosition::Right,
        }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TitlebarSettings {
    enabled: bool,
    close_button: CloseButtonPosition,
}

#[tauri::command]
pub fn get_titlebar_settings(app: AppHandle) -> TitlebarSettings {
    let config = load(&app);
    TitlebarSettings {
        enabled: config.titlebar,
        close_button: config.titlebar_close_button,
    }
}

#[tauri::command]
pub fn set_titlebar_close_button(app: AppHandle, position: CloseButtonPosition) -> Result<(), String> {
    let mut config = load(&app);
    config.titlebar_close_button = position;
    save(&app, &config)
}

#[tauri::command]
pub fn set_titlebar_enabled(app: AppHandle, enabled: bool) -> Result<(), String> {
    let mut config = load(&app);
    config.titlebar = enabled;
    save(&app, &config)?;
    if let Some(window) = app.get_webview_window("main") {
        window
            .set_decorations(!enabled)
            .map_err(|e| format!("set decorations: {e}"))?;
    }
    Ok(())
}

pub fn load(app: &AppHandle) -> Config {
    let Ok(dir) = app.path().app_config_dir() else {
        return Config::default();
    };
    let path = dir.join(CONFIG_FILE);
    fs::read_to_string(&path)
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default()
}

pub fn save(app: &AppHandle, config: &Config) -> Result<(), String> {
    let dir = app.path().app_config_dir().map_err(|e| format!("config dir: {e}"))?;
    fs::create_dir_all(&dir).map_err(|e| format!("create config dir {}: {e}", dir.display()))?;
    let path = dir.join(CONFIG_FILE);
    let json = serde_json::to_string_pretty(config).map_err(|e| format!("serialize config: {e}"))?;
    fs::write(&path, json).map_err(|e| format!("write {}: {e}", path.display()))?;
    Ok(())
}
