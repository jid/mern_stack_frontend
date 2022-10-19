import React from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux'
import { selectNoteById } from "./notesApiSlice";

const Note = ({ id }) => {
  const note = useSelector(state => selectNoteById(state, id))
  const navigate = useNavigate()

  if (!note)
    return null

  const created = new Date(note.createdAt).toLocaleString('pl-PL', { day: 'numeric', month: 'numeric' })
  const updated = new Date(note.updatedAt).toLocaleString('pl-PL', { day: 'numeric', month: 'numeric' })

  const handleEdit = () => navigate(`/dash/notes/${id}`)

  return (
    <tr className="table__row note">
      <td className={`table__cell note__status`}>
        {note.completed
          ? <span className="note__status--completed">Completed</span>
          : <span className="note__status--open">Open</span>
        }
      </td>
      <td className={`table__cell note__created`}>{created}</td>
      <td className={`table__cell note__updates`}>{updated}</td>
      <td className={`table__cell note__title`}>{note.title}</td>
      <td className={`table__cell note__username`}>{note.username}</td>
      <td className={`table__cell`}>
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

export default Note