import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, ListGroup, Table } from "react-bootstrap";
const { gql, useQuery, useMutation } = require("@apollo/client");

const GET_COURSES= gql`
  query GetCourses {
    courses {     
      courseCode
            courseName
    }
  }
`;

const ShowAllCourse=() =>{
  const [data, setData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
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
      setData(data.courses);
      setShowLoading(false);
    },
  });

  return (
    <div className="container py-5">
      {showLoading && <Spinner animation="border" role="status"></Spinner>}

      <div className="row">
        <div className="col-md-12 order-md-1">
          <h2 className="mb-3">All Courses</h2>
          <div className="row py-3">
            {data.length > 0 ? (
              <ListGroup>
                <Table>
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Course Code</th>
                      <th scope="col">Course Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => (
                      <tr key={idx} scope="row">
                        <td>{idx + 1}</td>
                        <td>{item.courseCode} </td>
                        <td>{item.courseName} </td>
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
}
export default ShowAllCourse;
