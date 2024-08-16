import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Device as DeviceType } from "@/types";
import { io, Socket } from "socket.io-client";

type DeviceProps = {
  device?: DeviceType;
  edit?: boolean;
};

type Data = {
  temperature: number;
  humidity: number;
  outsideTemp: number;
  outsideHumidity: number;
  inCount: number;
  outCount: number;
  updatedAt?: string; // Atualizado para uma string para facilitar o processamento
};

export default function Device({ device, edit = false }: DeviceProps) {
  const [data, setData] = useState<Data>({
    temperature: 0,
    outsideHumidity: 0,
    outsideTemp: 0,
    humidity: 0,
    inCount: 0,
    outCount: 0,
  });
  const [online, setOnline] = useState(false); // Estado para controlar o status online
  const socketRef = useRef<Socket | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Conectar ao WebSocket do NestJS
    const socket = io("http://localhost:3333"); // Substitua com a URL do seu servidor NestJS
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.emit(
        "subscribe",
        JSON.stringify({ topic: `device/${device?.id}` })
      );
      setOnline(true); // Definir como online ao conectar
    });

    socket.on(`device/${device?.id}`, (message: string) => {
      const parsedMessage = JSON.parse(message);
      parsedMessage.updatedAt = new Date().toISOString(); // Adiciona a data da atualização
      setData(parsedMessage);
      setOnline(true); // Manter como online ao receber dados

      // Reiniciar o timeout para definir como offline após 5 segundos sem novos dados
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setOnline(false);
      }, 65000); // 5 segundos
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setOnline(false); // Definir como offline ao desconectar
    });

    return () => {
      if (socket) socket.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [device?.id]);

  // Formatar a data para exibição
  const formattedUpdatedAt = data.updatedAt
    ? new Date(data.updatedAt).toLocaleString()
    : "";

  return (
    <Card className="flex-grow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{device?.name}</div>
          <div className="flex items-center gap-3">
            {!online && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Última atualização: {formattedUpdatedAt}
              </div>
            )}
            <div
              className={`px-2 py-1 rounded-xl text-sm ${
                online ? "bg-primary text-primary-foreground" : "bg-destructive"
              }`}
            >
              {online ? "Conectado" : "Desconectado"}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Living Room
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Temperatura Interna
            </div>
            <div className="text-2xl font-semibold">{data.temperature}°C</div>
          </div>
          <div className="grid gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Humidade Interna
            </div>
            <div className="text-2xl font-semibold">{data.humidity}%</div>
          </div>
          <div className="grid gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Temperatura Externa
            </div>
            <div className="text-2xl font-semibold">{data.outsideTemp}°C</div>
          </div>
          <div className="grid gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Humidade Externa
            </div>
            <div className="text-2xl font-semibold">
              {data.outsideHumidity}%
            </div>
          </div>
          <div className="grid gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Entradas
            </div>
            <div className="text-2xl font-semibold">{data.inCount}</div>
          </div>
          <div className="grid gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Saidas
            </div>
            <div className="text-2xl font-semibold">{data.outCount}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button size="sm" variant="outline">
          Ver Detalhes
        </Button>
        {edit && (
          <Button size="sm" variant="outline">
            Editar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
