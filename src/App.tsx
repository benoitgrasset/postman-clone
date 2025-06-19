import { useState } from "react";
import RequestForm from "./components/RequestForm";
import ResponseViewer from "./components/ResponseViewer";
import type { RequestData } from "./types";

export default function App() {
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState<unknown>(null);
  const [time, setTime] = useState<number | null>(null);

  const handleSendRequest = async (data: RequestData) => {
    setLoading(true);
    setResponse(null);
    try {
      const url = data.params
        ? `${data.url}?${data.params.toString()}`
        : data.url;
      // Ensure URL is valid
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        throw new Error("Invalid URL. It must start with http:// or https://");
      }
      const start = performance.now();

      const res = await fetch(url, {
        method: data.method,
        headers: data.headers,
        body: data.body ? JSON.stringify(data.body) : undefined,
        credentials: "include", // Include cookies for CORS requests
      });
      const end = performance.now();
      const time = Math.round(end - start); // Time in ms
      setTime(time);
      setResponse(res);
      setBody(await res.json());
    } catch (error) {
      throw new Error(`Request failed: ${(error as Error).message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-4">
      <h1 className="font-bold">Postman</h1>
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <RequestForm onSubmit={handleSendRequest} loading={loading} />
      </div>
      <div className="w-full mt-6 p-6 bg-white shadow-md rounded-lg">
        <ResponseViewer
          response={response}
          loading={loading}
          body={body}
          time={time}
        />
      </div>
    </div>
  );
}
