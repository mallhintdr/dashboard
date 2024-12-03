// Header.js
import React, { useState } from 'react';
import { Navbar, Container, Dropdown, FormControl, Spinner } from 'react-bootstrap';
import { useAuth } from '../AuthContext';

const Header = ({ handleMenuToggle, handleProfileClick, handleMauzaChange, selectedMauza, setSelectedMauza }) => {
  const { user, loading } = useAuth();
  const [filter, setFilter] = useState('');

  const filteredMauzaList = user?.mauzaList?.filter((mauza) =>
    mauza.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Navbar expand="lg" className="navbar-tech-theme">
      <Container fluid>
        <Navbar.Brand onClick={handleMenuToggle} style={{ cursor: 'pointer' }} className="navbar-brand-custom">
          <i className="fas fa-bars"></i> Geo Mapping 
        </Navbar.Brand>

        <div className="d-flex align-items-center">
          {user && user.mauzaList && user.mauzaList.length > 0 && (
            <Dropdown className="me-5">
              <Dropdown.Toggle variant="outline-light" id="mauza-dropdown" className="rounded-dropdown">
                {selectedMauza || 'Select Mauza'}
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ minWidth: '200px' }}>
                <FormControl
                  autoFocus
                  placeholder="Search Mauza..."
                  className="mx-3 my-2 w-auto"
                  onChange={(e) => setFilter(e.target.value)}
                  value={filter}
                />
                {filteredMauzaList.length > 0 ? (
                  filteredMauzaList.map((mauza, index) => (
                    <Dropdown.Item key={index} onClick={() => {
                      setSelectedMauza(mauza);
                      setFilter('');
                      handleMauzaChange(mauza); // Call the function to update GeoJSON path
                    }}>
                      {mauza}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled>No Mauza Found</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}

          <div onClick={handleProfileClick} className="profile-container" style={{ cursor: 'pointer' }}>
            <img src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" alt="User Icon" width={30} height={30} className="profile-icon" />
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : user ? (
              <span className="ms-2 username">{user.userName}</span>
            ) : (
              <span className="ms-2">Guest</span>
            )}
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
