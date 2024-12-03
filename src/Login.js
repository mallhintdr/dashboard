// Login.js
import React, { useState } from 'react';
import { Form, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = ({ triggerWarningModal }) => {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [message, setMessage] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await login(formData);
      setMessage({ type: 'success', text: 'Login successful!' });
      navigate('/');
    } catch (error) {
      if (error.type === 'subscriptionExpired') {
        // Call the centralized modal trigger in App.js
        triggerWarningModal({
          title: 'Subscription Expiration Warning',
          userName: error.details.userName || 'Unknown',
          startDate: error.details.startDate ? new Date(error.details.startDate).toLocaleDateString() : 'N/A',
          endDate: error.details.endDate ? new Date(error.details.endDate).toLocaleDateString() : 'N/A',
          daysRemaining: error.details.daysRemaining || 0,
          message: 'Your subscription has expired. Please contact support to renew!',
        });
      } else {
        setMessage({ type: 'danger', text: 'Invalid credentials or login failed.' });
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100">
        <Col md={6} className="mx-auto">
          <Card className="p-4 shadow">
            <h3 className="text-center mb-4">Login</h3>
            {message && <Alert variant={message.type}>{message.text}</Alert>}
            <Form onSubmit={handleSubmit}>
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

              <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
