const db = require("../config/db");

exports.createCategory = (name) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO categories (name) VALUES (?)",
      [name],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

exports.getCategories = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM categories WHERE status = 1", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
