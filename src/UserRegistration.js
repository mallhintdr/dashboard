import React, { useState } from 'react';
import { Form, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // In case future redirection is needed
import { getCurrentDate, subscriptionOptions } from './userUtils'; // Import utilities
import './styles/global.css';
import './styles/form.css';



const UserRegistration = () => {
  const [formData, setFormData] = useState({
    userName: '',
    userId: '',
    password: '',
    tehsil: '',
    mobileNumber: '',
    mauzaList: '',
    startDate: getCurrentDate(), // Use the centralized current date function
    subscriptionType: 'Trial',
    userType: 'user', // Default to 'user'
  });

  const [message, setMessage] = useState(null); // Store success or error message
  const navigate = useNavigate(); // Use navigate if needed in the future

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', {
        ...formData,
        mauzaList: formData.mauzaList.split(',').map((m) => m.trim()),
      });

      setMessage({
        type: 'success',
        text: `User "${formData.userName}" registered successfully!`,
      });

      // Optionally reset the form here
      // Reset form to initial state after registration
      setFormData({
        userName: '',
        userId: '',
        password: '',
        tehsil: '',
        mobileNumber: '',
        mauzaList: '',
        startDate: getCurrentDate(),
        subscriptionType: 'Trial',
        userType: 'user', // Reset user type to default
      });
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data.error || 'Registration failed',
      });
    }
  };

  const handleCancel = () => {
    // Reset form using the centralized getCurrentDate function
    setFormData({
      userName: '',
      userId: '',
      password: '',
      tehsil: '',
      mobileNumber: '',
      mauzaList: '',
      startDate: getCurrentDate(),
      subscriptionType: 'Trial',
      userType: 'user', // Reset user type to default
    });
    setMessage(null); // Clear any message
  };

  return (
    <Container className="registration-container">
      <Row className="justify-content-center align-items-center">
        <Col md={8} lg={6}>
          <Card className="p-4 shadow">
            <h3 className="text-center mb-4">User Registration</h3>
            {message && <Alert variant={message.type}>{message.text}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder="Enter user name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>User ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      placeholder="Enter user ID"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tehsil</Form.Label>
                    <Form.Control
                      type="text"
                      name="tehsil"
                      value={formData.tehsil}
                      onChange={handleChange}
                      placeholder="Enter tehsil"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mauza List (comma-separated)</Form.Label>
                    <Form.Control
                      type="text"
                      name="mauzaList"
                      value={formData.mauzaList}
                      onChange={handleChange}
                      placeholder="Enter mauza list"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Subscription Type</Form.Label>
                    <Form.Select
                      name="subscriptionType"
                      value={formData.subscriptionType}
                      onChange={handleChange}
                    >
                      {subscriptionOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.value}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>User Type</Form.Label>
                    <Form.Select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" type="submit" className="w-100 mb-2">
                Register
              </Button>
              <Button variant="secondary" onClick={handleCancel} className="w-100">
                Cancel
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserRegistration;
