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
export const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "DELETE FROM Users WHERE id = ?;",
          [channelId],
          (_, result) => {
            console.log("User deleted successfully", result);
            resolve(result);
          },
          (_, error) => {
            console.log("Error deleting User: ", error);
            reject(error);
          }
        );
      },
      (error) => {
        console.log("Transaction error on deleting User: ", error);
        reject(error);
      },
      () => {
        console.log("User deletion transaction successful");
        resolve(true);
      }
    );
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
export const updateUserName = (employee_id, newName) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "UPDATE Users SET name = ? WHERE employee_id = ?;",
          [newName, employee_id],
          (_, result) => {
            console.log("User name updated successfully", result);
            resolve(result);
          },
          (_, error) => {
            console.log("Error updating user name: ", error);
            reject(error);
          }
        );
      },
      (error) => {
        console.log("Transaction error on updating user name: ", error);
        reject(error);
      },
      () => {
        console.log("User name update transaction successful");
        resolve(true);
      }
    );
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
export const deleteChannel = (channelId) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "DELETE FROM Channels WHERE id = ?;",
          [channelId],
          (_, result) => {
            console.log("Channel deleted successfully", result);
            resolve(result);
          },
          (_, error) => {
            console.log("Error deleting channel: ", error);
            reject(error);
          }
        );
      },
      (error) => {
        console.log("Transaction error on deleting channel: ", error);
        reject(error);
      },
      () => {
        console.log("Channel deletion transaction successful");
        resolve(true);
      }
    );
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
export const wipeAllTables = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        const tables = ["Users", "Channels", "Cars"];
        tables.forEach((table) => {
          tx.executeSql(
            `DELETE FROM ${table};`,
            [],
            () => console.log(`${table} table wiped successfully`),
            (_, error) => {
              console.log(`Error wiping ${table} table: `, error);
              reject(error);
              return false; // Stop the transaction
            }
          );
        });
      },
      (error) => {
        console.log("Transaction error wiping tables: ", error);
        reject(error);
      },
      () => {
        console.log("All tables wiped successfully");
        resolve(true);
      }
    );
  });
};
