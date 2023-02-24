import React from 'react'

function Dashboard() {
  const logout = () => {
    sessionStorage.removeItem("isLogin")
    window.location.href = '/'
  }
  
  return (
    <div>
      Dashboard
      <button onClick={logout}>logout</button>
    </div>
    
  )
}

export default Dashboard