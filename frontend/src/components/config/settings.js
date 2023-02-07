import {createClient, createMicrophoneAndCameraTracks} from 'agora-rtc-react'

const appId='e5098a8d79dd40ca974325311dfef08b';
const token='007eJxTYLio+DlA+/vGlVsLtOMCTJes3rF39drbRc/kmjb2+uZHOYgqMKSaGlhaJFqkmFumpJgYJCdampsYG5kaGxqmpKWmGVgkvd/9KLkhkJHh9qwOVkYGCATxWRhyEzPzGBgAzfshyQ==';

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";