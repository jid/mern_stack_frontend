import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
// import { EntityId } from '@reduxjs/toolkit/dist/entities/models'
import { apiSlice } from '../../app/api/apiSlice'
// import { NoteType } from './Note.types'

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : - 1
})

const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNotes: builder.query({
      query: () => '/note',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError
      },
      keepUnusedDataFor: 5,
      transformResponse: responseData => {
        const loadedNotes = responseData.map(note => {
          note.id = note._id
          return note
        })
        return notesAdapter.setAll(initialState, loadedNotes)
      },
      providesTags: (result) => {
        if (!result?.ids)
          return [{ type: 'Notes', id: 'LIST' }]

        return [
          { type: 'Notes', id: 'LIST' },
          ...result.ids.map(({ id }) => ({ type: 'Notes', id }))
        ]
      }
    }),
    addNewNote: builder.mutation({
      query: (note) => ({
        url: '/notes',
        method: 'POST',
        body: {
          ...note
        }
      }),
      invalidatesTags: (result, err, arg) => [
        { type: 'Note', id: 'LIST' }
      ]
    }),
    updateNote: builder.mutation({
      query: (note) => ({
        url: `/notes/${note.id}`,
        method: 'PATCH',
        body: {
          ...note
        }
      }),
      invalidatesTags: (result, err, arg) => [
        { type: 'Note', id: arg.id }
      ]
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: `/notes/${id}`,
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, err, arg) => [
        { type: ' Note', id: arg.id }
      ]
    })
  })
})

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation
} = notesApiSlice

// return the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  notesResult => notesResult.data // normalized state object wih ids & entities
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)
