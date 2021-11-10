class TransactionRepository {
  async getTransaction(db, journalId, session) {
    try {
      const result = await db.oneOrNone(
        `select * from journals where journal_id = $1 and user_id = $2
      `,
        [journalId, session]
      );
      return result;
    } catch (error) {
      return error;
    }
  }

  async insert(db, session) {
    try {
      const result = await db.query(
        `insert into transactions (journal_id, name, tipe, 
          amount, user_id, transaction_date)
         values ($<journal_id>, $<name>, $<tipe>, $<amount>, 
          $<user_id>, NOW())`,
        session
      );
      return result;
    } catch (error) {
      return error;
    }
  }

  async delete(db, session) {
    try {
      const result = await db.none(
        `delete from transactions where transaction_id in ($1:csv)`,
        [session.journal_id]
      );
      return result;
    } catch (error) {
      return error;
    }
  }

  async tipe(db, journalId) {
    try {
      const result = await db.query(
        `
      select
        coalesce(sum(case t.tipe when 'Income' then amount end), 0) as pemasukan,
        coalesce(sum(case t.tipe when 'Expense' then amount end), 0) as pengeluaran
      from transactions t where journal_id = $1
      `,
        journalId
      );
      return result;
    } catch (error) {
      return error;
    }
  }
}

export default TransactionRepository;
