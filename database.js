import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("MyDatabase.db");

// Function to create the Users table
const createUsersTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Users (" +
        "user_id INTEGER PRIMARY KEY NOT NULL, " +
        "employee_id INTEGER," +
        "partner_id INTEGER, " +
        "username VARCHAR(30), " +
        "email VARCHAR(30), " +
        "profile_picture VARCHAR(255)" +
        ");",
      [],
      () => {
        console.log("Users table created successfully");
      },
      (_, error) => {
        console.log("Error creating Users table: " + error);
      }
    );
  });
};
const createChannelsTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Channels (" +
        "channel_id INTEGER PRIMARY KEY NOT NULL, " +
        "odoo_channel_id INTEGER, " +
        "name VARCHAR(50), " +
        "description VARCHAR(255)" +
        ");",
      [],
      () => {
        console.log("Channels table created successfully");
      },
      (_, error) => {
        console.log("Error creating Channels table: " + error);
      }
    );
  });
};
const createMessagesTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Messages (" +
        "message_id INTEGER PRIMARY KEY NOT NULL, " +
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
        console.log("Messages table created successfully");
      },
      (_, error) => {
        console.log("Error creating Messages table: " + error);
      }
    );
  });
};
const createAttachmentsTable = () => {
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
        console.log("Attachments table created successfully");
      },
      (_, error) => {
        console.log("Error creating Attachments table: " + error);
      }
    );
  });
};

// Call the function to ensure the table is created
const initDB = () => {
  createUsersTable();
  createChannelsTable();
  createMessagesTable();
  createAttachmentsTable();
  // Add more initialization if needed
};

// Call the function to ensure the tables are created
initDB();
// Insert a user into the Users table
const insertUser = (
  userId,
  employeeId,
  partnerId,
  username,
  email,
  profilePicture
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO Users (user_id, employee_id, partner_id, username, email, profile_picture) VALUES (?, ?, ?, ?, ?, ?);",
      [userId, employeeId, partnerId, username, email, profilePicture],
      (_, resultSet) => console.log("User added successfully", resultSet),
      (_, error) => console.log("Error adding user: ", error)
    );
  });
};

// Retrieve users from the Users table
export const getUsers = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM Users;",
      [],
      (_, { rows }) => console.log("Users: ", rows._array),
      (_, error) => console.log("Error retrieving users: ", error)
    );
  });
};
export const insertChannel = (channel_id, odoo_channel_id, name, description) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO Channels (channel_id, odoo_channel_id, name, description) VALUES (?, ?, ?, ?);",
      [channel_id, odoo_channel_id, name, description],
      (_, resultSet) => console.log("Channel added successfully", resultSet),
      (_, error) => console.log("Error adding channel: ", error)
    );
  });
};

export const getChannels = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM Channels;",
      [],
      (_, { rows }) => console.log("Channels: ", rows._array),
      (_, error) => console.log("Error retrieving channels: ", error)
    );
  });
};
export const insertMessage = (
  message_id,
  odoo_message_id,
  channel_id,
  user_id,
  message,
  timestamp,
  is_attachment
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO Messages (message_id, odoo_message_id, channel_id, user_id, message, timestamp, is_attachment) VALUES (?, ?, ?, ?, ?, ?, ?);",
      [
        message_id,
        odoo_message_id,
        channel_id,
        user_id,
        message,
        timestamp,
        is_attachment,
      ],
      (_, resultSet) => console.log("Message added successfully", resultSet),
      (_, error) => console.log("Error adding message: ", error)
    );
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
