import { useState, useEffect } from "react"
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

const EditNoteForm = ({ note, users }) => {
  const [updateNote, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateNoteMutation()

  const [deleteNote, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delerror
  }] = useDeleteNoteMutation()

  const navigate = useNavigate()

  const [user, setUser] = useState(note.user)
  const [validUser, setValidUser] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [validTitle, setValidTitle] = useState(false)
  const [text, setText] = useState(note.text)
  const [validText, setValidText] = useState(false)
  const [completed, setCompleted] = useState(note.completed)

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUser('')
      setTitle('')
      setText('')
      setCompleted(false)
      navigate('/dash/notes')
    }

  }, [isSuccess, isDelSuccess, navigate])

  useEffect(() => {
    setValidTitle(title?.trim().length)
  }, [title])

  useEffect(() => {
    setValidText(text?.trim().length)
  }, [text])

  useEffect(() => {
    setValidUser(user.trim().length)
  }, [user])

  const onUserChanged = e => setUser(e.target.value)
  const onTitleChanged = e => setTitle(e.target.value)
  const onTextChanged = e => setText(e.target.value)
  const onCompletedChanged = () => setCompleted(prev => !prev)

  const onSaveNoteClicked = async (e) => {
    await updateNote({ id: note.id, user, title, text, completed })
  }

  const onDeleteNoteClicked = async () => {
    await deleteNote({ id: note.id })
  }

  let canSave = [validUser, validTitle, validText].every(Boolean) && !isLoading

  const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
  const validUserClass = !validUser ? 'form__input--incomplete' : ''
  const validTitleClass = title && !validTitle ? 'form__input--incomplete' : ''
  const validTextClass = text && !validText ? 'form__input--incomplete' : ''

  const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

  const options = users.map(user => {
    return (
      <option
        key={user.id}
        value={user.id}

      > {user.username}</option >
    )
  })

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Note</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteNoteClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">Title:</label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="text">Text:</label>
        <textarea
          className={`form__input ${validTextClass}`}
          id="text"
          name="text"
          type="text"
          value={text}
          onChange={onTextChanged}
        />

        <label className="form__label form__checkbox-container" htmlFor="note-completed">
          COMPLETED:
          <input
            className="form__checkbox"
            id="note-completed"
            name="note-completed"
            type="checkbox"
            checked={completed}
            onChange={onCompletedChanged}
          />
        </label>

        <label className="form__label" htmlFor="users">
          USER:</label>
        <select
          id="users"
          name="users"
          className={`form__select ${validUserClass}`}
          multiple={false}
          size="1"
          value={user}
          onChange={onUserChanged}
        >
          {options}
        </select>

      </form>
    </>
  )

  return content
}

export default EditNoteForm
