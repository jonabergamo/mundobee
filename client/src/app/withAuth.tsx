import LoadingPage from "@/components/loaders/LoadingPage";
import { useAuth } from "@/context/authContext";
import React, { useState, useEffect } from "react";
import Login from "./(auth-routes)/signin/page";

const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (user !== undefined) {
        setLoading(false);
      }
    }, [user]);

    if (loading) {
      // Exibe a tela de carregamento enquanto verifica a autenticação
      return <LoadingPage />;
    }

    if (!user) {
      // Se não estiver autenticado, exibe a tela de login
      return <Login />;
    }

    // Se estiver autenticado, exibe o componente original
    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
