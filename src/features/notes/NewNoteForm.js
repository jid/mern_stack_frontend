import { useState, useEffect } from 'react'
import { useAddNewNoteMutation } from './notesApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'

const NewNoteForm = ({ users }) => {
  const [addNewNote, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewNoteMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [validTitle, setValidTitle] = useState(false)
  const [text, setText] = useState('')
  const [validText, setValidText] = useState(false)
  const [user, setUser] = useState('')
  const [validUser, setValidUser] = useState(false)

  useEffect(() => {
    setValidTitle(title?.length)
  }, [title])

  useEffect(() => {
    setValidText(text?.length)
  }, [text])

  useEffect(() => {
    setValidUser(user?.length)
  }, [user])

  useEffect(() => {
    if (isSuccess) {
      setTitle('')
      setText('')
      setUser('')
      navigate('/dash/notes')
    }
  }, [isSuccess, navigate])

  const onTitleChanged = ({ target }) => setTitle(target.value)
  const onTextChanged = ({ target }) => setText(target.value)
  const onUserChanged = ({ target }) => setUser(target.value)

  const canSave = [validTitle, validText, validUser].every(Boolean) && !isLoading

  const onSaveNoteClicked = async (e) => {
    e.preventDefault()
    if (canSave)
      await addNewNote({ title, text, user })
  }

  const options = users.map(user => {
    return (
      <option
        key={user.id}
        value={user.id}
      >{user.username}</option>
    )
  })

  const errClass = isError ? "errmsg" : "offsscreen"
  const validTitleClass = !validTitle ? 'form__input--incomplete' : ''
  const validTextClass = !validText ? 'form__input--incomplete' : ''
  const validUserClass = !validUser ? 'form__input--incomplete' : ''

  let content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveNoteClicked}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
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

        <label className="form__label" htmlFor="user">
          User:
        </label>
        <select
          className={`form__select ${validUserClass}`}
          id="user"
          name="user"
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

export default NewNoteForm