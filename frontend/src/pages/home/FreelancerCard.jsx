export default function FreelancerCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">

      <img
        src="https://i.pravatar.cc/150"
        alt=""
        className="w-20 h-20 rounded-full mx-auto"
      />

      <h3 className="text-center font-semibold mt-4">
        John Doe
      </h3>

      <p className="text-center text-gray-500">
        Full Stack Developer
      </p>

      <p className="text-center mt-2">
        ⭐ 4.9
      </p>

    </div>
  );
}