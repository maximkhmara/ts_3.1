type Gender = "male" | "female" | "other";
type Role = "student" | "teacher";
type ContactInfo = {
  email: string;
  phone: string;
};

type AcademicPerformance = {
  totalCredits: number;
  gpa: number;
};

type PersonInfo = {
  firstName: string;
  lastName: string;
  birthDay: Date;
  gender: Gender;
} & ContactInfo; 

const defaultContact = {
  email: "info@university.com",
  phone: "+380955555555",
};

class UniversityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UniversityError";
  }
}

class University {
  name: string;
  courses: Course[] = [];
  groups: Group[] = [];
  people: Person[] = [];

  constructor(name: string) {
    this.name = name;
  }

  addCourse(course: Course): void {
    this.courses.push(course);
  }

  addGroup(group: Group): void {
    this.groups.push(group);
  }

  addPerson(person: Person): void {
    this.people.push(person);
  }

  findGroupByCourse(course: Course): Group | undefined {
    return this.groups.find((group) => group.course === course);
  }

  getAllPeopleByRole(role: Role): Person[] {
    switch (role) {
      case "student":
        return this.people.filter((person) => person.role === "student");
      case "teacher":
        return this.people.filter((person) => person.role === "teacher");
      default:
        return this.assertNeverRole(role);
    }
  }

  assertNeverRole(role: never): never {
    throw new Error(`Unhandled role: ${role}`);
  }
}

class Course {
  name: string;
  credits: number;
  discipline: string;

  constructor(name: string, credits: number, discipline: string) {
    this.name = name;
    this.credits = credits;
    this.discipline = discipline;
  }
}

class Group {
  name: string;
  course: Course;
  teacher: Teacher;
  students: Student[] = [];

  constructor(name: string, course: Course, teacher: Teacher) {
    this.name = name;
    this.course = course;
    this.teacher = teacher;
  }

  addStudent(student: Student): void {
    if (this.students.includes(student)) {
      throw new UniversityError("Student is already in the group");
    }

    this.students.push(student);
  }

  removeStudentById(id: number): void {
    const index = this.students.findIndex((student) => student.id === id);

    if (!~index) {
      throw new UniversityError("Student not found in group");
    }

    this.students.splice(index, 1);
  }

  getAverageGroupScore(): number {
    if (this.students.length) {
      return 0;
    }

    const totalScore = this.students.reduce(
      (sum, student) => sum + student.getAverageScore(),
      0
    );

    return totalScore / this.students.length;
  }

  getStudents() {
    return [...this.students];
  }

  getStudentById(ids: number | number[]): Student | Student[] | undefined {
    if (Array.isArray(ids)) {
      return this.students.filter((student) => ids.includes(student.id));
    }
    return this.students.find((student) => student.id === ids) || undefined;
  }
}

class Person {
  static nextId = 1;

  firstName: string;
  lastName: string;
  birthDay: Date;
  id: number;
  gender: Gender;
  contactInfo: ContactInfo;
  role: Role;

  constructor(info: PersonInfo, role: Role) {
    const { firstName, lastName, birthDay, gender, email, phone } = info;

    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDay = birthDay;
    this.id = Person.nextId++;
    this.gender = gender;
    this.contactInfo = { email, phone };
    this.role = role;
  }

  get fullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }

  get age(): number {
    const today = new Date();
    let age = today.getFullYear() - this.birthDay.getFullYear();
    const monthDiff = today.getMonth() - this.birthDay.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < this.birthDay.getDate())
    ) {
      age--;
    }

    return age;
  }
}

class Teacher extends Person {
  specializations: string[] = [];
  courses: Course[] = [];

  constructor(info: PersonInfo, specializations: string[] = []) {
    super(info, "teacher");
    this.specializations = specializations;
  }

  assignCourse(course: Course): void {
    this.courses.push(course);
  }

  removeCourse(courseName: string): void {
    this.courses = this.courses.filter((course) => course.name !== courseName);
  }

  getCourses(): Course[] {
    return [...this.courses];
  }
}

class Student extends Person {
  academicPerformance: AcademicPerformance = {
    totalCredits: 0,
    gpa: 0,
  };
  enrolledCourses: Course[] = [];
  status;

  constructor(info: PersonInfo) {
    super(info, "student");
    this.status = "active";
  }

  enrollCourse(course: Course): void {
    if (this.status !== "active") {
      throw new UniversityError(
        "Cannot enroll: Student is not in active status"
      );
    }

    this.enrolledCourses.push(course);
    this.academicPerformance.totalCredits += course.credits;
  }

  getAverageScore(): number {
    return this.academicPerformance.gpa;
  }

  updateAcademicStatus(newStatus: "active" | "inactive"): void {
    this.status = newStatus;
  }

  getEnrolledCourses(): Course[] {
    return [...this.enrolledCourses];
  }
}
