export default function CategoryCard({ title }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition text-center">
      <h3 className="font-semibold">
        {title}
      </h3>
    </div>
  );
}