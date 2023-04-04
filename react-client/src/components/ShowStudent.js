import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
const { gql, useQuery, useMutation } = require("@apollo/client")


const GET_STUDENTS = gql`
  query GetStudents {
    students {      
      _id
      studentNumber      
      firstName
      lastName      
      email
      program
      address
      phoneNumber
    }
  }`;

const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: String!) {
    deleteStudent(id: $id) {
      _id
    }
  }
`;
const ShowStudent=()=> {
  let navigate = useNavigate();
  const [studentData, setData] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [deleteStudent, { data, loading, error }] = useMutation(DELETE_STUDENT);


  const {		loading: loadingCourses,		error: errorCourses,		data: dataStudents,refetch 
	} = useQuery(GET_STUDENTS, {
		fetchPolicy: "network-only",
		onCompleted: (data) => {
			console.log("Oncompleted",data)
			setData(data.students)
		}
	})

  const editStudent = (id) => {
    navigate("/editstudent/" + id);
  };

  const deleteStudentClick = async (_id) => {
    setShowLoading(false);
    console.log(_id);
    deleteStudent({ variables: { id: _id } });
    refetch();
  };

  const addStudent = () => {
    navigate("/createStudent");
  };
  const filteredData =
  studentData.filter && studentData.filter((item) => item.isAdmin != true);

  return (
    <div className="container">
      {showLoading && <Spinner animation="border" role="status"></Spinner>}
      <div className="py-5 text-right">
        <Button
          type="submit"
          variant="dark"
          onClick={() => {
            addStudent();
          }}
        >
          Add Student
        </Button>
      </div>

      <div className="row">
        <div className="col-md-12 order-md-1">
          <h2 className="mb-3">All Users</h2>
          <div className="row">
            {filteredData.length > 0 ? (
              <ListGroup>
                <Table>
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Username</th>
                      <th scope="col">first Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Program</th>
                      <th scope="col">Address</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col" colSpan={2}>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{item.studentNumber} </td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.email}</td>
                        <td>{item.program}</td>
                        <td>{item.address}</td>
                        <td>{item.phoneNumber} </td>

                        <td>
                          <Button
                            type="submit"
                            variant="outline-dark"
                            onClick={() => {
                              editStudent(item._id);
                            }}
                          >
                            Update
                          </Button>
                        </td>
                        <td>
                          <Button
                            type="button"
                            variant="outline-danger"
                            onClick={() => {
                              deleteStudentClick(item._id);
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
              <p>No students available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// withRouter will pass updated match, location, and history props
// to the wrapped component whenever it renders.
export default ShowStudent;
