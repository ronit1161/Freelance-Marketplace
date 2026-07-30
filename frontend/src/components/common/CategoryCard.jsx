export default function CategoryCard({ title }) {
  return (
    <div className="bg-zinc-200 p-16 rounded-xl shadow-sm shadow-lg transition text-center">
      <h3 className="font-semibold">
        {title}
      </h3>
    </div>
  );
}