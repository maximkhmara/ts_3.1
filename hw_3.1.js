"use strict";
const defaultContact = {
    email: "info@university.com",
    phone: "+380955555555",
};
class UniversityError extends Error {
    constructor(message) {
        super(message);
        this.name = "UniversityError";
    }
}
class University {
    constructor(name) {
        this.courses = [];
        this.groups = [];
        this.people = [];
        this.name = name;
    }
    addCourse(course) {
        this.courses.push(course);
    }
    addGroup(group) {
        this.groups.push(group);
    }
    addPerson(person) {
        this.people.push(person);
    }
    findGroupByCourse(course) {
        return this.groups.find((group) => group.course === course);
    }
    getAllPeopleByRole(role) {
        switch (role) {
            case "student":
                return this.people.filter((person) => person.role === "student");
            case "teacher":
                return this.people.filter((person) => person.role === "teacher");
            default:
                return this.assertNeverRole(role);
        }
    }
    assertNeverRole(role) {
        throw new Error(`Unhandled role: ${role}`);
    }
}
class Course {
    constructor(name, credits, discipline) {
        this.name = name;
        this.credits = credits;
        this.discipline = discipline;
    }
}
class Group {
    constructor(name, course, teacher) {
        this.students = [];
        this.name = name;
        this.course = course;
        this.teacher = teacher;
    }
    addStudent(student) {
        if (this.students.includes(student)) {
            throw new UniversityError("Student is already in the group");
        }
        this.students.push(student);
    }
    removeStudentById(id) {
        const index = this.students.findIndex((student) => student.id === id);
        if (!~index) {
            throw new UniversityError("Student not found in group");
        }
        this.students.splice(index, 1);
    }
    getAverageGroupScore() {
        if (this.students.length) {
            return 0;
        }
        const totalScore = this.students.reduce((sum, student) => sum + student.getAverageScore(), 0);
        return totalScore / this.students.length;
    }
    getStudents() {
        return [...this.students];
    }
    getStudentById(ids) {
        if (Array.isArray(ids)) {
            return this.students.filter((student) => ids.includes(student.id));
        }
        return this.students.find((student) => student.id === ids) || undefined;
    }
}
class Person {
    constructor(info, role) {
        const { firstName, lastName, birthDay, gender, email, phone } = info;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDay = birthDay;
        this.id = Person.nextId++;
        this.gender = gender;
        this.contactInfo = { email, phone };
        this.role = role;
    }
    get fullName() {
        return `${this.lastName} ${this.firstName}`;
    }
    get age() {
        const today = new Date();
        let age = today.getFullYear() - this.birthDay.getFullYear();
        const monthDiff = today.getMonth() - this.birthDay.getMonth();
        if (monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < this.birthDay.getDate())) {
            age--;
        }
        return age;
    }
}
Person.nextId = 1;
class Teacher extends Person {
    constructor(info, specializations = []) {
        super(info, "teacher");
        this.specializations = [];
        this.courses = [];
        this.specializations = specializations;
    }
    assignCourse(course) {
        this.courses.push(course);
    }
    removeCourse(courseName) {
        this.courses = this.courses.filter((course) => course.name !== courseName);
    }
    getCourses() {
        return [...this.courses];
    }
}
class Student extends Person {
    constructor(info) {
        super(info, "student");
        this.academicPerformance = {
            totalCredits: 0,
            gpa: 0,
        };
        this.enrolledCourses = [];
        this.status = "active";
    }
    enrollCourse(course) {
        if (this.status !== "active") {
            throw new UniversityError("Cannot enroll: Student is not in active status");
        }
        this.enrolledCourses.push(course);
        this.academicPerformance.totalCredits += course.credits;
    }
    getAverageScore() {
        return this.academicPerformance.gpa;
    }
    updateAcademicStatus(newStatus) {
        this.status = newStatus;
    }
    getEnrolledCourses() {
        return [...this.enrolledCourses];
    }
}
