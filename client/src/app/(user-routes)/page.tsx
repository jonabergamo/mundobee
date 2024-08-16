"use client";
import Header from "@/components/header";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/helper/hooks/useAxios";
import ReactApexChart from "react-apexcharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metric } from "@/types/Metric";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AxiosResponse } from "axios";
import { useAuth } from "@/context/authContext";
import { decryptData, encryptData } from "@/helper/Cypto";
import Cookies from "js-cookie";
import { AreaChartHero } from "@/components/charts/AreaChart";
import {
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";
import { ptBR } from "date-fns/locale";
import { addDays } from "date-fns";

export default function Dashboard() {
  const axios = useAxios();
  const { user } = useAuth();
  const [value, setValue] = useState<DateRangePickerValue>({
    from: new Date(),
    to: addDays(new Date(), 1), // Inicialmente, "Hoje" + 1 dia
  });

  const [selectedDevice, setSelectedDevice] = useState<string>();

  useEffect(() => {
    const encryptedDeviceId = Cookies.get("pref_dev");
    if (encryptedDeviceId) {
      const decryptedDeviceId = decryptData(encryptedDeviceId);
      setSelectedDevice(decryptedDeviceId);
    }
  }, []);

  const fetchMetricsData = async (
    deviceId: string,
    fromDate: Date,
    toDate: Date,
  ) => {
    // Format dates to YYYY-MM-DD format
    const from = fromDate.toISOString().split("T")[0]; // Convert to ISO string and extract date part
    const to = toDate.toISOString().split("T")[0]; // Convert to ISO string and extract date part

    console.log(`metrics/device/${deviceId}?from=${from}&to=${to}`);

    try {
      const response = await axios.get(
        `metrics/device/${deviceId}?from=${from}&to=${to}`,
      );
      return response.data;
    } catch (error) {
      // Handle error
      console.error("Error fetching metrics data:", error);
      throw error; // Rethrow the error or handle as needed
    }
  };

  const { data: devicesData, error: devicesError } = useQuery({
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

  const { data, error, isLoading } = useQuery({
    queryKey: [
      "metricsData",
      selectedDevice, 
      value.from?.toISOString(), 
      value.to?.toISOString()
    ],
    queryFn: async () => {
      if (!selectedDevice || !value.from || !value.to) {
        return null;
      }

      return fetchMetricsData(selectedDevice, value.from, value.to);
    },
    refetchInterval: 1000, // Refetch the data every 1 minute
    enabled: !!devicesData && !!selectedDevice && !!value.from && !!value.to,
  });

  const beeFlowPercentage = useMemo(() => {
    const dailyInCount = data?.dailyInCount ?? 0;
    const dailyOutCount = data?.dailyOutCount ?? 0;

    if (dailyOutCount === 0) {
      return 0;
    }

    const flowPercentage =
      ((dailyInCount - dailyOutCount) / dailyOutCount) * 100;

    return flowPercentage;
  }, [data?.dailyInCount, data?.dailyOutCount]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const tempFormatter = (value: any) => `${value}°C`;
  const humidityFormatter = (value: any) => `${value}%`;

  return (
    <div className="flex h-screen flex-col gap-3">
      <Header title="Dashboard" />
      <div className="flex w-full items-center justify-start gap-2 px-2">
        <Select
          value={selectedDevice}
          onValueChange={(value) => {
            setSelectedDevice(value);
            const encryptedData = encryptData(value);
            Cookies.set("pref_dev", encryptedData, {
              secure: true,
              sameSite: "strict",
            });
          }}
        >
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Selecione o dispositivo" />
          </SelectTrigger>
          <SelectContent>
            {devicesData?.owned?.map((device: any) => (
              <SelectItem value={device.id} key={device.id}>
                {device.name}
              </SelectItem>
            ))}
            {devicesData?.viewer?.map((device: any) => (
              <SelectItem value={device.id} key={device.id}>
                {device.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DateRangePicker
          className="w-full"
          value={value}
          onValueChange={setValue}
          locale={ptBR}
          selectPlaceholder="Hoje"
          color="rose"
          defaultValue={{ from: new Date(), to: addDays(new Date(), 1) }} // Inicialmente, "Hoje" + 1 dia
          enableYearNavigation
          weekStartsOn={1}
          enableClear={false}
        >
          <DateRangePickerItem
            key="today"
            value="today"
            from={new Date()}
            to={addDays(new Date(), 1)}
          >
            Hoje
          </DateRangePickerItem>
          <DateRangePickerItem
            key="week"
            value="week"
            from={new Date(new Date().setDate(new Date().getDate() - 7))}
            to={addDays(new Date(), 1)}
          >
            Última Semana
          </DateRangePickerItem>
          <DateRangePickerItem
            key="month"
            value="month"
            from={new Date(new Date().setMonth(new Date().getMonth() - 1))}
            to={addDays(new Date(), 1)}
          >
            Último Mês
          </DateRangePickerItem>
          <DateRangePickerItem
            key="half"
            value="half"
            from={new Date(new Date().setMonth(new Date().getMonth() - 6))}
            to={addDays(new Date(), 1)}
          >
            Último Semestre
          </DateRangePickerItem>
          <DateRangePickerItem
            key="year"
            value="year"
            from={
              new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1))
            }
            to={addDays(new Date(), 1)}
          >
            Este Ano
          </DateRangePickerItem>
        </DateRangePicker>
      </div>
      <div className="mb-10 flex max-h-full flex-col gap-4 overflow-y-auto px-2 py-2">
        <div className="flex w-full flex-col gap-2 lg:flex-row">
          <div className="flex flex-col gap-2">
            <Card className="">
              <CardHeader>
                <CardTitle>Entradas</CardTitle>
                <CardDescription>Entradas de abelhas.</CardDescription>
              </CardHeader>
              <CardContent className="flex">
                <Label className="text-6xl">{data?.inCount}</Label>
              </CardContent>
            </Card>
            <Card className="">
              <CardHeader>
                <CardTitle>Saídas</CardTitle>
                <CardDescription>Saídas de abelhas.</CardDescription>
              </CardHeader>
              <CardContent className="flex">
                <Label className="text-6xl">{data?.outCount}</Label>
              </CardContent>
            </Card>
          </div>
          <Card className="">
            <CardHeader>
              <CardTitle>Fluxo de entrada/saída</CardTitle>
              <CardDescription>
                Percentual de fluxo de entrada em relação à saída.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex">
              <IoMdArrowDropdown
                className={`text-6xl transition-all ${
                  beeFlowPercentage === 0
                    ? "-rotate-90 text-gray-500"
                    : beeFlowPercentage > 0
                      ? "rotate-180 text-green-500"
                      : "text-red-500"
                }`}
              />
              <Label
                className={`text-6xl transition-all ${
                  beeFlowPercentage === 0
                    ? "text-gray-500"
                    : beeFlowPercentage > 0
                      ? "text-green-500"
                      : "text-red-500"
                }`}
              >
                {beeFlowPercentage.toFixed(0)}%
              </Label>
            </CardContent>
          </Card>
          <Card className="w-full p-5">
            <AreaChartHero
              data={data?.metrics.map((metric: any) => ({
                ...metric,
                Entradas: metric.inCount,
                Saídas: metric.outCount,
              }))}
              categories={["Entradas", "Saídas"]}
              index="timestamp"
              title="Entradas/Saídas"
            />
          </Card>
        </div>
        <Card className="flex flex-col gap-4 p-5">
          <Label className="text-2xl">Métricas</Label>
          <AreaChartHero
            data={data?.metrics.map((metric: any) => ({
              ...metric,
              "Temperatura Interna": metric.temperature,
              "Temperatura Externa": metric.outsideTemp,
              "Temperatura Exterior": metric.externalTemp,
            }))}
            categories={[
              "Temperatura Interna",
              "Temperatura Externa",
              "Temperatura Exterior",
            ]}
            index="timestamp"
            valueFormatter={tempFormatter}
            title="Temperatura"
          />
          <AreaChartHero
            data={data?.metrics.map((metric: any) => ({
              ...metric,
              "Umidade Interna": metric.humidity,
              "Umidade Externa": metric.outsideHumidity,
              "Umidade Exterior": metric.externalHumidity,
            }))}
            categories={[
              "Umidade Interna",
              "Umidade Externa",
              "Umidade Exterior",
            ]}
            index="timestamp"
            valueFormatter={humidityFormatter}
            title="Umidade"
          />
        </Card>
      </div>
    </div>
  );
}
