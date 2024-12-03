import React, { useEffect, useState } from 'react';
import { Table, Alert, Button, ButtonGroup, Spinner, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './styles/global.css';
import './styles/table.css';
import './styles/modal.css';
import './styles/profile.css';

import UserEditForm from './UserEditForm';
import { calculateEndDate, calculateDaysRemaining, calculateStatus } from './userUtils';
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [editUserId, setEditUserId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({});
  
  const { logout } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortConfig, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      const updatedUsers = response.data.map((user) => ({
        ...user,
        daysRemaining: calculateDaysRemaining(user.startDate, user.subscriptionType),
        status: calculateStatus(calculateEndDate(user.startDate, user.subscriptionType)),
        endDate: calculateEndDate(user.startDate, user.subscriptionType),
      }));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load user data.');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...users];

    // Apply Filters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        result = result.filter((user) =>
          String(user[key]).toLowerCase().includes(filters[key].toLowerCase())
        );
      }
    });

    // Apply Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(result);
  };

  // Pagination Calculations
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFilterChange = (e, key) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleEdit = (userId) => {
    setEditUserId(userId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditUserId(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/users/${userToDelete}`);
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Failed to delete user.');
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User List</h2>

      <Table striped bordered hover responsive>
        <thead className="table-header">
          <tr>
            {[
              'userName',
              'userId',
              'mobileNumber',
              'tehsil',
              'mauzaList',
              'subscriptionType',
              'startDate',
              'endDate',
              'daysRemaining',
              'status',
              'userType',
            ].map((key) => (
              <th key={key} onClick={() => handleSort(key)} style={{ cursor: 'pointer' }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
                {sortConfig.key === key ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}
              </th>
            ))}
            <th>Actions</th>
          </tr>
          <tr>
            {[
              'userName',
              'userId',
              'mobileNumber',
              'tehsil',
              'mauzaList',
              'subscriptionType',
              'startDate',
              'endDate',
              'daysRemaining',
              'status',
              'userType',
            ].map((key) => (
              <th key={`filter-${key}`}>
                <Form.Control
                  type="text"
                  placeholder={`Filter ${key}`}
                  value={filters[key] || ''}
                  onChange={(e) => handleFilterChange(e, key)}
                />
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.userId}>
              <td>{user.userName}</td>
              <td>{user.userId}</td>
              <td>{user.mobileNumber}</td>
              <td>{user.tehsil}</td>
              <td>{user.mauzaList.join(', ')}</td>
              <td>{user.subscriptionType}</td>
              <td>{new Date(user.startDate).toLocaleDateString()}</td>
              <td>{new Date(user.endDate).toLocaleDateString()}</td>
              <td>{user.daysRemaining}</td>
              <td>{user.status}</td>
              <td>{user.userType}</td>
              <td>
                <ButtonGroup size="sm">
                  <Button variant="warning" onClick={() => handleEdit(user.userId)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setUserToDelete(user.userId);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                  <Button variant="secondary" onClick={logout}>
                    Logout
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <div className="pagination-controls d-flex justify-content-center align-items-center mt-3">
        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="me-2"
        >
          <FaAngleDoubleLeft />
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="me-2"
        >
          <FaAngleLeft />
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ms-2"
        >
          <FaAngleRight />
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="ms-2"
        >
          <FaAngleDoubleRight />
        </Button>
      </div>

      {/* Edit User Modal */}
      {editUserId && (
        <UserEditForm
          userId={editUserId}
          show={showEditModal}
          handleClose={handleCloseEditModal}
          refreshUsers={fetchUsers}
        />
      )}

      {/* Confirm Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserList;
