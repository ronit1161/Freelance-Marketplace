import React from 'react'
import Navbar from '../../../components/layout/Navbar'
import { Navigate, useNavigate } from 'react-router-dom';

const CreateGig = () => {

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/freelancer");
  };

  return (
    <>
      <div className='mx-96 my-40'>
        <h3>SERVICE CREATION</h3>
        <h1 className='text-4xl my-5'>Craft Your Digital Offering</h1>
        <p>Hi there! I am a passionate Software Engineer with 10 years of experience specializing in Java development.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gig Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Gig Title
            </label>
            <input
              type="text"
              placeholder="I will build a responsive React website"
              className="w-full border bg-gray-200 border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category
            </label>
            <select className="bg-gray-200 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none">
              <option>Select Category</option>
              <option>Web Development</option>
              <option>Mobile Development</option>
              <option>UI/UX Design</option>
              <option>Graphic Design</option>
              <option>Content Writing</option>
              <option>Digital Marketing</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              rows="5"
              placeholder="Describe your service in detail..."
              className="w-full border bg-gray-200 border-gray-300 rounded-lg px-4 py-3 focus:outline-none resize-none"
            ></textarea>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Skills
            </label>
            <input
              type="text"
              placeholder="React, Node.js, MongoDB"
              className="w-full border bg-gray-200 border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
            />
          </div>

          {/* Pricing */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Starting Price (₹)
            </label>
            <input
              type="number"
              placeholder="5000"
              className="w-full border bg-gray-200 border-gray-300 rounded-lg px-4 py-3 focus:outline-none"
            />
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Delivery Time
            </label>
            <select className="w-full border bg-gray-200 border-gray-300 rounded-lg px-4 py-3 focus:outline-none">
              <option>Select Delivery Time</option>
              <option>1 Day</option>
              <option>3 Days</option>
              <option>5 Days</option>
              <option>7 Days</option>
              <option>14 Days</option>
              <option>30 Days</option>
            </select>
          </div>

          {/* Portfolio Images */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Portfolio Images
            </label>
            <input
              type="file"
              multiple
              className="w-full border bg-gray-200 border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#0058be] text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Publish Gig
          </button>
        </form>

      </div>
    </>
  )
}

export default CreateGig