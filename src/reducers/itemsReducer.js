export const itemsReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_NOTES_SUCCESS':
      return action.items;
    case 'POST_NOTE_SUCCESS':
      return [...state, ...action.items]
    case 'DELETE_NOTE_SUCCESS':
      return state.filter(item => item.noteID !== action.noteID)
    case 'EDIT_NOTE_SUCCESS':
      const cleaned = state.filter(item => item.noteID !== action.noteID)
      return [...cleaned, ...action.items]
    default:
      return state;
  }
}