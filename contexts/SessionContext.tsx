import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./auth-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dkmhTdmuService, SessionDKMH } from "@/service/dkmhTdmuService";
import { Spinner } from "@/components/ui/spinner";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { useRouter } from "expo-router";

// type TokenResponse = {
//   // Define the structure of TokenResponse here
// };

type TSession = {
  sessionDKMH: SessionDKMH;
} | null;

type SessionContextType = {
  session: TSession;
  setSession: React.Dispatch<React.SetStateAction<TSession>>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const toast = useToast();
  const router = useRouter();

  const { session: sessionGmail } = useAuth();
  const [session, setSession] = useState<TSession>(null);

  const query = useQuery({
    queryKey: ["session-dkmh"],
    queryFn: async () => {
      // Fetch session data here if needed
      return await dkmhTdmuService.login(
        sessionGmail?.sessionAPP?.accessToken ?? ""
      );
    },
  });

  // set expire
  // useEffect(() => {
  //   console.log('data dkmh login change', )

  //   if(query.data?.payload) {
  //     setTimeout(() => {}, 1000);
  //   }
  // }, [query.data]);

  useEffect(() => {
    console.log("session dkmh", query.data?.payload);
    if (query.data?.payload) {
      queryClient.prefetchQuery({
        queryKey: ["events-dkmh"],
        queryFn: async () => {
          return await dkmhTdmuService.tkbtuanhocky(
            query.data?.payload.access_token ?? "???"
          );
        },
        staleTime: 5 * 24 * 60 * 60 * 1000, // 5 days
      });
    }
  }, [query.data]);

  console.log("session dkmh", sessionGmail, query.data?.payload);
  console.log("query state", query.isLoading, query.isError, query.isFetching);
  if (query.isLoading || query.isFetching) return <Spinner />;

  if (
    query.isError ||
    (!query.data?.payload && !query.isLoading) ||
    !query.data?.payload
  ) {
    // toast.show({
    //   id: "session-error",
    //   placement: "top",
    //   duration: 2000,
    //   render: () => {
    //     return (
    //       <Toast action="error" variant="solid">
    //         <ToastTitle>Error</ToastTitle>
    //         <ToastDescription>
    //           {"Please use email with extend @student.tdmu.edu.vn"}
    //         </ToastDescription>
    //       </Toast>
    //     );
    //   },
    // });
    queryClient.cancelQueries({
      queryKey: ["session-dkmh"],
    });
    router.push("/login");
    return null;
  }

  return (
    <SessionContext.Provider
      value={{
        session: {
          sessionDKMH: query.data.payload,
        },
        setSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
