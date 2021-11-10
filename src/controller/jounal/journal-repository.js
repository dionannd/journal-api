class JournalRepository {
  async insert(db, session, body) {
    try {
      body.user_id = session.id;
      const result = await db.query(
        `insert into journals (name, description, user_id, created_at)
         values ($<name>, $<description>, $<user_id>, NOW())`,
        body
      );
      return result[0];
    } catch {
      return error;
    }
  }

  async delete(db, journalId) {
    try {
      await db.none(`delete from journals where journal_id = $1`, journalId);
    } catch (error) {
      return error;
    }
  }
}

export default JournalRepository;
