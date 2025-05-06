const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./connection");
const response = require("./response");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  response(200, "ini data", "Success", res);
});

app.get("/mahasiswa", (req, res) => {
  const sql = "SELECT * FROM Mahasiswa";
  db.query(sql, (err, fields) => {
    if (err) throw err;
    // console.log(fields);
    response(200, fields, "Success", res);
  });
});

app.get("/mahasiswa/:nim", (req, res) => {
  const nim = req.params.nim;
  const sql = `SELECT * FROM Mahasiswa WHERE nim = ${nim}`;
  db.query(sql, (err, fields) => {
    if (err) throw err;
    console.log(fields);
    response(200, fields, "Success", res);
  });
  // res.send(`Spesifik mahasiswa by nim ${nim}`);
});

app.post("/mahasiswa", (req, res) => {
  const { nim, namaLengkap, kelas, alamat } = req.body;

  const sql = `INSERT INTO Mahasiswa (nim,nama_lengkap, kelas, alamat) VALUES (${nim},'${namaLengkap}','${kelas}','${alamat}')`;

  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "errors", res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
      };
      response(200, data, "Data berhasil di buat", res);
    }
  });
});

app.put("/mahasiswa", (req, res) => {
  const { nim, namaLengkap, kelas, alamat } = req.body;

  const sql = `UPDATE mahasiswa SET nama_lengkap = '${namaLengkap}', kelas='${kelas}', alamat='${alamat}' WHERE nim = ${nim}`;

  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "errors", res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        message: fields.message,
      };
      response(200, data, "Update data sucessfully", res);
    } else {
      response(500, "User not found", "error", res);
    }
  });
});

app.delete("/mahasiswa", (req, res) => {
  const { nim } = req.body;
  const sql = `DELETE FROM Mahasiswa WHERE nim = ${nim}`;
  db.query(sql, (err, fields) => {
    if (err) throw err;
    const data = {
      isSuccess: fields.affectedRows,
      message: fields.message,
    };
    if (fields?.affectedRows) {
      response(200, data, "Ini delete data", res);
    } else {
      response(500, "User not found", "error", res);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
