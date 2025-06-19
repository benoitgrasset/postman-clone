import type { RequestData } from "./RequestForm";

type HistoryProps = {
  requests: RequestData[];
  onSelect: (request: RequestData) => void;
};

export default function History({ requests, onSelect }: HistoryProps) {
  if (requests.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">History</h2>
        <div className="text-gray-500">No requests yet.</div>
      </div>
    );
  }
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">History</h2>
      <ul className="divide-y">
        {requests.map((req, idx) => (
          <li
            key={`${idx}-${req.url}`}
            className="py-2 cursor-pointer hover:bg-gray-100 rounded"
            onClick={() => onSelect(req)}
          >
            <span className="font-mono text-sm mr-2 text-blue-700">
              {req.method}
            </span>
            <span className="break-all">{req.url}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
