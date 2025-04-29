"use client";
import React, { FC, ReactNode } from "react";
import { store } from "@/Redux/store";
import { Provider } from "react-redux";
// import { ThemeProvider as NextThemesProvider } from "next-themes";

interface props {
  children: ReactNode;
}

const RootProvider: FC<props> = ({ children }: props) => {
  return (
    <Provider store={store}>
      {/* <NextThemesProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange> */}
      {children}
      {/* </NextThemesProvider> */}
    </Provider>
  );
};

export default RootProvider;
