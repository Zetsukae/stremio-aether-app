package com.stremio.mobile.server

import android.app.Activity
import android.content.Intent
import androidx.core.content.ContextCompat
import app.tauri.annotation.Command
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.Plugin

@TauriPlugin
class StreamingPlugin(private val activity: Activity) : Plugin(activity) {
    @Command
    fun start(invoke: Invoke) {
        try {
            ContextCompat.startForegroundService(activity, Intent(activity, StreamingService::class.java))
            invoke.resolve()
        } catch (e: Exception) {
            invoke.reject("Failed to start the streaming service", e)
        }
    }

    @Command
    fun stop(invoke: Invoke) {
        activity.stopService(Intent(activity, StreamingService::class.java))
        invoke.resolve()
    }
}
