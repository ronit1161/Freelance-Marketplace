export default function OrderRow({
  project,
  client,
  status,
}) {
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

      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
        {status}
      </span>

    </div>
  );
}