import React from 'react'
import { useParams } from 'react-router-dom'
const ProfilePeople = () => {
    const{id}=useParams()
  return (
    <div>ProfilePeople{id}</div>
  )
}

export default ProfilePeople