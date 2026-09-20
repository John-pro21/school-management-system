const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware 
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Database initialization
const db = new sqlite3.Database(path.join(__dirname, 'school.db'), (err) => {
  if (err) {
    console.error('Database error:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Students table
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      date_of_birth DATE,
      gender TEXT,
      address TEXT,
      class_id INTEGER,
      enrollment_date DATE DEFAULT CURRENT_DATE,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Teachers table
    db.run(`CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      qualification TEXT,
      specialization TEXT,
      hire_date DATE,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Classes table
    db.run(`CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      level TEXT,
      teacher_id INTEGER,
      capacity INTEGER,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(teacher_id) REFERENCES teachers(id)
    )`);

    // Subjects table
    db.run(`CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      code TEXT UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Grades table
    db.run(`CREATE TABLE IF NOT EXISTS grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      exam_type TEXT,
      marks_obtained REAL,
      total_marks REAL DEFAULT 100,
      percentage REAL,
      grade TEXT,
      term TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    )`);

    // Attendance table
    db.run(`CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      class_id INTEGER NOT NULL,
      attendance_date DATE NOT NULL,
      status TEXT DEFAULT 'present',
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(class_id) REFERENCES classes(id)
    )`);

    // Timetable table
    db.run(`CREATE TABLE IF NOT EXISTS timetable (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      teacher_id INTEGER,
      day TEXT,
      start_time TEXT,
      end_time TEXT,
      room TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(subject_id) REFERENCES subjects(id),
      FOREIGN KEY(teacher_id) REFERENCES teachers(id)
    )`);

    // Fees table
    db.run(`CREATE TABLE IF NOT EXISTS fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      amount REAL,
      month TEXT,
      year INTEGER,
      paid_date DATE,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES students(id)
    )`);

    console.log('Database tables initialized');
  });
}

// ======================== STUDENT ROUTES ========================
app.get('/api/students', (req, res) => {
  db.all('SELECT * FROM students ORDER BY name', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get('/api/students/:id', (req, res) => {
  db.get('SELECT * FROM students WHERE id = ?', [req.params.id], (err, row) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(row);
  });
});

app.post('/api/students', (req, res) => {
  const { name, email, phone, date_of_birth, gender, address, class_id } = req.body;
  db.run(
    'INSERT INTO students (name, email, phone, date_of_birth, gender, address, class_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone, date_of_birth, gender, address, class_id],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, message: 'Student added successfully' });
    }
  );
});

app.put('/api/students/:id', (req, res) => {
  const { name, email, phone, date_of_birth, gender, address, class_id, status } = req.body;
  db.run(
    'UPDATE students SET name = ?, email = ?, phone = ?, date_of_birth = ?, gender = ?, address = ?, class_id = ?, status = ? WHERE id = ?',
    [name, email, phone, date_of_birth, gender, address, class_id, status, req.params.id],
    (err) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ message: 'Student updated successfully' });
    }
  );
});

app.delete('/api/students/:id', (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', [req.params.id], (err) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Student deleted successfully' });
  });
});

// ======================== TEACHER ROUTES ========================
app.get('/api/teachers', (req, res) => {
  db.all('SELECT * FROM teachers ORDER BY name', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get('/api/teachers/:id', (req, res) => {
  db.get('SELECT * FROM teachers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(row);
  });
});

app.post('/api/teachers', (req, res) => {
  const { name, email, phone, qualification, specialization, hire_date } = req.body;
  db.run(
    'INSERT INTO teachers (name, email, phone, qualification, specialization, hire_date) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, phone, qualification, specialization, hire_date],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, message: 'Teacher added successfully' });
    }
  );
});

app.put('/api/teachers/:id', (req, res) => {
  const { name, email, phone, qualification, specialization, hire_date, status } = req.body;
  db.run(
    'UPDATE teachers SET name = ?, email = ?, phone = ?, qualification = ?, specialization = ?, hire_date = ?, status = ? WHERE id = ?',
    [name, email, phone, qualification, specialization, hire_date, status, req.params.id],
    (err) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ message: 'Teacher updated successfully' });
    }
  );
});

