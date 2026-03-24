import { useState } from "react";

export function useRequest() {
  const [responseJson, setResponseJson] = useState(null);
  const [rawText, setRawText] = useState("");
  const [responseStatus, setResponseStatus] = useState({ message: "", isError: false });
  const [isLoading, setIsLoading] = useState(false);

  async function sendRequest(url) {
    setResponseStatus({ message: "", isError: false });
    setIsLoading(true);
    setResponseJson(null);
    setRawText("");

    let response;
    try {
      response = await fetch(url, { method: "GET" });
    } catch {
      setResponseStatus({ message: "Request failed. This is often a CORS restriction in the browser.", isError: true });
      setIsLoading(false);
      return null;
    }

    let bodyText = "";
    let bodyJson = null;
    try {
      bodyText = await response.text();
      bodyJson = JSON.parse(bodyText);
    } catch {
      bodyJson = null;
    }

    const statusLabel = `${response.status} ${response.statusText}`;
    setResponseStatus({
      message: response.ok ? `Response received (${statusLabel}).` : `Request returned ${statusLabel}.`,
      isError: !response.ok,
    });
    setRawText(bodyText);
    setResponseJson(bodyJson);
    setIsLoading(false);
    return { statusLabel, url };
  }

  return { responseJson, rawText, responseStatus, isLoading, sendRequest };
}
