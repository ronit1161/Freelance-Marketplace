export default function HireCard({
    name,
    role,
}) {
    return (
        <div className="flex items-center gap-4 border-b pb-4">

            <img
                src="https://i.pravatar.cc/100"
                alt={name}
                className="w-12 h-12 rounded-full"
            />

            <div>
                <h4 className="font-medium">{name}</h4>
                <p className="text-sm text-gray-500">{role}</p>
            </div>

        </div>
    );
}