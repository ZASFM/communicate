import {createClient, createMicrophoneAndCameraTracks} from 'agora-rtc-react'

const appId='6722330114424e0682c27f92cd0cac7d';
const token='007eJxTYEhcusLXTyD1zKQzZad/zHZx931WLrooQMd2yRQxnrffkq8pMJiZGxkZGxsYGpqYGJmkGphZGCUbmadZGiWnGCQnJpun2Dy9k9wQyMhQUXiFmZEBAkF8FobcxMw8BgYAQdkfqw==';

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";