function ContactsManager({ contacts, setContacts }) {
  const addContact = () => {
    const name = prompt('Contact name')
    const phone = prompt('Phone number')
    if (!name || !phone) return
    setContacts((prev) => [...prev, { id: Date.now(), name, phone }])
  }

  const editContact = (id) => {
    setContacts((prev) =>
      prev.map((contact) => {
        if (contact.id !== id) return contact
        const name = prompt('Edit name', contact.name) || contact.name
        const phone = prompt('Edit phone', contact.phone) || contact.phone
        return { ...contact, name, phone }
      })
    )
  }

  const removeContact = (id) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id))
  }

  return (
    <section id="contacts" className="glass card fade-in-up">
      <div className="section-header">
        <h2>Emergency Contacts</h2>
        <button className="chip-btn" onClick={addContact}>
          + Add Contact
        </button>
      </div>
      <div className="table-wrap">
        {contacts.map((contact) => (
          <article key={contact.id} className="row-card">
            <div>
              <h4>{contact.name}</h4>
              <p>{contact.phone}</p>
            </div>
            <div className="row-actions">
              <button onClick={() => editContact(contact.id)}>Edit</button>
              <button className="danger" onClick={() => removeContact(contact.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ContactsManager
