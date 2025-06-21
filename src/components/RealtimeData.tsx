import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, set, onValue } from "firebase/database";

const RealtimeData = () => {
  const [data, setDataState] = useState("");

  const saveData = () => {
    set(ref(db, "users/001"), {
      username: "Amruth",
      email: "amruth@example.com",
    });
  };

  useEffect(() => {
    const dbRef = ref(db, "users/");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Realtime Data:", data);
      setDataState(JSON.stringify(data));
    });
  }, []);

  return (
    <div className="my-4">
      <button
        onClick={saveData}
        className="p-2 bg-indigo-500 text-white rounded mb-2"
      >
        Save Data
      </button>
      <p>Data: {data}</p>
    </div>
  );
};

export default RealtimeData;
