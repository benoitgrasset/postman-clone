export type KeyValue = {
  key: string;
  value: string;
  id: string;
};

type KeyValueListProps = {
  items: KeyValue[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: "key" | "value", value: string) => void;
  disabled?: boolean;
};

export default function KeyValueList({
  items,
  onAdd,
  onRemove,
  onChange,
  disabled = false,
}: KeyValueListProps) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className="flex items-center mb-2">
          <input
            type="text"
            placeholder="Key"
            className="border border-gray-300 px-2 py-1 mr-2"
            value={item.key}
            onChange={(e) => onChange(item.id, "key", e.target.value)}
            disabled={disabled}
          />
          <input
            type="text"
            placeholder="Value"
            className="border border-gray-300 px-2 py-1"
            value={item.value}
            onChange={(e) => onChange(item.id, "value", e.target.value)}
            disabled={disabled}
          />
          <button
            type="button"
            className="ml-2 text-red-500 hover:text-red-700"
            onClick={() => onRemove(item.id)}
            disabled={disabled}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="mt-2 border border-green-500 text-green-600 px-3 py-1 rounded hover:bg-green-50"
        onClick={onAdd}
        disabled={disabled}
      >
        Add
      </button>
    </div>
  );
}
