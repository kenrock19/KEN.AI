import sqlite3 from "sqlite3";

sqlite3.verbose();

const db = new sqlite3.Database(
  "./database/kenai.db",
  (error) => {
    if (error) {
      console.error(
        "Database connection failed:",
        error.message
      );
    } else {
      console.log("Connected to KEN.AI database.");
    }
  }
);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT 'New Chat',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER NOT NULL,
      sender TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE
    )
  `);
});

export function createConversation(title = "New Chat") {
  return new Promise((resolve, reject) => {
    db.run(
      `
        INSERT INTO conversations (title)
        VALUES (?)
      `,
      [title],
      function (error) {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          id: this.lastID,
          title,
        });
      }
    );
  });
}

export function saveMessage(
  conversationId,
  sender,
  text
) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        INSERT INTO messages (
          conversation_id,
          sender,
          text
        )
        VALUES (?, ?, ?)
      `,
      [conversationId, sender, text],
      function (error) {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          id: this.lastID,
          conversationId,
          sender,
          text,
        });
      }
    );
  });
}

export function getConversations() {
  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT
          id,
          title,
          created_at
        FROM conversations
        ORDER BY created_at DESC, id DESC
      `,
      [],
      (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(rows);
      }
    );
  });
}

export function getMessages(conversationId) {
  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT
          id,
          conversation_id,
          sender,
          text,
          created_at
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC, id ASC
      `,
      [conversationId],
      (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(rows);
      }
    );
  });
}

export function updateConversationTitle(id, title) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE conversations
        SET title = ?
        WHERE id = ?
      `,
      [title, id],
      function (error) {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          id,
          title,
          changes: this.changes,
        });
      }
    );
  });
}

export function deleteConversation(id) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `
          DELETE FROM messages
          WHERE conversation_id = ?
        `,
        [id],
        (messageError) => {
          if (messageError) {
            reject(messageError);
            return;
          }

          db.run(
            `
              DELETE FROM conversations
              WHERE id = ?
            `,
            [id],
            function (conversationError) {
              if (conversationError) {
                reject(conversationError);
                return;
              }

              resolve({
                id,
                changes: this.changes,
              });
            }
          );
        }
      );
    });
  });
}

export default db;