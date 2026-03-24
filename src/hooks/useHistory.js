import { useState } from "react";

export function useHistory() {
  const [entries, setEntries] = useState([]);

  function addEntry(url, status) {
    setEntries((prev) =>
      [{ url, status, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 8)
    );
  }

  return { entries, addEntry };
}
