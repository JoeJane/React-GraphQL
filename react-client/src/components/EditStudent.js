import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
const { gql, useQuery, useMutation } = require("@apollo/client");

const GET_STUDENT = gql`
  query GetStudent($id: String!) {
    student(id: $id) {
      _id
      studentNumber
      firstName
      lastName
      address
      city
      phoneNumber
      email
      program
      strongestTechnicalSkill
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $id: String!
    $studentNumber: String!
    $firstName: String!
    $lastName: String!
    $address: String!
    $city: String!
    $phoneNumber: String!
    $email: String!
    $program: String!
    $strongestTechnicalSkill: String!
  ) {
    updateStudent(
      id: $id
      studentNumber: $studentNumber
      firstName: $firstName
      lastName: $lastName
      address: $address
      city: $city
      phoneNumber: $phoneNumber
      email: $email
      program: $program
      strongestTechnicalSkill: $strongestTechnicalSkill
    ) {
      _id
    }
  }
`;

const EditStudent = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const [data, setData] = useState([]);
  const [listError, setListError] = useState(false);
const [updateStudent, { updatedata, loading, error }] = useMutation(UPDATE_STUDENT,{
    onCompleted: () => {
      console.log("Oncompleted update");
      navigate("/showStudents");
    }
});
  const {
    loading: loadingCourses,
    error: errorCourses,
    data: dataStudents,
    refetch,
  } = useQuery(GET_STUDENT, {
    variables: { id: id },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log("Oncompleted", data);
      setData(data.student);
    },
  });

  const updateStudentClick = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    console.log(id);    
    updateStudent({ variables: {...data,id} });
    
  };

  const onChange = (e) => {
    e.persist();
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const showStudents = () => {
    navigate("/showStudents");
  };

  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-md-6 order-md-1 py-5">
          <h2 className="mb-3"> Update Student</h2>
          {showLoading && <Spinner animation="border" role="status"></Spinner>}

          <Form onSubmit={updateStudentClick} className="needs-validation">
            <div className="row">
              <div className="mb-3">
                <label htmlFor="course">Student Number</label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    name="studentNumber"
                    id="studentNumber"
                    defaultValue={data.studentNumber}
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="course">FirstName</label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    name="firstName"
                    id="firstName"
                    defaultValue={data.firstName}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="course">LastName</label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    name="lastName"
                    id="lastName"
                    defaultValue={data.lastName}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="course">Address</label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    name="address"
                    id="address"
                    defaultValue={data.address}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="course">City</label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    name="city"
                    id="city"
                    defaultValue={data.city}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="course">PhoneNumber</label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    defaultValue={data.phoneNumber}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="course">Email</label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    name="email"
                    id="email"
                    defaultValue={data.email}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="course">Program</label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    name="program"
                    id="program"
                    defaultValue={data.program}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="course">Strongest Technical Skill</label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    name="strongestTechnicalSkill"
                    id="strongestTechnicalSkill"
                    defaultValue={data.strongestTechnicalSkill}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <Button
                  variant="dark"
                  type="submit"
                  className="btn btn-dark btn-lg me-3"
                >
                  update{" "}
                </Button>

                <Button
                  variant="outline-secondary"
                  size="lg"
                  className="btn-lg "
                  type="submit"
                  onClick={() => {
                    showStudents();
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
};
// withRouter will pass updated match, location, and history props
// to the wrapped component whenever it renders.
export default EditStudent;
