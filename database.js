import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("MyDatabase.db");

// Call the function to ensure the table is created
export const initDB = (callback) => {
  let tableCount = 4; // Total number of tables to create
  let createdTables = 0;

  const checkAllTablesCreated = () => {
    if (createdTables === tableCount) {
      callback(true);
    }
  };

  const tableCreated = () => {
    createdTables += 1;
    checkAllTablesCreated();
  };

  const tableCreationFailed = (error) => {
    console.error("Error creating table: ", error);
    callback(false);
  };

  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Users (" +
        "employee_id INTEGER PRIMARY KEY NOT NULL, " +
        "partner_id INTEGER, " +
        "username VARCHAR(30), " +
        "email VARCHAR(30), " +
        "profile_picture VARCHAR(255)" +
        ");",
      [],
      () => {
        tableCreated();
        console.log("Users table created successfully");
      },
      (_, error) => {
        tableCreationFailed(error);
        console.log("Error creating Users table: " + error);
      }
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Channels (" +
        "channel_id INTEGER PRIMARY KEY NOT NULL, " +
        "name VARCHAR(50), " +
        "description VARCHAR(255)," +
        "channel_type VARCHAR(20)" +
        ");",
      [],
      () => {
        tableCreated();
        console.log("Channels table created successfully");
      },
      (_, error) => {
        tableCreationFailed(error);
        console.log("Error creating Channels table: " + error);
      }
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Messages (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "odoo_message_id INTEGER, " +
        "channel_id INTEGER, " +
        "user_id INTEGER, " +
        "message TEXT, " +
        "timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, " +
        "is_attachment BOOLEAN," +
        "FOREIGN KEY (channel_id) REFERENCES Channels(channel_id)," +
        "FOREIGN KEY (user_id) REFERENCES Users(user_id)" +
        ");",
      [],
      () => {
        tableCreated();
        console.log("Messages table created successfully");
      },
      (_, error) => {
        tableCreationFailed(error);
        console.log("Error creating Messages table: " + error);
      }
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Attachments (" +
        "attachment_id INTEGER PRIMARY KEY NOT NULL, " +
        "odoo_attachment_id INTEGER, " +
        "message_id INTEGER, " +
        "file_type VARCHAR(50), " +
        "file_url TEXT," +
        "FOREIGN KEY (message_id) REFERENCES Messages(message_id)" +
        ");",
      [],
      () => {
        tableCreated();
        console.log("Attachments table created successfully");
      },
      (_, error) => {
        tableCreationFailed(error);
        console.log("Error creating Attachments table: " + error);
      }
    );
  });
};

// Call the function to ensure the tables are created

// Insert a user into the Users table
export const insertUser = (
  employeeId,
  partnerId,
  username,
  email,
  profilePicture
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Users (employee_id, partner_id, username, email, profile_picture) VALUES (?, ?, ?, ?, ?);",
        [employeeId, partnerId, username, email, profilePicture],
        (_, resultSet) => {
          console.log("User added successfully", resultSet);
          resolve(resultSet);
        },
        (_, error) => {
          console.log("Error adding user: ", error);
          reject(error);
        }
      );
    });
  });
};

// Retrieve users from the Users table
export const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Users;",
        [],
        (_, { rows }) => {
          console.log("Users: ", rows._array);
          resolve(rows._array.length > 0 ? rows._array : null);
        },
        (_, error) => {
          console.log("Error retrieving users: ", error);
          reject(error);
        }
      );
    });
  });
};
export const getUserProfile = (employeeId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Users WHERE employee_id = ?;",
        [employeeId],
        (_, { rows }) => {
          console.log("User successfully retrieved");
          resolve(rows._array.length > 0 ? rows._array[0] : null);
        },
        (_, error) => {
          console.log("Error retrieving user profile: ", error);
          reject(error);
        }
      );
    });
  });
};

export const insertChannel = (channel_id, name, description, channel_type) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Channels (channel_id, name, description, channel_type) VALUES (?, ?, ?, ?);",
        [channel_id, name, description, channel_type],
        (_, resultSet) => {
          console.log("Channel added successfully", resultSet);
          resolve(resultSet);
        },
        (_, error) => {
          console.log("Error adding channel: ", error);
          reject(error);
        }
      );
    });
  });
};

export const getChannels = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Channels;",
        [],
        (_, { rows }) => {
          console.log("Channels: ", rows._array);
          resolve(rows._array.length > 0 ? rows._array : null);
        },
        (_, error) => {
          console.log("Error retrieving Channels: ", error);
          reject(error);
        }
      );
    });
  });
};
export const insertMessage = (
  odoo_message_id,
  channel_id,
  user_id,
  message,
  timestamp,
  is_attachment
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Messages (odoo_message_id, channel_id, user_id, message, timestamp, is_attachment) VALUES (?, ?, ?, ?, ?, ?);",
        [
          odoo_message_id,
          channel_id,
          user_id,
          message,
          timestamp,
          is_attachment,
        ],
        (_, resultSet) => {
          console.log("Message added successfully", resultSet);
          resolve(resultSet);
        },
        (_, error) => {
          console.log("Error adding message: ", error);
          reject(error);
        }
      );
    });
  });
};
export const getMessages = (channel_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM Messages WHERE channel_id = ?;",
      [channel_id],
      (_, { rows }) => console.log("Messages: ", rows._array),
      (_, error) => console.log("Error retrieving messages: ", error)
    );
  });
};
export const insertAttachment = (
  attachment_id,
  odoo_attachment_id,
  message_id,
  file_type,
  file_url
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO Attachments (attachment_id, odoo_attachment_id, message_id, file_type, file_url) VALUES (?, ?, ?, ?, ?);",
      [attachment_id, odoo_attachment_id, message_id, file_type, file_url],
      (_, resultSet) => console.log("Attachment added successfully", resultSet),
      (_, error) => console.log("Error adding attachment: ", error)
    );
  });
};
export const getAttachments = (message_id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM Attachments WHERE message_id = ?;",
      [message_id],
      (_, { rows }) => console.log("Attachments: ", rows._array),
      (_, error) => console.log("Error retrieving attachments: ", error)
    );
  });
};
