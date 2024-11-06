export const useEnv = () => {
    return {
        backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL,
    };
}