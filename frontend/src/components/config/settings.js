import {createClient, createMicrophoneAndCameraTracks} from 'agora-rtc-react'

const appId='e5098a8d79dd40ca974325311dfef08b';
const token='007eJxTYNj4VWO18HcXzpsrlyXazq/i1finHZZTdVz/pfEcse0Sd84oMKSaGlhaJFqkmFumpJgYJCdampsYG5kaGxqmpKWmGVgknfB7mtwQyMjwekYTMyMDBIL4LAy5iZl5DAwAX1YgRg==';

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";