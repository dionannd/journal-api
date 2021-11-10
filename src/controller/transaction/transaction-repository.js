class TransactionRepository {
  async getTransaction(db, session, journalId) {
    try {
      const result = await db.oneOrNone(
        `select * from transaction_header where journal_id = $1 and user_id = $2
      `,
        [session, journalId]
      );
      return result;
    } catch (error) {
      return error;
    }
  }

  async insert(db, session) {
    try {
      const result = await db.query(
        `insert into transactions (transaction_id, description, tipe, 
          amount, user_id, transaction_date)
         values ($<transaction_id>, $<description>, $<tipe>, $<amount>, 
          $<user_id>, NOW())`,
        session
      );
      return result;
    } catch (error) {
      return error;
    }
  }
}

export default TransactionRepository;
