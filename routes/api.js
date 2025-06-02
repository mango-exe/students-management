const express = require('express');
const router = express.Router();
const { Student, Teacher, Course, CourseRegistration, Grade } = require('../models');

// 1. Student login or create
router.post('/students', async (req, res) => {
  try {
    const { name, email } = req.body;

    let student = await Student.findOne({ where: { name, email } });
    if (!student) {
      student = await Student.create({ name, email });
      return res.status(201).json({ user: student, message: 'Student created' });
    }

    // User exists -> login
    res.json({ user: student, message: 'Student logged in' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Teacher login or create
router.post('/teachers', async (req, res) => {
  try {
    const { name, email } = req.body;

    let teacher = await Teacher.findOne({ where: { name, email } });
    if (!teacher) {
      teacher = await Teacher.create({ name, email });
      return res.status(201).json({ user: teacher, message: 'Teacher created' });
    }

    // User exists -> login
    res.json({ user: teacher, message: 'Teacher logged in' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all available courses
router.get('/all-courses', async (req, res) => {
  try {
    const courses = await Course.findAll({
      attributes: ['id', 'title', 'teacherId'],
      include: [{
        model: Teacher,
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(courses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Teacher creates a course
router.post('/courses', async (req, res) => {
  try {
    const { title, teacherId } = req.body;
    // Optional: validate teacherId exists
    const course = await Course.create({ title, teacherId });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Student joins a course
router.post('/courses/:courseId/join', async (req, res) => {
  try {
    const { studentId } = req.body;
    const { courseId } = req.params;

    // Check if course and student exist
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Create registration
    await CourseRegistration.create({ courseId, studentId });
    res.status(201).json({ message: `Student ${studentId} joined course ${courseId}` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Teacher grades a student in his course
router.post('/courses/:courseId/grade', async (req, res) => {
  try {
    const { teacherId, studentId, value } = req.body;
    const { courseId } = req.params;

    // Verify course belongs to teacher
    const course = await Course.findOne({ where: { id: courseId, teacherId } });
    if (!course) return res.status(403).json({ error: 'You do not teach this course' });

    // Verify student is registered in course
    const registration = await CourseRegistration.findOne({ where: { courseId, studentId } });
    if (!registration) return res.status(400).json({ error: 'Student is not registered in this course' });

    // Create or update grade
    let grade = await Grade.findOne({ where: { courseId, studentId } });
    if (grade) {
      grade.value = value;
      await grade.save();
    } else {
      grade = await Grade.create({ courseId, studentId, value });
    }

    res.status(201).json(grade);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Student views all grades for joined courses
router.get('/students/:studentId/grades', async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find grades with course info
    const grades = await Grade.findAll({
      where: { studentId },
      include: [{ model: Course, attributes: ['id', 'title'] }],
    });

    res.json(grades);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 7. Teacher views all grades for courses he teaches
router.get('/teachers/:teacherId/grades', async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Find all courses by teacher
    const courses = await Course.findAll({ where: { teacherId }, attributes: ['id', 'title'] });
    const courseIds = courses.map(c => c.id);

    // Find all grades for these courses
    const grades = await Grade.findAll({
      where: { courseId: courseIds },
      include: [
        { model: Student, attributes: ['id', 'name', 'email'] },
        { model: Course, attributes: ['id', 'title'] },
      ],
    });

    res.json(grades);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all courses created by a teacher
router.get('/teachers/:teacherId/courses', async (req, res) => {
  try {
    const { teacherId } = req.params;

    const courses = await Course.findAll({
      where: { teacherId },
      attributes: ['id', 'title'],
    });

    res.json(courses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all students registered in a course
router.get('/courses/:courseId/students', async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify course exists
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Get students registered for this course through the many-to-many relation
    const students = await course.getStudents({
      attributes: ['id', 'name', 'email']
    });

    res.json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




module.exports = router;
