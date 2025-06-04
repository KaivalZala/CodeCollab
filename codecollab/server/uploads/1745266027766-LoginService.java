synchronized(userLock) {
  synchronized(dbLock) {
    // authentication logic
  }
}
// elsewhere...
synchronized(dbLock) {
  synchronized(userLock) {
    // session cleanup
  }
}