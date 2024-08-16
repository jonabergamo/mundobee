"use client";
import React, { useEffect } from "react";
import Device from "@/components/device";
import Header from "@/components/header";
import NewDeviceDialog from "@/components/new-device-dialog";
import { useAuth } from "@/context/authContext";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/helper/hooks/useAxios";
import { AxiosResponse } from "axios";
import { Device as DeviceType } from "@/types";

export default function Home() {
  const { user } = useAuth();
  const axios = useAxios();
  const { data, error } = useQuery({
    queryKey: ["getDevices"],
    queryFn: async () => {
      if (!user?.sub) {
        return null;
      }

      const response: AxiosResponse<any, any> = await axios.get(
        `devices/user/${user.sub}`,
      );
      return response.data;
    },
    enabled: !!user?.sub,
  });

  useEffect(() => {
    console.log(data);
  }, [data, error]);

  return (
    <div className="flex h-screen flex-col gap-3">
      <Header title="Todos os dispositivos" />
      <div className="flex justify-end">
        <NewDeviceDialog />
      </div>
      <div className="mb-10 flex max-h-full flex-wrap gap-4 overflow-y-auto px-2 py-2">
        {data?.owned?.map((device: DeviceType, index: number) => {
          return <Device key={index} device={device} edit />;
        })}
        {data?.viewer?.map((device: DeviceType, index: number) => {
          return <Device key={index} device={device} />;
        })}
      </div>
    </div>
  );
}
