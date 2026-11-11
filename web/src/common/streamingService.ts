import { name as platformName } from './Platform/device';
import { invokeTauri, isTauri } from './tauri';

const STREAMING_SERVER_HEARTBEAT_URL = 'http://127.0.0.1:11470/heartbeat';
const START_TIMEOUT_MS = 15_000;
const POLL_INTERVAL_MS = 250;

const isAndroidApp = () => isTauri() && platformName === 'android';

const isStreamingServerUp = async () => {
    try {
        const response = await fetch(STREAMING_SERVER_HEARTBEAT_URL, { cache: 'no-store' });
        return response.ok;
    } catch {
        return false;
    }
};

const waitForStreamingServer = async () => {
    const deadline = Date.now() + START_TIMEOUT_MS;

    while (Date.now() < deadline) {
        if (await isStreamingServerUp()) return;
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    throw new Error('Streaming server did not respond in time');
};

export const startAndroidStreamingService = async () => {
    if (!isAndroidApp()) return;

    await invokeTauri('plugin:streaming|start');
    await waitForStreamingServer();
};

export const stopAndroidStreamingService = async () => {
    if (!isAndroidApp()) return;

    await invokeTauri('plugin:streaming|stop');
};
