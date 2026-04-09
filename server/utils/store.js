const store = {
  users: [],
  contacts: [],
  locations: [],
}

function id() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

module.exports = {
  store,
  createUser(user) {
    const u = { ...user, _id: id() }
    store.users.push(u)
    return u
  },
  findUserByEmail(email) {
    return store.users.find((u) => u.email === email) || null
  },
  createContact(c) {
    const item = { ...c, _id: id(), createdAt: new Date() }
    store.contacts.push(item)
    console.log('[Store] Contact Created:', item.name, item.phone)
    return item
  },
  listContactsByUser(userId) {
    const contacts = store.contacts.filter((c) => c.userId === userId).sort((a, b) => b.createdAt - a.createdAt)
    console.log(`[Store] Listing ${contacts.length} contacts for user ${userId}`)
    return contacts
  },
  deleteContact(userId, id) {
    const i = store.contacts.findIndex((c) => c.userId === userId && c._id === id)
    if (i >= 0) {
      const deleted = store.contacts.splice(i, 1)
      console.log('[Store] Contact Deleted:', deleted[0].name)
    }
  },
  createLocation(l) {
    const loc = { ...l, _id: id(), createdAt: new Date() }
    store.locations.push(loc)
    return loc
  },
  latestLocation(userId) {
    return [...store.locations].reverse().find((l) => l.userId === userId) || null
  },
}

