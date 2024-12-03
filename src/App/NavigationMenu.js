// NavigationMenu.js
import React from 'react';
import { Offcanvas, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const NavigationMenu = ({ showMenu, handleMenuToggle, onGoToLocationClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
    handleMenuToggle();
  };

  return (
    <Offcanvas show={showMenu} onHide={handleMenuToggle} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Navigation</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="flex-column">
          <Nav.Link onClick={() => handleNavigation('/')}>🌍 Map</Nav.Link>
          {user?.userType === 'admin' && (
            <>
              <Nav.Link onClick={() => handleNavigation('/register')}>📝 Register User</Nav.Link>
              <Nav.Link onClick={() => handleNavigation('/users')}>👥 View Users</Nav.Link>
            </>
          )}
          {!user && <Nav.Link onClick={() => handleNavigation('/login')}>🔐 Login</Nav.Link>}
          {/* Added Go To Location Menu Item */}
          <Nav.Link onClick={onGoToLocationClick}>📍 Go To Location</Nav.Link>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default NavigationMenu;
