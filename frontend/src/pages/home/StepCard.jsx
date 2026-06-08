export default function StepCard({
  number,
  title,
  description,
}) {
  return (
    <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition duration-300">

      <div className="text-5xl font-bold text-blue-600 mb-4">
        {number}
      </div>

      <h3 className="text-xl font-semibold mb-3">
        {title}
      </h3>

      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>

    </div>
  );
}