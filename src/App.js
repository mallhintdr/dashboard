import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import Header from './App/Header';
import Modals from './App/Modals';
import NavigationMenu from './App/NavigationMenu';
import UserRegistration from './UserRegistration';
import UserList from './UserList';
import Login from './Login';
import GoToLocationForm from './Map Component/GoToLocationForm'; // Import the GoToLocationForm
import { calculateDaysRemaining } from './userUtils';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import './styles/navbar.css';
import './styles/dropdown.css';

const MapComponent = lazy(() => import('./Map Component/MapComponent'));

const App = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showGoToForm, setShowGoToForm] = useState(false); // Manage visibility of GoToLocationForm
  const [mapCenter, setMapCenter] = useState([30, 71]); // Default map center
  const [goToMarkers, setGoToMarkers] = useState([]); // Store markers for Go-To locations
  const [warningContent, setWarningContent] = useState({});
  const [selectedMauza, setSelectedMauza] = useState('');
  const [geoJsonPath, setGeoJsonPath] = useState(null); // Track the path of the GeoJSON file
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Clear selected mauza and GeoJSON path when user logs out
      setSelectedMauza('');
      setGeoJsonPath(null);
    } else {
      const daysRemaining = calculateDaysRemaining(user.startDate, user.subscriptionType);

      if (daysRemaining <= 0) {
        // Show expired subscription warning
        setWarningContent({
          title: 'Subscription Expired',
          userName: user.userName,
          startDate: new Date(user.startDate).toLocaleDateString(),
          endDate: new Date(user.endDate).toLocaleDateString(),
          daysRemaining: 0,
          message: 'Your subscription has expired. Please contact support to renew!',
        });
        setShowWarningModal(true);
      } else if (daysRemaining <= 5) {
        // Show upcoming expiration warning if daysRemaining is between 1 and 5
        setWarningContent({
          title: 'Subscription Expiring Soon',
          userName: user.userName,
          startDate: new Date(user.startDate).toLocaleDateString(),
          endDate: new Date(user.endDate).toLocaleDateString(),
          daysRemaining,
          message: `Your subscription will expire in ${daysRemaining} days. Please renew soon to continue enjoying services.`,
        });
        setShowWarningModal(true);
      }
    }
  }, [user]);

  const handleMenuToggle = () => setShowMenu((prev) => !prev);
  const handleProfileClick = () => (user ? setShowProfileModal(true) : navigate('/login'));

  const handleMauzaChange = (mauza) => {
    if (user) {
      const path = `/JSON Murabba/${user.tehsil}/${mauza}.geojson`;
      setGeoJsonPath(path);
      setSelectedMauza(mauza);
    }
  };

  const triggerWarningModal = (content) => {
    setWarningContent(content);
    setShowWarningModal(true);
  };

  // Handle the "Go To Location" functionality
  const handleGoToLocation = ({ lat, lng }) => {
    setMapCenter([lat, lng]); // Update map center
    setGoToMarkers((prev) => [...prev, [lat, lng]]); // Add new marker
    setShowGoToForm(false); // Close the form
  };

  const handleClearMarkers = () => {
    setGoToMarkers([]); // Clear all markers
  };

  const handleCancelGoTo = () => {
    setShowGoToForm(false); // Close the form
  };

  return (
    <>
      <Header
        handleMenuToggle={handleMenuToggle}
        handleProfileClick={handleProfileClick}
        handleMauzaChange={handleMauzaChange}
        selectedMauza={selectedMauza}
        setSelectedMauza={setSelectedMauza} // Pass setSelectedMauza to clear selection on login
      />
     <NavigationMenu
         showMenu={showMenu}
         handleMenuToggle={handleMenuToggle}
         onGoToLocationClick={() => {
         setShowGoToForm(true);
        setShowMenu(false); // Hide menu when "Go To Location" is selected
  }}
/>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <MapComponent
                  geoJsonUrl={geoJsonPath}
                  mapCenter={mapCenter}
                  goToMarkers={goToMarkers}
                  onClearMarkers={handleClearMarkers} // Pass clear markers function
                />
              }
            />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/login" element={<Login triggerWarningModal={triggerWarningModal} />} />
          </Routes>
        </Suspense>
      )}
      {showGoToForm && (
        <GoToLocationForm 
          onGoToLocation={handleGoToLocation} 
          onClose={handleCancelGoTo} 
          onClearMarkers={handleClearMarkers} // Pass clear markers function
        />
      )}
      <Modals
        showWarningModal={showWarningModal}
        setShowWarningModal={setShowWarningModal}
        warningContent={warningContent}
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
        showChangePassword={showChangePassword}
        setShowChangePassword={setShowChangePassword}
      />
    </>
  );
};

export default App;
