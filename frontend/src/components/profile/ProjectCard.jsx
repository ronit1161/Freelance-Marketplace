export default function ProjectCard() {
    return (
        <div className="border rounded-lg p-4">

            <h3 className="font-semibold">
                {title}
            </h3>

            <div className="flex justify-between mt-3 text-sm text-gray-500">
                <span>Budget: {budget}</span>
                <span>{proposals} Proposals</span>
            </div>

            <h1>ROnit</h1>

        </div>
    );
}