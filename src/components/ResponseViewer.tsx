import prettyBytes from "pretty-bytes";
import { useState } from "react";
import { RESPONSE_TABS } from "../constants";
import Tabs from "./Tabs";

export default function ResponseViewer({
  response,
  loading,
  body,
  time,
}: {
  response: Response | null;
  loading: boolean;
  body: unknown;
  time: number | null;
}) {
  const [activeTab, setActiveTab] = useState<"body" | "headers">("body");
  const [copied, setCopied] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "body" | "headers");
  };

  const prettyJson = JSON.stringify(body, null, 2) || "No body content";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prettyJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (loading) {
    return (
      <div className="mt-5">
        <h3 className="text-lg font-semibold mb-2">Response</h3>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const status = response?.status || "";

  const headers: Record<string, string> = {};
  response?.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Use prettyBytes to format the Content-Length if available
  const size = prettyBytes(
    JSON.stringify(body).length + JSON.stringify(headers).length
  );

  return (
    <div className="mt-5" data-response-section>
      <h3 className="text-lg font-semibold mb-2">Response</h3>

      <div className="flex flex-wrap text-sm mb-4">
        <div className="mr-4">
          <span className="font-medium">Status:</span>{" "}
          <span data-status>{status}</span>
        </div>
        <div className="mr-4">
          <span className="font-medium">Time:</span>{" "}
          <span data-time>{time}</span>ms
        </div>
        <div className="mr-4">
          <span className="font-medium">Size:</span>{" "}
          <span data-size>{size}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={RESPONSE_TABS}
        onTabChange={handleTabChange}
        activeTab={activeTab}
      />

      {/* Tab Content */}
      <div className="border rounded p-4 bg-white text-sm">
        {activeTab === "body" ? (
          <div
            data-json-response-body
            className="overflow-auto max-h-52 relative"
          >
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-2 right-2 flex items-center px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-xs"
              title="Copy JSON to clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="mr-1"
                aria-label="Copy to clipboard"
              >
                <title>Copy to clipboard</title>
                <rect
                  x="9"
                  y="9"
                  width="13"
                  height="13"
                  rx="2"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                />
                <rect
                  x="3"
                  y="3"
                  width="13"
                  height="13"
                  rx="2"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
              {copied ? "Copied!" : "Copy"}
            </button>
            <pre className="text-gray-600">{prettyJson}</pre>
          </div>
        ) : (
          <div
            className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2"
            data-response-headers
          >
            {Object.entries(headers).length > 0 ? (
              Object.entries(headers).map(([key, value]) => (
                <>
                  <div className="font-medium text-gray-700">{key}:</div>
                  <div className="text-gray-600 break-all">{value}</div>
                </>
              ))
            ) : (
              <div className="col-span-2 text-gray-600">No headers</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
