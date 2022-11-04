import { memo } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// import { useSelector } from 'react-redux'
// import { selectUserById } from "./usersApiSlice";
import { useGetUsersQuery } from './usersApiSlice';


// import { UserType } from './User.types'

const User = ({ id }) => {
  // const user = useSelector(state => selectUserById(state, id))

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id]
    })
  })
  const navigate = useNavigate()

  if (!user)
    return null

  const handleEdit = () => navigate(`/dash/users/${id}`)
  const userRolesString = user.roles.toString().replaceAll(',', ', ')
  const cellStatus = user.active

  return (
    <tr className="table__row user">
      <td className={`table__cell ${cellStatus}`}>{user.username}</td>
      <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
      <td className={`table__cell ${cellStatus}`}>
        <button
          className="icon-button table__button"
          onClick={handleEdit}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      </td>
    </tr>
  )
}

const memoizedUser = memo(User)

export default memoizedUser