"use client";
import styles from "@/styles/globals.css";
import ChatProvider from "@/context/chatProvider";
import { ChakraProvider } from "@chakra-ui/react";
export default function App({ Component, pageProps }) {
  return (
    <ChatProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ChatProvider>
  );
}