app.delete('/api/teachers/:id', (req, res) => {
  db.run('DELETE FROM teachers WHERE id = ?', [req.params.id], (err) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Teacher deleted successfully' });
  });
});

// ======================== CLASS ROUTES ========================
app.get('/api/classes', (req, res) => {
  db.all('SELECT * FROM classes ORDER BY name', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post('/api/classes', (req, res) => {
  const { name, level, teacher_id, capacity, description } = req.body;
  db.run(
    'INSERT INTO classes (name, level, teacher_id, capacity, description) VALUES (?, ?, ?, ?, ?)',
    [name, level, teacher_id, capacity, description],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, message: 'Class added successfully' });
    }
  );
});

app.delete('/api/classes/:id', (req, res) => {
  db.run('DELETE FROM classes WHERE id = ?', [req.params.id], (err) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Class deleted successfully' });
  });
});

// ======================== SUBJECT ROUTES ========================
app.get('/api/subjects', (req, res) => {
  db.all('SELECT * FROM subjects ORDER BY name', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post('/api/subjects', (req, res) => {
  const { name, code, description } = req.body;
  db.run(
    'INSERT INTO subjects (name, code, description) VALUES (?, ?, ?)',
    [name, code, description],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, message: 'Subject added successfully' });
    }
  );
});

// ======================== GRADES ROUTES ========================
app.get('/api/grades', (req, res) => {
  db.all('SELECT * FROM grades ORDER BY created_at DESC', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post('/api/grades', (req, res) => {
  const { student_id, subject_id, exam_type, marks_obtained, total_marks, term } = req.body;
  const percentage = (marks_obtained / total_marks) * 100;
  let grade;
  
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 50) grade = 'D';
  else grade = 'F';

  db.run(
    'INSERT INTO grades (student_id, subject_id, exam_type, marks_obtained, total_marks, percentage, grade, term) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [student_id, subject_id, exam_type, marks_obtained, total_marks, percentage, grade, term],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, grade, message: 'Grade added successfully' });
    }
  );
});

// ======================== ATTENDANCE ROUTES ========================
app.get('/api/attendance', (req, res) => {
  const { class_id, date } = req.query;
  let query = 'SELECT * FROM attendance WHERE 1=1';
  const params = [];

  if (class_id) {
    query += ' AND class_id = ?';
    params.push(class_id);
  }
  if (date) {
    query += ' AND attendance_date = ?';
    params.push(date);
  }

  db.all(query + ' ORDER BY attendance_date DESC', params, (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post('/api/attendance', (req, res) => {
  const { student_id, class_id, attendance_date, status, remarks } = req.body;
  db.run(
    'INSERT INTO attendance (student_id, class_id, attendance_date, status, remarks) VALUES (?, ?, ?, ?, ?)',
    [student_id, class_id, attendance_date, status, remarks],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, message: 'Attendance recorded' });
    }
  );
});

// ======================== FEES ROUTES ========================
app.get('/api/fees', (req, res) => {
  db.all('SELECT * FROM fees ORDER BY year DESC, month DESC', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post('/api/fees', (req, res) => {
  const { student_id, amount, month, year, status } = req.body;
  db.run(
    'INSERT INTO fees (student_id, amount, month, year, status) VALUES (?, ?, ?, ?, ?)',
    [student_id, amount, month, year, status],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, message: 'Fee record added' });
    }
  );
});

app.put('/api/fees/:id', (req, res) => {
  const { status, paid_date } = req.body;
  db.run(
    'UPDATE fees SET status = ?, paid_date = ? WHERE id = ?',
    [status, paid_date, req.params.id],
    (err) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ message: 'Fee record updated' });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`School Management System running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error(err.message);
    console.log('Database connection closed');
    process.exit(0);
  });
});
