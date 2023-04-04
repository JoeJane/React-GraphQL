import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sectionOptions, semesterOptions } from "../constants";
import AuthService from "../services/auth.service";

const { gql, useQuery, useMutation } = require("@apollo/client");

const GET_COURSES= gql`
  query GetCourses {
    courses {     
      _id
            courseName
    }
  }
`;

const ADD_STUDENT_COURSE = gql`
  mutation AddStudentCourse($studentId:String!,$courseId: String!, $section: String!, $semester: String!) {
    addStudentCourse(studentId:$studentId,courseId: $courseId, section: $section, semester: $semester) {
      _id
    }
  }
`;

const CreateCourse=(props)=> {
  let navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  console.log("user>>", user.id);

  const username = props.screen;
  console.log("props.screen", props.screen);
  const [courses, setCourses] = useState([]);
  const {
    loading: loadingCourses,
    error: errorCourses,
    data: dataStudents,
    refetch,
  } = useQuery(GET_COURSES, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log("Oncompleted", data.courses);
      setCourses(data.courses);
    },
  });
  const [selectedCourse, setSelectedCourse] = useState({
    courseId: "",
    sectionId: "",
    semesterId: "",
    id: "",
  });
  const [showLoading, setShowLoading] = useState(false);
  const [addStudentCourse, { data, loading, error }] = useMutation(ADD_STUDENT_COURSE);


  const saveCourse = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    console.log("selectedCourse", selectedCourse);
    if(selectedCourse.courseId === "" || selectedCourse.sectionId === "" || selectedCourse.semesterId === "" ){
      selectedCourse.courseId = courses[0]._id;
      selectedCourse.sectionId = sectionOptions[0].value;
      selectedCourse.semesterId = semesterOptions[0].value;
    }
    addStudentCourse({
      variables: {
        studentId:user.id,
        courseId: selectedCourse.courseId,
        section: selectedCourse.sectionId,
        semester: selectedCourse.semesterId,
      },
      onCompleted: (data) => {
       
       setShowLoading(false);
       navigate("/showCourses");
      }
    });


  };

  const onChange = (e) => {
    e.persist();
    setSelectedCourse({ ...selectedCourse, [e.target.name]: e.target.value });   
  };

  const showCourses = () => {
    navigate("/showCourses");
  };

  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-md-6 order-md-1 py-5">
          <h2 className="mb-3"> Add a course {username} </h2>
          {showLoading && (
            <Spinner animation="border" role="status">
            </Spinner>
          )}

          <Form onSubmit={saveCourse} className="needs-validation">
            <div className="row">
              <div className="mb-3">
                <label htmlFor="course">Course</label>
                <div className="input-group">
                  <Form.Select
                    onChange={onChange}
                    name="courseId"
                    className="form-select"
                  >
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.courseName}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="course">Section</label>
                <div className="input-group">
                  <Form.Select
                    onChange={onChange}
                    name="sectionId"
                    className="form-select"
                  >
                    {sectionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="course">Semester</label>
                <div className="input-group">
                  <Form.Select
                    onChange={onChange}
                    name="semesterId"
                    className="form-select"
                  >
                    {semesterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>

              <div className="mb-3">
                <Button type="submit" className="btn btn-dark btn-lg me-3">
                  Add Course
                </Button>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  className="btn-lg "
                  type="submit"
                  onClick={() => {
                    showCourses();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default CreateCourse;
