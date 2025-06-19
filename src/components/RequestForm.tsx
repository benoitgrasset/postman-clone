import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { HTTP_METHODS, REQUEST_TABS } from "../constants";
import type { RequestData } from "../types";
import { getLineNumbers, getPlaceholder } from "../utils";
import KeyValueList, { type KeyValue } from "./KeyValueList";
import Tabs from "./Tabs";

type RequestTab = "query-params" | "headers" | "body";

const keyValueInit = {
  key: "",
  value: "",
};

export default function RequestForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: RequestData) => void;
  loading: boolean;
}) {
  const { register, handleSubmit } = useForm<RequestData>({
    defaultValues: { method: "GET" },
  });

  const [activeTab, setActiveTab] = useState<RequestTab>("query-params");
  const [bodyContentType, setBodyContentType] = useState("JSON");
  const [bodyContent, setBodyContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  // Query Params state and handlers
  const [queryParams, setQueryParams] = useState<KeyValue[]>([
    { ...keyValueInit, id: crypto.randomUUID() },
  ]);
  // Headers state and handlers
  const [headers, setHeaders] = useState<KeyValue[]>([
    { ...keyValueInit, id: crypto.randomUUID() },
  ]);

  const onTabChange = (tab: string) => {
    setActiveTab(tab as RequestTab);
  };

  // Handle textarea scroll to sync line numbers
  const handleTextareaScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Handle body content change
  const handleBodyContentChange = (value: string) => {
    if (bodyContentType === "JSON") {
      // For JSON, ensure braces are present
      let processedValue = value;
      // Remove existing braces if they exist at start/end to avoid duplication
      processedValue = value.replace(/^\s*\{/, "").replace(/\}\s*$/, "");
      // Add braces
      processedValue = `{\n${processedValue}\n}`;
      setBodyContent(processedValue);
    } else {
      // For other content types, use the value as-is
      setBodyContent(value);
    }
  };

  // Initialize JSON braces when component mounts or content type changes
  useEffect(() => {
    if (bodyContentType === "JSON" && !bodyContent) {
      setBodyContent("{\n  \n}");
    } else if (
      bodyContentType !== "JSON" &&
      bodyContent.startsWith("{") &&
      bodyContent.endsWith("}")
    ) {
      // When switching away from JSON, remove braces if they exist
      const contentWithoutBraces = bodyContent
        .replace(/^\s*\{\s*/, "")
        .replace(/\s*\}\s*$/, "")
        .trim();
      setBodyContent(contentWithoutBraces);
    }
  }, [bodyContent, bodyContentType]);

  const handleAddQueryParam = () => {
    setQueryParams([
      ...queryParams,
      {
        ...keyValueInit,
        id: crypto.randomUUID(),
      },
    ]);
  };

  const handleRemoveQueryParam = (id: string) => {
    setQueryParams(queryParams.filter((param) => param.id !== id));
  };

  const handleChangeQueryParam = (
    id: string,
    field: "key" | "value",
    value: string
  ) => {
    setQueryParams((prev) =>
      prev.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const handleAddHeader = () => {
    setHeaders([
      ...headers,
      {
        ...keyValueInit,
        id: crypto.randomUUID(),
      },
    ]);
  };

  const handleRemoveHeader = (id: string) =>
    setHeaders(headers.filter((header) => header.id !== id));

  const handleChangeHeader = (
    id: string,
    field: "key" | "value",
    value: string
  ) => {
    setHeaders((prev) =>
      prev.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      )
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex mb-4 items-stretch rounded-md border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <select
          {...register("method")}
          className="bg-gray-50 border-0 border-r border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:bg-white min-w-[80px]"
          disabled={loading}
        >
          {HTTP_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
        <input
          {...register("url", { required: true })}
          placeholder="Enter URL"
          className="flex-1 px-3 py-2 border-0 focus:outline-none text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <Tabs
        tabs={REQUEST_TABS}
        onTabChange={onTabChange}
        activeTab={activeTab}
      />

      <div className="p-4 text-sm bg-white">
        {activeTab === "query-params" && (
          <KeyValueList
            items={queryParams}
            onAdd={handleAddQueryParam}
            onRemove={handleRemoveQueryParam}
            onChange={handleChangeQueryParam}
            disabled={loading}
          />
        )}

        {activeTab === "headers" && (
          <KeyValueList
            items={headers}
            onAdd={handleAddHeader}
            onRemove={handleRemoveHeader}
            onChange={handleChangeHeader}
            disabled={loading}
          />
        )}

        {activeTab === "body" && (
          <div>
            <div className="mb-3">
              <select
                value={bodyContentType}
                onChange={(e) => setBodyContentType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="Text">Text</option>
                <option value="Javascript">Javascript</option>
                <option value="JSON">JSON</option>
                <option value="HTML">HTML</option>
                <option value="XML">XML</option>
              </select>
            </div>
            <div className="relative border border-gray-300 rounded overflow-hidden">
              <div className="flex">
                {/* Line numbers */}
                <div
                  ref={lineNumbersRef}
                  className="bg-gray-50 border-r border-gray-300 px-2 py-3 text-xs font-mono text-gray-500 select-none overflow-hidden"
                  style={{ minWidth: "40px" }}
                >
                  {getLineNumbers(
                    bodyContent || getPlaceholder(bodyContent)
                  ).map((num) => (
                    <div key={num} className="leading-5 text-right">
                      {num}
                    </div>
                  ))}
                </div>
                {/* Textarea */}
                <textarea
                  {...register("body")}
                  ref={textareaRef}
                  value={bodyContent}
                  onChange={(e) => handleBodyContentChange(e.target.value)}
                  onScroll={handleTextareaScroll}
                  placeholder={getPlaceholder(bodyContent)}
                  className="flex-1 h-48 p-3 border-0 text-sm font-mono text-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-transparent"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
