"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import Scan from "./scan";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "./ui/label";

const formSchema = z.object({
  name: z.string().min(1, { message: "O nome do dispositivo é obrigatório." }),
});

export default function NewDeviceDialog() {
  const [deviceId, setDeviceId] = useState("");
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const handleScan = (id: string) => {
    if (isValidUUID(id)) {
      setDeviceId(id);
    } else {
      console.error("O QR code escaneado não é um UUID válido.");
    }
  };
  

  const onSubmit = (values: z.infer<typeof formSchema>) => {};

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setTimeout(() => {
          setDeviceId("");
        }, 300);
      }}
    >
      <DialogTrigger className="w-fit">
        <Button>Adicionar dispositivo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo dispositivo</DialogTitle>
          <DialogDescription className="pb-2">
            Para adicionar um novo dispositivo, escaneie (ou faça upload) o QR
            code da sua colmeia inteligente. Em seguida preencha os dados de sua
            preferência.
          </DialogDescription>
          {deviceId ? (
            <Form {...form}>
              <div className="flex flex-col gap-2 ">
                <Label>ID do dispositivo</Label>
                <Input value={deviceId} disabled />
              </div>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do dispositivo</FormLabel>
                      <FormControl>
                        <Input placeholder="Colmeia BEEthoven" {...field} />
                      </FormControl>
                      <FormDescription>
                        Este será o nome do dispositivo (não recomendamos usar o
                        nome da espécie da abelha mantida no dispositivo, pois
                        será atribuído por predefinições).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Adicionar</Button>
              </form>
            </Form>
          ) : (
            <Scan onScan={handleScan} />
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function isValidUUID(uuid: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
