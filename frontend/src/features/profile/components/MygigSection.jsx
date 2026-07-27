import React from 'react'
import GigCard from '../../gigs/components/GigCard'

const MygigSection = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">
        My Gigs
      </h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <GigCard />
        <GigCard />
        <GigCard />
      </div>
    </section>
  )
}

export default MygigSection