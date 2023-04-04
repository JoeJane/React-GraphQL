var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLNonNull = require("graphql").GraphQLNonNull;
var GraphQLID = require("graphql").GraphQLID;
var GraphQLString = require("graphql").GraphQLString;
const { GraphQLBoolean } = require("graphql");

var CourseModel = require("../app/models/course.server.model");
var StudentCourseModel = require("../app/models/studentcourse.server.model");
var StudentModel = require("../app/models/student.server.model");

const studentType = new GraphQLObjectType({
  name: "student",
  fields: function () {
    return {
      _id: {
        type: GraphQLString,
      },
      studentNumber: {
        type: GraphQLString,
      },
      password: {
        type: GraphQLString,
      },
      firstName: {
        type: GraphQLString,
      },
      lastName: {
        type: GraphQLString,
      },
      address: {
        type: GraphQLString,
      },
      city: {
        type: GraphQLString,
      },
      phoneNumber: {
        type: GraphQLString,
      },
      email: {
        type: GraphQLString,
      },
      program: {
        type: GraphQLString,
      },
      strongestTechnicalSkill: {
        type: GraphQLString,
      },
      isAdmin: {
        type: GraphQLBoolean,
      },
    };
  },
});

const courseType = new GraphQLObjectType({
  name: "course",
  fields: function () {
    return {
      _id: {
        type: GraphQLString,
      },
      courseCode: {
        type: GraphQLString,
      },
      courseName: {
        type: GraphQLString,
      },
    };
  },
});

const studentCourseType = new GraphQLObjectType({
  name: "studentCourse",
  fields: function () {
    return {
      _id: {
        type: GraphQLString,
      },
      studentId: {
        type: studentType,
      },
      courseId: {
        type: courseType,
      },
      section: {
        type: GraphQLString,
      },
      semester: {
        type: GraphQLString,
      },
    };
  },
});

