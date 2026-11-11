package com.stremio.mobile.server

import android.content.Context

// Package and names must match the Java_com_stremio_mobile_server_JniStreamingServerController_* exports in stream-server/server/src/jni.rs
object JniStreamingServerController {
    init {
        // Loads the Tauri crate's cdylib, which links the stream-server JNI exports
        System.loadLibrary("stremio_aether_app_lib")
    }

    @JvmStatic
    external fun startServerNative(context: Context, configDir: String, cacheDir: String, port: Int): String?

    @JvmStatic
    external fun stopServerNative()

    @JvmStatic
    external fun getServerUrlNative(): String?
}
