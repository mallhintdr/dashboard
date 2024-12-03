import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, Modal } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './styles/global.css';
import './styles/form.css';
import './styles/modal.css';
import './styles/profile.css';


import { subscriptionOptions, calculateEndDate, calculateStatus } from './userUtils';

const UserEditForm = ({ userId, handleClose, refreshUsers }) => {
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState(null);
  const { loading } = useAuth();

  // Fetch user data and initialize form data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${userId}`);
        const user = response.data;

        // Validate and format dates, fallback to empty string if invalid
        const startDate = user.startDate ? new Date(user.startDate).toISOString().split('T')[0] : '';
        const endDate = startDate && user.subscriptionType ? calculateEndDate(startDate, user.subscriptionType) : '';
        const status = endDate ? calculateStatus(endDate) : 'Unknown';

        setFormData({
          userName: user.userName || '',
          userId: user.userId || '',
          password: '', // Leave empty to avoid rehashing if not modified
          tehsil: user.tehsil || '',
          mobileNumber: user.mobileNumber || '',
          mauzaList: user.mauzaList ? user.mauzaList.join(', ') : '',
          startDate,
          subscriptionType: user.subscriptionType || '',
          endDate,
          status,
        });
      } catch (error) {
        setMessage({ type: 'danger', text: 'Failed to load user data.' });
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedFormData = {
        ...prev,
        [name]: value,
      };

      if (name === 'subscriptionType' || name === 'startDate') {
        const validStartDate = updatedFormData.startDate || '';
        const validSubscriptionType = updatedFormData.subscriptionType || '';
        
        // Calculate endDate and status only if startDate and subscriptionType are valid
        if (validStartDate && validSubscriptionType) {
          const calculatedEndDate = calculateEndDate(validStartDate, validSubscriptionType);
          updatedFormData.endDate = calculatedEndDate || '';
          updatedFormData.status = calculatedEndDate ? calculateStatus(calculatedEndDate) : 'Unknown';
        }
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = { 
        ...formData, 
        mauzaList: formData.mauzaList.split(',').map(m => m.trim()) 
      };
      
      // Exclude password if it's empty to avoid rehashing
      if (!updateData.password || updateData.password.trim() === '') {
        delete updateData.password;
      }
      
      await axios.put(`http://localhost:5000/users/${userId}`, updateData);
      setMessage({ type: 'success', text: 'User updated successfully!' });
      refreshUsers();
      handleClose();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to update user.',
      });
    }
  };

  if (loading || !formData) {
    return <Alert variant="info">Loading user data...</Alert>;
  }

  return (
    <Modal show onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
                  disabled
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
                  placeholder="Leave empty to keep current password"
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
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mauza List</Form.Label>
                <Form.Control
                  type="text"
                  name="mauzaList"
                  value={formData.mauzaList}
                  onChange={handleChange}
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
                  <option value="">Select Subscription Type</option>
                  {subscriptionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="text"
                  name="endDate"
                  value={formData.endDate || ''}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  name="status"
                  value={formData.status || ''}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" className="me-2">
              Save Changes
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserEditForm;
