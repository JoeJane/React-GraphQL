import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../services/auth.service";

const { gql, useQuery, useMutation } = require("@apollo/client");

const GET_STUDENTS_COURSES = gql`
  query GetStudentsCourses($id: String!) {
    studentCourses(id: $id) {
      _id
      courseId {
        _id
        courseCode
        courseName
      }
      semester
      section
    }
  }
`;
const DELETE_STUDENT_COURSE = gql`
  mutation DeleteStudentCourse($id: String!) {
    deleteStudentCourse(id: $id) {
      _id
    }
  }
`;

const ShowCourse = (props) => {
  let navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  console.log("user>>", user.id);
  const [data, setData] = useState([]);
  const [deletStudentCourse, { data1, loading, error }] = useMutation(DELETE_STUDENT_COURSE);

  const [showLoading, setShowLoading] = useState(false);
  const {
    loading: loadingCourses,
    error: errorCourses,
    data: dataStudents,
    refetch,
  } = useQuery(GET_STUDENTS_COURSES, {
    variables: { id: user.id },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log("Oncompleted", data);
      setData(data.studentCourses);
    },
  });

  const editCourse = (coursecode) => {
    navigate("/editcourse/" + coursecode.trim());
  };

  const showClass = async (courseID, section, semester) => {
    navigate("/showclasslist/" + courseID + "/" + section + "/" + semester);
  };

  const deleteCourseClick = async (coursecode) => {
    //setShowLoading(true);
    deletStudentCourse({ variables: { id: coursecode } });
    refetch();
  };

  const addCourse = () => {
    navigate("/createCourse");
  };
  return (
    <div className="container">
      {showLoading && <Spinner animation="border" role="status"></Spinner>}
      <div className="py-5 text-right">
        <Button
          type="submit"
          variant="dark"
          onClick={() => {
            addCourse();
          }}
        >
          Add Course
        </Button>
      </div>
      <div className="row">
        <div className="col-md-12 order-md-1">
          <h2 className="mb-3">Your Courses</h2>
          <div className="row">
            {data.length > 0 ? (
              <ListGroup>
                <Table>
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Course Code</th>
                      <th scope="col">Course Name</th>
                      <th scope="col">Section</th>
                      <th scope="col">Semester</th>
                      <th scope="col" colSpan={3}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => (
                      <tr key={idx} scope="row">
                        <td>{idx + 1}</td>
                        <td>{item.courseId.courseCode} </td>
                        <td>{item.courseId.courseName} </td>
                        <td>{item.section}</td>
                        <td>{item.semester}</td>

                        <td>
                          <Button
                            type="submit"
                            variant="outline-dark"
                            onClick={() => {
                              editCourse(item._id);
                            }}
                          >
                            Update
                          </Button>
                        </td>
                        <td>
                          <Button
                            type="button"
                            variant="outline-dark"
                            onClick={() => {
                              showClass(
                                item.courseId._id,
                                item.section,
                                item.semester
                              );
                            }}
                          >
                            Show Class
                          </Button>
                        </td>
                        <td>
                          <Button
                            type="button"
                            variant="outline-danger"
                            onClick={() => {
                              deleteCourseClick(item._id);
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ListGroup>
            ) : (
              <p>No courses available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
// withRouter will pass updated match, location, and history props
// to the wrapped component whenever it renders.
export default ShowCourse;
