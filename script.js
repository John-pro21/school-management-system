const API_BASE = 'http://localhost:3000/api';

// ======================== TAB NAVIGATION ========================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Remove active class from all buttons and tabs
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked button and corresponding tab
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load data for the tab
        loadTabData(tabName);
    });
}); 

function loadTabData(tabName) {
    if (tabName === 'dashboard') {
        loadDashboardStats();
    } else if (tabName === 'students') {
        loadStudents();
        loadClassesForSelect('#studentClass');
    } else if (tabName === 'teachers') {
        loadTeachers();
    } else if (tabName === 'classes') {
        loadClasses();
        loadTeachersForSelect('#classTeacher');
    } else if (tabName === 'subjects') {
        loadSubjects();
    } else if (tabName === 'grades') {
        loadGrades();
        loadStudentsForSelect('#gradeStudent');
        loadSubjectsForSelect('#gradeSubject');
    } else if (tabName === 'attendance') {
        loadAttendanceRecords();
        loadClassesForSelect('#attendanceClass');
    } else if (tabName === 'fees') {
        loadFees();
        loadStudentsForSelect('#feeStudent');
    }
}

// ======================== DASHBOARD ========================
async function loadDashboardStats() {
    try {
        const [students, teachers, classes, subjects] = await Promise.all([
            fetch(`${API_BASE}/students`).then(r => r.json()),
            fetch(`${API_BASE}/teachers`).then(r => r.json()),
            fetch(`${API_BASE}/classes`).then(r => r.json()),
            fetch(`${API_BASE}/subjects`).then(r => r.json())
        ]);
        
        document.getElementById('stat-students').textContent = students.length;
        document.getElementById('stat-teachers').textContent = teachers.length;
        document.getElementById('stat-classes').textContent = classes.length;
        document.getElementById('stat-subjects').textContent = subjects.length;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// ======================== STUDENTS ========================
document.getElementById('studentForm')?.addEventListener('submit', addStudent);

async function addStudent(e) {
    e.preventDefault();
    
    const studentData = {
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        phone: document.getElementById('studentPhone').value,
        date_of_birth: document.getElementById('studentDOB').value,
        gender: document.getElementById('studentGender').value,
        address: document.getElementById('studentAddress').value,
        class_id: document.getElementById('studentClass').value || null
    };
    
    try {
        const response = await fetch(`${API_BASE}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        
        if (response.ok) {
            showAlert('Student added successfully!', 'success');
            document.getElementById('studentForm').reset();
            loadStudents();
        } else {
            showAlert('Error adding student', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error adding student', 'error');
    }
}

async function loadStudents() {
    try {
        const response = await fetch(`${API_BASE}/students`);
        const students = await response.json();
        
        const tbody = document.getElementById('studentsList');
        tbody.innerHTML = '';
        
        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No students found</td></tr>';
            return;
        }
        
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email || '-'}</td>
                <td>${student.phone || '-'}</td>
                <td>${student.class_id || '-'}</td>
                <td><span class="status ${student.status}">${student.status}</span></td>
                <td>
                    <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showAlert('Student deleted successfully!', 'success');
            loadStudents();
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error deleting student', 'error');
    }
}

async function loadStudentsForSelect(selector) {
    try {
        const response = await fetch(`${API_BASE}/students`);
        const students = await response.json();
        const select = document.querySelector(selector);
        
        select.innerHTML = '<option value="">Select Student</option>';
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading students for select:', error);
    }
}

// ======================== TEACHERS ========================
document.getElementById('teacherForm')?.addEventListener('submit', addTeacher);

async function addTeacher(e) {
    e.preventDefault();
    
    const teacherData = {
        name: document.getElementById('teacherName').value,
        email: document.getElementById('teacherEmail').value,
        phone: document.getElementById('teacherPhone').value,
        qualification: document.getElementById('teacherQualification').value,
        specialization: document.getElementById('teacherSpecialization').value,
        hire_date: document.getElementById('teacherHireDate').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/teachers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teacherData)
        });
        
        if (response.ok) {
            showAlert('Teacher added successfully!', 'success');
            document.getElementById('teacherForm').reset();
            loadTeachers();
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error adding teacher', 'error');
    }
}

async function loadTeachers() {
    try {
        const response = await fetch(`${API_BASE}/teachers`);
        const teachers = await response.json();
        
        const tbody = document.getElementById('teachersList');
        tbody.innerHTML = '';
        
        if (teachers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No teachers found</td></tr>';
            return;
        }
        
        teachers.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.id}</td>
                <td>${teacher.name}</td>
                <td>${teacher.email || '-'}</td>
                <td>${teacher.specialization || '-'}</td>
                <td>${teacher.qualification || '-'}</td>
                <td><span class="status ${teacher.status}">${teacher.status}</span></td>
                <td>
                    <button class="btn btn-danger" onclick="deleteTeacher(${teacher.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading teachers:', error);
    }
}

async function deleteTeacher(id) {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/teachers/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showAlert('Teacher deleted successfully!', 'success');
            loadTeachers();
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error deleting teacher', 'error');
    }
}

async function loadTeachersForSelect(selector) {
    try {
        const response = await fetch(`${API_BASE}/teachers`);
        const teachers = await response.json();
        const select = document.querySelector(selector);
        
        select.innerHTML = '<option value="">Select Teacher</option>';
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = teacher.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading teachers for select:', error);
    }
}

// ======================== CLASSES ========================
document.getElementById('classForm')?.addEventListener('submit', addClass);

async function addClass(e) {
    e.preventDefault();
    
    const classData = {
        name: document.getElementById('className').value,
        level: document.getElementById('classLevel').value,
        teacher_id: document.getElementById('classTeacher').value || null,
        capacity: document.getElementById('classCapacity').value,
        description: document.getElementById('classDescription').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/classes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(classData)
        });
        
        if (response.ok) {
            showAlert('Class added successfully!', 'success');
            document.getElementById('classForm').reset();
            loadClasses();
            loadClassesForSelect('#studentClass');
            loadClassesForSelect('#attendanceClass');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error adding class', 'error');
    }
}

async function loadClasses() {
    try {
        const response = await fetch(`${API_BASE}/classes`);
        const classes = await response.json();
        
        const tbody = document.getElementById('classesList');
        tbody.innerHTML = '';
        
        if (classes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No classes found</td></tr>';
            return;
        }
        
        classes.forEach(cls => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cls.id}</td>
                <td>${cls.name}</td>
                <td>${cls.level || '-'}</td>
                <td>${cls.teacher_id || '-'}</td>
                <td>${cls.capacity || '-'}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteClass(${cls.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

async function deleteClass(id) {
    if (!confirm('Are you sure?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/classes/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showAlert('Class deleted successfully!', 'success');
            loadClasses();
            loadClassesForSelect('#studentClass');
            loadClassesForSelect('#attendanceClass');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error deleting class', 'error');
    }
}

async function loadClassesForSelect(selector) {
    try {
        const response = await fetch(`${API_BASE}/classes`);
        const classes = await response.json();
        const select = document.querySelector(selector);
        if (!select) return;
        
        select.innerHTML = '<option value="">Select Class</option>';
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

// ======================== SUBJECTS ========================
document.getElementById('subjectForm')?.addEventListener('submit', addSubject);

async function addSubject(e) {
    e.preventDefault();
    
    const subjectData = {
        name: document.getElementById('subjectName').value,
        code: document.getElementById('subjectCode').value,
        description: document.getElementById('subjectDescription').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/subjects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subjectData)
        });
        
        if (response.ok) {
            showAlert('Subject added successfully!', 'success');
            document.getElementById('subjectForm').reset();
            loadSubjects();
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error adding subject', 'error');
    }
}

async function loadSubjects() {
    try {
        const response = await fetch(`${API_BASE}/subjects`);
        const subjects = await response.json();
        
        const tbody = document.getElementById('subjectsList');
        tbody.innerHTML = '';
        
        if (subjects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No subjects found</td></tr>';
            return;
        }
        
        subjects.forEach(subject => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subject.id}</td>
                <td>${subject.name}</td>
                <td>${subject.code}</td>
                <td>${subject.description || '-'}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading subjects:', error);
    }
}

async function loadSubjectsForSelect(selector) {
    try {
        const response = await fetch(`${API_BASE}/subjects`);
        const subjects = await response.json();
        const select = document.querySelector(selector);
        
        select.innerHTML = '<option value="">Select Subject</option>';
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading subjects:', error);
    }
}

// ======================== GRADES ========================
document.getElementById('gradeForm')?.addEventListener('submit', addGrade);

async function addGrade(e) {
    e.preventDefault();
    
    const gradeData = {
        student_id: document.getElementById('gradeStudent').value,
        subject_id: document.getElementById('gradeSubject').value,
        exam_type: document.getElementById('gradeExamType').value,
        marks_obtained: parseFloat(document.getElementById('gradeMarks').value),
        total_marks: parseFloat(document.getElementById('gradeTotalMarks').value),
        term: document.getElementById('gradeTerm').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/grades`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gradeData)
        });
        
        if (response.ok) {
            showAlert('Grade recorded successfully!', 'success');
            document.getElementById('gradeForm').reset();
            loadGrades();
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error recording grade', 'error');
    }
}

async function loadGrades() {
    try {
        const response = await fetch(`${API_BASE}/grades`);
        const grades = await response.json();
        
        const tbody = document.getElementById('gradesList');
        tbody.innerHTML = '';
        
        if (grades.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No grades found</td></tr>';
            return;
        }
        
        grades.forEach(grade => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${grade.student_id}</td>
                <td>${grade.subject_id}</td>
                <td>${grade.exam_type || '-'}</td>
                <td>${grade.marks_obtained}/${grade.total_marks}</td>
                <td>${grade.percentage?.toFixed(2)}%</td>
                <td><strong>${grade.grade}</strong></td>
                <td>${grade.term || '-'}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading grades:', error);
    }
}

// ======================== ATTENDANCE ========================
document.getElementById('attendanceForm')?.addEventListener('submit', saveAttendance);

document.getElementById('attendanceClass')?.addEventListener('change', loadClassStudents);

async function loadClassStudents() {
    const classId = document.getElementById('attendanceClass').value;
    if (!classId) {
        document.getElementById('attendanceList').innerHTML = '<p>Select class and date to mark attendance</p>';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/students`);
        const students = await response.json();
        const classStudents = students.filter(s => s.class_id == classId);
        
        let html = '';
        classStudents.forEach(student => {
            html += `
                <div class="attendance-item">
                    <label>${student.name} (ID: ${student.id})</label>
                    <select name="attendance_${student.id}">
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                    </select>
                </div>
            `;
        });
        
        document.getElementById('attendanceList').innerHTML = html || '<p>No students in this class</p>';
    } catch (error) {
        console.error('Error:', error);
    }
}

async function saveAttendance(e) {
    e.preventDefault();
    
    const classId = document.getElementById('attendanceClass').value;
    const date = document.getElementById('attendanceDate').value;
    
    if (!classId || !date) {
        showAlert('Please select class and date', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/students`);
        const students = await response.json();
        const classStudents = students.filter(s => s.class_id == classId);
        
        for (const student of classStudents) {
            const status = document.querySelector(`select[name="attendance_${student.id}"]`)?.value;
            if (status) {
                await fetch(`${API_BASE}/attendance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        student_id: student.id,
                        class_id: classId,
                        attendance_date: date,
                        status: status,
                        remarks: ''
                    })
                });
            }
        }
        
        showAlert('Attendance saved successfully!', 'success');
        loadAttendanceRecords();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error saving attendance', 'error');
    }
}

async function loadAttendanceRecords() {
    try {
        const response = await fetch(`${API_BASE}/attendance`);
        const records = await response.json();
        
        const tbody = document.getElementById('attendanceRecordsList');
        tbody.innerHTML = '';
        
        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No attendance records found</td></tr>';
            return;
        }
        
        records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.student_id}</td>
                <td>${record.class_id}</td>
                <td>${record.attendance_date}</td>
                <td><strong>${record.status.toUpperCase()}</strong></td>
                <td>${record.remarks || '-'}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading attendance:', error);
    }
}

function filterAttendance() {
    // Could be enhanced to actually filter
    loadAttendanceRecords();
}

// ======================== FEES ========================
document.getElementById('feeForm')?.addEventListener('submit', addFee);

async function addFee(e) {
    e.preventDefault();
    
    const feeData = {
        student_id: document.getElementById('feeStudent').value,
        amount: parseFloat(document.getElementById('feeAmount').value),
        month: document.getElementById('feeMonth').value,
        year: parseInt(document.getElementById('feeYear').value),
        status: document.getElementById('feeStatus').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/fees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feeData)
        });
        
        if (response.ok) {
            showAlert('Fee record added successfully!', 'success');
            document.getElementById('feeForm').reset();
            loadFees();
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error adding fee record', 'error');
    }
}

async function loadFees() {
    try {
        const response = await fetch(`${API_BASE}/fees`);
        const fees = await response.json();
        
        const tbody = document.getElementById('feesList');
        tbody.innerHTML = '';
        
        if (fees.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No fee records found</td></tr>';
            return;
        }
        
        fees.forEach(fee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${fee.student_id}</td>
                <td>${fee.amount}</td>
                <td>${fee.month}</td>
                <td>${fee.year}</td>
                <td><span class="status ${fee.status}">${fee.status.toUpperCase()}</span></td>
                <td>${fee.paid_date || '-'}</td>
                <td>
                    ${fee.status === 'pending' ? `<button class="btn btn-danger" onclick="markFeePaid(${fee.id})">Mark Paid</button>` : '-'}
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading fees:', error);
    }
}

async function markFeePaid(id) {
    try {
        const response = await fetch(`${API_BASE}/fees/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'paid',
                paid_date: new Date().toISOString().split('T')[0]
            })
        });
        
        if (response.ok) {
            showAlert('Fee marked as paid!', 'success');
            loadFees();
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error marking fee as paid', 'error');
    }
}

// ======================== UTILITY FUNCTIONS ========================
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    
    const content = document.querySelector('.content');
    content.insertBefore(alert, content.firstChild);
    
    setTimeout(() => alert.remove(), 4000);
}

// Load initial data on page load
window.addEventListener('load', () => {
    loadDashboardStats();
});
