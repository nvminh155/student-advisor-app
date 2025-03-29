import { env } from "@/config/env";
import { http } from "@/lib/http";

const PYTHON_SERVER_PATH = "/dkmhtdmu";

export const pythonService = {
  chat: async (message: string) => {
    return await http.post(
      "/chat",
      { user_message: message },
      {
        baseUrl: env.BASE_URL_PYTHON_SERVER,
      }
    );
  },
};
