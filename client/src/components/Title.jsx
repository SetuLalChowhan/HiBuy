import React from 'react'

const Title = ({title,title2,para}) => {
  return (
    <div>
        <h1 className=" text-center text-4xl font-semibold text-gray-800 mb-4 uppercase tracking-widest">
          <span className="text-teal-500 ">{title}</span> {title2}
        </h1>
        <p className=" mx-auto text-center text-lg text-gray-500 leading-relaxed max-w-6xl tracking-widest">
          {para}
        </p>
    </div>
  )
}

export default Title