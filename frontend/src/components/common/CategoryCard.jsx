import { Link } from "react-router-dom";

export default function CategoryCard({ title, count, to = "/gigs" }) {
  return (
    <Link to={to} className="block h-full">
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-600 transition h-full flex flex-col justify-between text-center">
        <div>
          <h3 className="font-semibold text-gray-900 text-base mb-1">
            {title}
          </h3>
          {count && (
            <p className="text-xs text-gray-500">{count}</p>
          )}
        </div>
      </div>
    </Link>
  );
}