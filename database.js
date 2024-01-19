import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("MyDatabase.db");

// Call the function to ensure the table is created
export const initDB = (callback) => {
  let tableCount = 5; // Total number of tables to create
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
        "name VARCHAR(255), " + // Changed from username to name
        "email VARCHAR(255), " + // Adjusted field length
        "mobile_phone VARCHAR(20), " + // Added mobile_phone field
        "user_partner_id INTEGER, " + // Added user_partner_id field
        "attendance_state VARCHAR(20), " + // Added attendance_state field
        "profile_picture VARCHAR(255)" + // Existing profile_picture field
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
        "id INTEGER PRIMARY KEY NOT NULL, " +
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
        "odoo_message_id INTEGER UNIQUE, " +
        "channel_id INTEGER, " +
        "partner_id INTEGER, " +
        "username VARCHAR(30), " +
        "message TEXT, " +
        "timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, " +
        "attachment_ids TEXT," +
        "status TEXT CHECK(status IN ('sent', 'received', 'pending')) DEFAULT 'pending', " +
        "FOREIGN KEY (channel_id) REFERENCES Channels(id)," +
        "FOREIGN KEY (partner_id) REFERENCES Users(partner_id)" +
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
      "CREATE TABLE IF NOT EXISTS Cars (" +
        "id INTEGER PRIMARY KEY NOT NULL, " +
        "name VARCHAR(100), " +
        "description VARCHAR(255), " +
        "license_plate VARCHAR(20) " +
        ");",
      [],
      () => {
        tableCreated();
        console.log("Cars table created successfully");
      },
      (_, error) => {
        tableCreationFailed(error);
        console.log("Error creating Cars table: " + error);
      }
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Attachments (" +
        "attachment_id INTEGER PRIMARY KEY NOT NULL, " +
        "odoo_attachment_id INTEGER UNIQUE, " +
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
  profilePicture,
  phone,
  attendance
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Users (employee_id, partner_id, name, email, profile_picture, mobile_phone, attendance_state) VALUES (?, ?, ?, ?, ?, ?, ?);",
        [
          employeeId,
          partnerId,
          username,
          email,
          profilePicture,
          phone,
          attendance,
        ],
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
export const getUserCounts = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT " +
          "(SELECT COUNT(*) FROM Users) as totalEmployees, " +
          "(SELECT COUNT(*) FROM Users WHERE attendance_state = 'checked_in') as activeEmployees, " +
          "(SELECT COUNT(*) FROM Users WHERE attendance_state = 'checked_out') as inactiveEmployees;",
        [],
        (_, { rows }) => {
          resolve(rows._array.length > 0 ? rows._array[0] : null);
        },
        (_, error) => {
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
        "INSERT INTO Channels (id, name, description, channel_type) VALUES (?, ?, ?, ?);",
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
  partner_id,
  username,
  message,
  timestamp,
  attachment_ids,
  status = "pending"
) => {
  console.log("insertMessage called");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Messages (odoo_message_id, channel_id, partner_id, username, message, timestamp, attachment_ids,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
        [
          odoo_message_id,
          channel_id,
          partner_id,
          username,
          message,
          timestamp,
          attachment_ids,
          status,
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
export const getLocalMessages = (channel_id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Messages WHERE channel_id = ? ORDER BY timestamp DESC;", // Added ORDER BY clause
        [channel_id],
        (_, { rows }) => {
          console.log("Messages: ", rows._array);
          resolve(rows._array);
        },
        (_, error) => {
          console.log("Error retrieving messages: ", error);
          reject(error);
        }
      );
    });
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
export const wipeMessagesTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM Messages;",
        [],
        (_, resultSet) => {
          console.log("Messages table wiped successfully");
          resolve(resultSet);
        },
        (_, error) => {
          console.log("Error wiping Messages table: ", error);
          reject(error);
        }
      );
    });
  });
};
export const insertCar = (car_id, name, description, license_plate) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Cars (id, name, description, license_plate) VALUES (?, ?, ?, ?);",
        [car_id, name, description, license_plate],
        (_, resultSet) => {
          console.log("Car added successfully", resultSet);
          resolve(resultSet);
        },
        (_, error) => {
          console.log("Error adding car: ", error);
          reject(error);
        }
      );
    });
  });
};

export const getCars = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Cars;",
        [],
        (_, { rows }) => {
          console.log("Cars: ", rows._array);
          resolve(rows._array.length > 0 ? rows._array : null);
        },
        (_, error) => {
          console.log("Error retrieving cars: ", error);
          reject(error);
        }
      );
    });
  });
};
