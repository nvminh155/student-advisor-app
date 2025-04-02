import { env } from "@/config/env";
import { http } from "@/lib/http";
import { TTkbtuanusertheohockyPayload } from "@/types/dkmh";

const DKMH_TDMU_PATH = "/dkmhtdmu";

export interface SessionDKMH {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  userName: string;
  id: string;
  logtime: string;
  code: string;
  result: string;
  passtype: string;
  name: string;
  principal: string;
  idpc: string;
  roles: string;
  wcf: string;
  ".expires": string;
  ".issued": string;
}

export const dkmhTdmuService = {
  login: async (access_token: string) => {
    return await http.post<SessionDKMH>(
      `${DKMH_TDMU_PATH}/login`,
      { access_token },
      {
        baseUrl: env.BASE_URL_NODE_SERVER,
      }
    );
  },
  tkbtuanhocky: async (access_token: string) => {
    return await http.post<TTkbtuanusertheohockyPayload>(
      `${DKMH_TDMU_PATH}/tkbtuanhocky`,
      { access_token },
      {
        baseUrl: env.BASE_URL_NODE_SERVER,
      }
    );
  },
};
