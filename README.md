# School Management System

A complete, full-featured School Management System built with Node.js, Express, SQLite, and modern web technologies.

## Features

### 📚 Student Management
- Add, view, and manage student records
- Track enrollment dates and status
- Store contact information and addresses
- Assign students to classes
 
### 👨‍🏫 Teacher Management
- Manage teacher profiles
- Track qualifications and specializations
- Record hire dates
- Maintain employment status

### 🏫 Class Management
- Create and organize classes
- Assign teachers to classes
- Set class capacity
- Add class descriptions

### 📖 Subject Management
- Add and manage subjects
- Assign subject codes
- Add subject descriptions
- Track all school subjects

### 📊 Grade Management
- Record student grades
- Automatic grade calculation (A+, A, B, C, D, F)
- Support for different exam types
- Organize grades by term

### ✓ Attendance Management
- Mark daily attendance for classes
- Track attendance records
- Filter by class and date
- Record remarks

### 💰 Fee Management
- Track student fees
- Manage payment status
- Record payment dates
- Monthly and yearly fee tracking

## 📋 Database Tables

The system uses SQLite with the following tables:
- `students` - Student information
- `teachers` - Teacher information
- `classes` - Class information
- `subjects` - Subject information
- `grades` - Student grades
- `attendance` - Attendance records
- `fees` - Fee records
- `timetable` - Class timetable (extensible)

## Installation

### Prerequisites
- Node.js (v12 or higher)
- npm

### Setup Steps

1. **Navigate to project directory:**
   ```bash
   cd d:\cleveland
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000/admin.html
   ```

## Usage

### Starting the System
```bash
npm start
```
The server will run on `http://localhost:3000`

### Admin Dashboard
Access the complete admin interface at:
```
http://localhost:3000/admin.html
```

### API Endpoints

#### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get specific student
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

#### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Add new teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

#### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Add new class

#### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Add new subject

#### Grades
- `GET /api/grades` - Get all grades
- `POST /api/grades` - Record new grade

#### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Record attendance

#### Fees
- `GET /api/fees` - Get fee records
- `POST /api/fees` - Add fee record
- `PUT /api/fees/:id` - Update fee record

## Project Structure

```
cleveland/
├── server.js              # Express server & API routes
├── school.db             # SQLite database (auto-created)
├── package.json          # Dependencies
├── public/
│   ├── admin.html        # Admin dashboard HTML
│   ├── style.css         # Dashboard styling
│   └── script.js         # Frontend JavaScript
└── README.md             # This file
```

## Technologies Used

### Backend
- **Express.js** - Web framework
- **SQLite3** - Database
- **Node.js** - Runtime

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with gradients and animations
- **Vanilla JavaScript** - Interactivity
- **Fetch API** - HTTP requests

## Features Highlights

✅ **Responsive Design** - Works on desktop and tablet
✅ **Modern UI** - Gradient backgrounds and smooth animations
✅ **Real-time Updates** - Instant data refresh after actions
✅ **Form Validation** - Input validation on forms
✅ **Error Handling** - User-friendly error messages
✅ **Search/Filter** - Quick data lookup
✅ **Auto-calculation** - Automatic grade calculation
✅ **Status Tracking** - Track student and teacher status

## Database Location

The SQLite database file `school.db` is automatically created in the project root directory.

## Development Notes

- The system uses CORS to allow frontend-backend communication
- All dates are stored in ISO format (YYYY-MM-DD)
- Grades are automatically calculated based on marks and percentage
- The system supports multiple terms and exam types
- Teachers can be assigned to multiple classes

## Future Enhancements

- User authentication and authorization
- Email notifications
- Report generation (PDF)
- Parent portal
- Mobile app
- Advanced timetable management
- Online exam system
- Assignment submission system

## License

Created for educational purposes - 2024

## Support

For issues or questions, please ensure:
1. Node.js and npm are properly installed
2. All dependencies are installed (`npm install`)
3. Port 3000 is not in use
4. SQLite permission is granted in the project directory

---

**System Ready!** 🎓

Start managing your school efficiently with this comprehensive management system.
