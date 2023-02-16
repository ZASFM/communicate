import {createClient, createMicrophoneAndCameraTracks} from 'agora-rtc-react'

const appId='e5098a8d79dd40ca974325311dfef08b';
const token='007eJxTYPijrbpt4+1Dt667OZfFSe6dwB4zoeV8UI3KpCMHOrlzP8xQYEg1NbC0SLRIMbdMSTExSE60NDcxNjI1NjRMSUtNM7BIqrJ+l9wQyMhwN42LkZEBAkF8FobcxMw8BgYAogQgSw==';

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";