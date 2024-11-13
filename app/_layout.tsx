// app/_layout.tsx
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Slot } from "expo-router";
import SplashScreen from "../components/Splashscreen"; // Pastikan path ini benar

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2000 ms = 2 detik

    return () => clearTimeout(timer); // Bersihkan timer saat komponen di-unmount
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  // Anda dapat menambahkan gaya global di sini jika diperlukan
});
