const WINDOW_IP = "192.168.215.108";
const BASE = `http://${WINDOW_IP}`;

export const env = {
  BASE_URL_NODE_SERVER: `${BASE}:3000`,
  BASE_URL_PYTHON_SERVER: `${BASE}:8000`,
  EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
};
