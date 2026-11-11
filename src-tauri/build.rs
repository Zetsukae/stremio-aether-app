use std::path::PathBuf;
use tauri_build::{Attributes, DefaultPermissionRule, InlinedPlugin};

const COMPANIONS: &[&str] = &["stream-server", "ffmpeg", "ffprobe"];

fn main() {
    copy_companions_to_target();

    let streaming = InlinedPlugin::new()
        .commands(&["start", "stop"])
        .default_permission(DefaultPermissionRule::AllowAllCommands);

    tauri_build::try_build(Attributes::new().plugin("streaming", streaming))
        .expect("failed to run tauri-build");
}

fn copy_companions_to_target() {
    let profile = std::env::var("PROFILE").unwrap_or_else(|_| "debug".into());
    let target = PathBuf::from("target").join(profile);
    let binaries = PathBuf::from("binaries");

    let _ = std::fs::create_dir_all(&target);

    for name in COMPANIONS {
        // On Windows, binaries have .exe extension
        let src = if cfg!(windows) && !name.contains('.') {
            binaries.join(format!("{name}.exe"))
        } else {
            binaries.join(name)
        };

        if !src.exists() {
            continue;
        }
        let dst = target.join(src.file_name().unwrap());
        let _ = std::fs::copy(&src, dst);
        println!("cargo:rerun-if-changed={}", src.display());
    }
}
