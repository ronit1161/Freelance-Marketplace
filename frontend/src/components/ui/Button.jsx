import React from 'react'

const Button = ({
  children,
  type = "button",
  onClick,
  className = "bg-blue-600 text-white px-6 py-3 rounded-lg",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium transition ${className}`}
    >
      {children}
    </button>
  );
}

export default Button