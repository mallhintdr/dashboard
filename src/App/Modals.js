// Modals.js
import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import ChangePasswordForm from '../ChangePasswordForm';
import { useAuth } from '../AuthContext';

const Modals = ({
  showWarningModal,
  setShowWarningModal,
  warningContent,
  showProfileModal,
  setShowProfileModal,
  showChangePassword,
  setShowChangePassword,
}) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Warning Modal */}
      <Modal show={showWarningModal} onHide={() => setShowWarningModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{warningContent?.title || 'Subscription Expiration Warning'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {warningContent ? (
            <div>
              <p><strong>User Name:</strong> {warningContent.userName}</p>
              <p><strong>Subscription Start Date:</strong> {warningContent.startDate}</p>
              <p><strong>Subscription End Date:</strong> {warningContent.endDate}</p>
              <p><strong>Days Remaining:</strong> {warningContent.daysRemaining}</p>
              <Alert variant="warning">{warningContent.message}</Alert>
            </div>
          ) : (
            <Alert variant="warning">Subscription details are unavailable.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowWarningModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user ? (
            <div className="profile-details">
              <p><strong>User Name:</strong> {user.userName}</p>
              <p><strong>User ID:</strong> {user.userId}</p>
              <p><strong>Tehsil:</strong> {user.tehsil}</p>
              <p><strong>Mobile Number:</strong> {user.mobileNumber}</p>
              <p><strong>Mauza List:</strong> {user.mauzaList ? user.mauzaList.join(', ') : 'No Mauza available'}</p>
              <p><strong>Start Date:</strong> {new Date(user.startDate).toLocaleDateString()}</p>
              <p><strong>Subscription Type:</strong> {user.subscriptionType}</p>
              <p><strong>End Date:</strong> {new Date(user.endDate).toLocaleDateString() || 'N/A'}</p>
              <p><strong>Status:</strong> {user.status || 'N/A'}</p>
              <div className="d-flex justify-content-between mt-3">
                <Button variant="primary" onClick={() => {
                    setShowProfileModal(false);
                    setShowChangePassword(true);
                
                  }}disabled>
                  Change Password
                </Button>
                <Button variant="danger" onClick={() => {
                    logout();
                    setShowProfileModal(false);
                  }}>
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <Alert variant="warning">No user information available.</Alert>
          )}
        </Modal.Body>
      </Modal>

      {/* Change Password Modal */}
      <ChangePasswordForm show={showChangePassword} onHide={() => setShowChangePassword(false)} userId={user?.userId} />
    </>
  );
};

export default Modals;
