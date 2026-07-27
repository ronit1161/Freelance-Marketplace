import { getStatusBadgeColor } from "../../../utils/statusUtils";

export default function OrderRow({
  project,
  client,
  status,
}) {
  const badgeClasses = getStatusBadgeColor(status);

  return (
    <div className="flex justify-between items-center border-b pb-4">
      <div>
        <h4 className="font-semibold">
          {project}
        </h4>
        <p className="text-sm text-gray-500">
          {client}
        </p>
      </div>

      <span className={`px-3 py-1 rounded-full text-sm border font-medium ${badgeClasses}`}>
        {status}
      </span>
    </div>
  );
}