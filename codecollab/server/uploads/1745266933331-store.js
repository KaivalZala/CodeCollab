function reducer(state, action) {
  if (action.type === 'UPDATE') {
    state.user.name = action.payload; // mutates state
    return state;
  }
  return state;
}