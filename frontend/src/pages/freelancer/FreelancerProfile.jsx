import React from 'react'
import ProfileHeader from '../../components/profile/ProfileHeader'
import AboutSection from '../../components/profile/AboutSection'
import ReviewSection from '../../components/profile/ReviewSection'
import SideBar from '../../components/profile/SideBar'
import MygigSection from '../../components/profile/MygigSection'

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