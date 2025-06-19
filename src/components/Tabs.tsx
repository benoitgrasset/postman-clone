import { capitalize } from "../utils";

type Props = {
  tabs: string[];
  onTabChange: (tab: string) => void;
  activeTab: string;
};

const Tabs = ({ tabs, onTabChange, activeTab }: Props) => {
  return (
    <div className="flex border-b border-gray-300 mb-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 ${
            activeTab === tab
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {capitalize(tab)}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
