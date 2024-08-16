"use client";
import React, { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import DotsLoader from "./loaders/DotsLoader";
import { IoAlert } from "react-icons/io5";
import jsQR from "jsqr";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

type ScanProps = {
  onScan?: (data: string) => void;
};

function Scan({ onScan }: ScanProps) {
  const [cameraPermission, setCameraPermission] = useState("prompt"); // 'granted', 'denied', or 'prompt'
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { ref } = useZxing({
    onDecodeResult(result) {
      if (onScan) onScan(result.getText());
    },
  });

  useEffect(() => {
    // Verificar o status da permissão da câmera
    navigator.permissions
      .query({ name: "camera" as any })
      .then((permissionStatus) => {
        setCameraPermission(permissionStatus.state);

        // Atualizar o estado quando a permissão mudar
        permissionStatus.onchange = () => {
          setCameraPermission(permissionStatus.state);
        };
      })
      .catch((err) => {
        setCameraError(
          "Não foi possível verificar o status da permissão da câmera."
        );
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (cameraPermission === "granted") {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => {
          setCameraError(null);
        })
        .catch((err) => {
          setCameraError(
            "Acesso à câmera não permitido. Por favor, habilite o acesso à câmera."
          );
          console.error(err);
        });
    } else if (cameraPermission === "denied") {
      setCameraError(
        "Acesso à câmera negado. Por favor, habilite o acesso à câmera nas configurações do navegador."
      );
    }
  }, [cameraPermission]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target?.result as string;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext("2d");
          if (context) {
            context.drawImage(image, 0, 0, image.width, image.height);
            const imageData = context.getImageData(
              0,
              0,
              image.width,
              image.height
            );
            const code = jsQR(
              imageData.data,
              imageData.width,
              imageData.height
            );
            if (code) {
              if (onScan) {
                onScan(code.data);
              }
            } else {
              setCameraError("Não foi possível ler o código QR da imagem.");
            }
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div
        className={cameraPermission !== "granted" || cameraError ? "flex" : ""}
      >
        <video ref={ref} />
        {cameraError ? (
          <div className="flex flex-col gap-4 items-center justify-center w-full">
            <IoAlert className="text-8xl text-primary" />
            <p className="text-primary text-center">{cameraError}</p>
            <Button
              onClick={() => {
                setCameraError("");
              }}
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          cameraPermission !== "granted" && (
            <div className="flex flex-col gap-4 items-center justify-center w-full">
              <DotsLoader />
              <p className="text-primary">
                Por favor, permita o acesso à câmera para continuar.
              </p>
            </div>
          )
        )}
      </div>
      {!cameraError && (
        <div className="flex flex-col items-start gap-3 -mt-10">
          <Separator />
          <Label>Ou faça upload da imagem contendo o QR code</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-fit"
          />
        </div>
      )}
    </div>
  );
}

export default Scan;
