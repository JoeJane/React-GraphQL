import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sectionOptions, semesterOptions } from "../constants";
const { gql, useQuery, useMutation } = require("@apollo/client");

const GET_STUDENTS_COURSES = gql`
  query GetStudentsCourse($id: String!) {
    studentCourse(id: $id) {
      _id
      courseId {
        courseCode
        courseName
      }
      semester
      section
    }
  }
`;

const UPDATE_STUDENT_COURSE = gql`
  mutation UpdateStudentCourse($id: String!, $section: String!, $semester: String!) {
    updateStudentCourse(id: $id, section: $section, semester: $semester) {
      _id
    }
  }
`;


const EditCourse=()=> {
  console.log("sectionOptions", sectionOptions);
  const { studentcoursecode } = useParams();
  let navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const [data, setData] = useState({});
  const dataFetchedRef = useRef(false);

  const [listError, setListError] = useState(false);

  const {
    loading: loadingCourses,
    error: errorCourses,
    data: dataStudents,
    refetch,
  } = useQuery(GET_STUDENTS_COURSES, {
    variables: { id: studentcoursecode },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log("Oncompleted", data);
      setData(data.studentCourse);
    },
  });
  
  const [updateCourse, { updatedata, loading, error }] = useMutation(UPDATE_STUDENT_COURSE,{
    onCompleted: () => {
      console.log("Oncompleted update");
      navigate("/showCourses");
    }
});
  const updateCourseClick = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    const id = data._id;
    const updatedCourse = {
      section: data.section,
      semester: data.semester,
    };
    updateCourse({ variables: { id, ...updatedCourse } });
    console.log("updatedCourse to update:", updatedCourse);
  
  };

  const onChange = (e) => {
    e.persist();
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const showCourses = () => {
    navigate("/showCourses");
  };
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-md-6 order-md-1 py-5">
          <h2 className="mb-3"> Edit course </h2>
          {showLoading && (
            <Spinner animation="border" role="status">
            </Spinner>
          )}

          <Form onSubmit={updateCourseClick} className="needs-validation">
            <div className="row">
              <div className="mb-3">
                <label htmlFor="course">Course Code</label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    name="courseCode"
                    id="courseCode"
                    placeholder="Enter course code"
                    defaultValue={data.courseId && data.courseId.courseCode}
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="course">Course Name</label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    name="courseName"
                    id="courseName"
                    placeholder="Enter courseName"
                    defaultValue={data.courseId && data.courseId.courseName}
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="course">Section</label>
                <div className="input-group">
                  <Form.Select
                    onChange={onChange}
                    name="section"
                    value={data.section}
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
                    className="form-select"
                    onChange={onChange}
                    name="semester"
                    value={data.semester}
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
                <Button
                  type="submit"
                  className="btn btn-dark btn-lg me-3"
                  id="edit"
                >
                  Update Course
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

export default EditCourse;
