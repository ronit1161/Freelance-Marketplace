import ProfileHeader from '../components/ProfileHeader'
import AboutSection from '../components/AboutSection'
import ReviewSection from '../components/ReviewSection'
import SideBar from '../components/SideBar'
import MygigSection from '../components/MygigSection'

const FreelancerProfile = () => {
  return (
    <div className="bg-gray-50 min-h-screen ">

      <ProfileHeader />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left Content */}
          <div className="lg:w-[70%] space-y-10">
            <AboutSection />
            <MygigSection />
            <ReviewSection />
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-[30%]">
            <SideBar />
          </div>

        </div>
      </div>

    </div>
  )
}

export default FreelancerProfile