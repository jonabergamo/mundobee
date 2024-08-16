"use client";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/authContext";
import toast from "react-hot-toast";
import LoadingPage from "@/components/loaders/LoadingPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { signIn, isLoading } = useAuth();
  const [error, setError] = useState<string | null>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const router = useRouter();

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    toast.remove();
    const response = await toast.promise(signIn(event), {
      loading: "Entrando...",
      success: () => {
        router.replace("/");
        return "Login realizado com sucesso";
      },
      error: (error) => {
        setError(error.message);
        return `${error.message}`; // Exemplo, você pode personalizar a mensagem de erro conforme necessário
      },
    });
  }

  return !isLoading ? (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:block">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent" />
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="pb-5"></div>
            <h1 className="text-3xl font-bold">Bem vindo de volta!</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Insira seu email e senha para entrar.
            </p>
          </div>
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
            onChange={() => setError("")}
          >
            <div className="space-y-2">
              <Label htmlFor="email" className={error ? "text-red-500" : ""}>
                Email
              </Label>
              <Input
                id="email"
                placeholder="m@example.com"
                required
                type="email"
                className={error ? "border-spacing-5 border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className={error ? "text-red-500" : ""}
                >
                  Senha
                </Label>
              </div>
              <Input
                id="password"
                required
                type="password"
                className={error ? "border-spacing-5 border-red-500" : ""}
              />
            </div>
            <Button className="w-full" type="submit">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <LoadingPage />
  );
}
