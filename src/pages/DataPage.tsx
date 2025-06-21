// src/pages/DataPage.tsx

import React from "react";
import RealtimeData from "../components/RealtimeData";

export const DataPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Realtime Data Page</h1>
      <RealtimeData />
    </div>
  );
};