const queryType = new GraphQLObjectType({
  name: "Query",
  fields: function () {
    return {
      students: {
        type: new GraphQLList(studentType),
        resolve: function () {
          const students = StudentModel.find();
          console.log(students);
          if (!students) {
            throw new Error("Error");
          }
          return students;
        },
      },
      student: {
        type: studentType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const studentDetails = StudentModel.findById(params.id).exec();
          if (!studentDetails) {
            throw new Error("Error");
          }
          return studentDetails;
        },
      },
      courses: {
        type: new GraphQLList(courseType),
        resolve: function () {
          const courses = CourseModel.find().exec();
          if (!courses) {
            throw new Error("Error");
          }
          return courses;
        },
      },
      course: {
        type: courseType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const courseDetails = CourseModel.findById(params.id).exec();
          if (!courseDetails) {
            throw new Error("Error");
          }
          return courseDetails;
        },
      },
      studentCourses: {
        type: new GraphQLList(studentCourseType),
        args: {
          id: {
            name: "_id",
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const studentCourses = StudentCourseModel.find({
            studentId: params.id,
          }).populate("courseId");
          console.log(studentCourses.courseId);
          if (!studentCourses) {
            throw new Error("Error");
          }
          return studentCourses;
        },
      },
      studentCourse: {
        type: studentCourseType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const studentCourseDetails = StudentCourseModel.findById(
            params.id
          ).populate("courseId");
          if (!studentCourseDetails) {
            throw new Error("Error");
          }
          return studentCourseDetails;
        },
      },
      classList: {
        type: new GraphQLList(studentCourseType),
        args: {
          courseId: {
            name: "courseId",
            type: GraphQLString,
          },
          section: {
            name: "section",
            type: GraphQLString,
          },
          semester: {
            name: "semester",
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const classList = StudentCourseModel.find({
            courseId: params.courseId,
            section: params.section,
            semester: params.semester,
          })
            .populate("studentId")
            .populate("courseId");

          if (!classList) {
            throw new Error("Error");
          }
          return classList;
        },
      },
    };
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function () {
    return {
      addStudent: {
        type: studentType,
        args: {
          studentNumber: {
            type: new GraphQLNonNull(GraphQLString),
          },
          password: {
            type: new GraphQLNonNull(GraphQLString),
          },
          firstName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          address: {
            type: new GraphQLNonNull(GraphQLString),
          },
          city: {
            type: new GraphQLNonNull(GraphQLString),
          },
          phoneNumber: {
            type: new GraphQLNonNull(GraphQLString),
          },
          email: {
            type: new GraphQLNonNull(GraphQLString),
          },
          program: {
            type: new GraphQLNonNull(GraphQLString),
          },
          strongestTechnicalSkill: {
            type: new GraphQLNonNull(GraphQLString),
          },
          isAdmin: {
            type: new GraphQLNonNull(GraphQLBoolean),
          },
        },
        resolve: function (root, params) {
          console.log(params);
          const studentModel = new StudentModel(params);
          const newStudent = studentModel.save();
          if (!newStudent) {
            throw new Error("Error");
          }
          return newStudent;
        },
      },
      updateStudent: {
        type: studentType,
        args: {
          id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLString),
          },
          studentNumber: {
            type: new GraphQLNonNull(GraphQLString),
          },

          firstName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString),
          },
          address: {
            type: new GraphQLNonNull(GraphQLString),
          },
          city: {
            type: new GraphQLNonNull(GraphQLString),
          },
          phoneNumber: {
            type: new GraphQLNonNull(GraphQLString),
          },
          email: {
            type: new GraphQLNonNull(GraphQLString),
          },
          program: {
            type: new GraphQLNonNull(GraphQLString),
          },
          strongestTechnicalSkill: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: async (parent, args) => {
          try {
            const updatedstudent = await StudentModel.findByIdAndUpdate(
              args.id,
              {
                studentNumber: args.studentNumber,
                firstName: args.firstName,
                lastName: args.lastName,
                address: args.address,
                city: args.city,
                phoneNumber: args.phoneNumber,
                email: args.email,
                program: args.program,
                strongestTechnicalSkill: args.strongestTechnicalSkill,
              },
              { new: true }
            );
            return updatedstudent;
          } catch (err) {
            console.log(err);
            throw new Error("Error updating student");
          }
        },
      },
      deleteStudent: {
        type: studentType,
        args: {
          id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: async (parent, args) => {
          try {
            const deletedStudent = await StudentModel.findByIdAndRemove(
              args.id
            );
            if (!deletedStudent) {
              throw new Error("Student not found");
            }
            return deletedStudent;
          } catch (err) {
            throw new Error("Error deleting student");
          }
        },
      },
      addCourse: {
        type: courseType,
        args: {
          courseCode: {
            type: new GraphQLNonNull(GraphQLString),
          },
          courseName: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: function (root, params) {
          const courseModel = new CourseModel(params);
          const newCourse = courseModel.save();
          if (!newCourse) {
            throw new Error("Error");
          }
          return newCourse;
        },
      },
      updateCourse: {
        type: courseType,
        args: {
          id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLString),
          },
          courseCode: {
            type: new GraphQLNonNull(GraphQLString),
          },
          courseName: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: function (parent, args) {
          try {
            return CourseModel.findByIdAndUpdate(
              args.id,
              {
                courseCode: args.courseCode,
                courseName: args.courseName,
              },
              { new: true }
            );
          } catch (err) {
            console.log(err);
            throw new Error("Error updating course");
          }
        },
        deleteCourse: {
          type: courseType,
          args: {
            id: {
              name: "id",
              type: new GraphQLNonNull(GraphQLString),
            },
          },
          resolve: async (parent, args) => {
            try {
              const deletedCourse = await CourseModel.findByIdAndRemove(
                args.id
              );
              if (!deletedCourse) {
                throw new Error("Course not found");
              }
              return deletedCourse;
            } catch (err) {
              throw new Error("Error deleting course");
            }
          },
        },
      },
      addStudentCourse: {
        type: studentCourseType,
        args: {
          studentId: {
            type: new GraphQLNonNull(GraphQLString),
          },
          courseId: {
            type: new GraphQLNonNull(GraphQLString),
          },
          semester: {
            type: new GraphQLNonNull(GraphQLString),
          },
          section: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: function (root, params) {
          const studentCourseModel = new StudentCourseModel(params);
          const newStudentCourse = studentCourseModel.save();
          if (!newStudentCourse) {
            throw new Error("Error");
          }
          return newStudentCourse;
        },
      },
      updateStudentCourse: {
        type: studentCourseType,
        args: {
          id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLString),
          },
          semester: {
            type: new GraphQLNonNull(GraphQLString),
          },
          section: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: function (parent, args) {
          try {
            return StudentCourseModel.findByIdAndUpdate(
              args.id,
              {
                semester: args.semester,
                section: args.section,
              },
              { new: true }
            );
          } catch (err) {
            console.log(err);
            throw new Error("Error updating student course");
          }
        },
      },
      deleteStudentCourse: {
        type: studentCourseType,
        args: {
          id: {
            name: "id",
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: async (parent, args) => {
          try {
            const deletedStudentCourse =
              await StudentCourseModel.findByIdAndRemove(args.id);
            if (!deletedStudentCourse) {
              throw new Error("Student Course not found");
            }
            return deletedStudentCourse;
          } catch (err) {
            throw new Error("Error deleting student course");
          }
        },
      },
    };
  },
});
module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
