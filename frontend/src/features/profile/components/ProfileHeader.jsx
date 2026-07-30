import Button from '../../../components/common/Button'
import { Link } from 'react-router-dom'

const ProfileHeader = () => {
    return (
        <header className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row gap-8 max-w-7xl m-auto">

            <img
                src="https://imgs.search.brave.com/91syC0cKFJXl0mRNNUw2yUo83ymoVmO5DLqEPrv8hw0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90ZW1w/bGF0ZS5jYW52YS5j/b20vRUFGdDk1d2ZO/ZGsvMS8wLzE2MDB3/LVZicjZHUnk1WWE0/LmpwZw"
                alt=""
                className="w-40 h-40 rounded-full object-cover"
            />

            <div className="flex-1">
                <h1 className="text-4xl font-bold">
                    Ronit Tambe
                </h1>

                <p className="text-lg text-gray-500 mt-2">
                    Full Stack Developer
                </p>

                <div className="flex flex-wrap gap-6 mt-4">
                    <span>⭐ 4.9 (120 Reviews)</span>
                    <span>🏆 Top Rated</span>
                    <span>⚡ 95% Job Success</span>
                </div>

                <div className="flex gap-4 mt-6">
                    <Button>
                        contact
                    </Button>

                    <Link
                        to={"/edit-profile"}
                    >
                        <button className="border px-6 py-3 rounded-lg">
                            Edit Profile
                        </button>
                    </Link>
                </div>
            </div>

        </header>
    )
}

export default ProfileHeader