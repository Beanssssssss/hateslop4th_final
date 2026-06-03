"use client";

import { useEffect } from "react";

export function LightRouteView() {
  useEffect(() => {
    document.body.classList.add("home-route");

    return () => {
      document.body.classList.remove("home-route");
    };
  }, []);

  return null;
}
