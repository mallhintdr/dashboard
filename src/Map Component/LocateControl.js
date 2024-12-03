import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import locationIcon from './images/location.png';

const LocateControl = L.Control.extend({
    onAdd: function (map) {
        this._userMarker = null;
        this._accuracyCircle = null;
        this._watchId = null;
        this._locationBuffer = [];
        this._intervalId = null;
        this._isTracking = false;

        const button = L.DomUtil.create('button', 'leaflet-location-icon');
        button.title = 'Track My Live Location';
        button.style.backgroundImage = `url('${locationIcon}')`;
        button.style.backgroundSize = '35px 35px';
        button.style.backgroundRepeat = 'no-repeat';
        button.style.backgroundPosition = 'center';
        button.style.width = '35px';
        button.style.height = '35px';
        button.style.borderRadius = '50%';
        button.style.border = '1px solid #ccc';
        button.style.cursor = 'pointer';

        const calculateAverageLocation = (locations) => {
            const total = locations.reduce(
                (acc, loc) => ({
                    latitude: acc.latitude + loc.latitude,
                    longitude: acc.longitude + loc.longitude,
                    accuracy: acc.accuracy + loc.accuracy,
                }),
                { latitude: 0, longitude: 0, accuracy: 0 }
            );

            const count = locations.length;
            return {
                latitude: total.latitude / count,
                longitude: total.longitude / count,
                accuracy: total.accuracy / count,
            };
        };

        const updateLocationDisplay = () => {
            if (this._locationBuffer.length > 0) {
                const { latitude, longitude, accuracy } = calculateAverageLocation(this._locationBuffer);

                if (this._userMarker) {
                    this._userMarker.setLatLng([latitude, longitude]);
                } else {
                    this._userMarker = L.marker([latitude, longitude], {
                        icon: L.icon({
                            iconUrl: locationIcon,
                            iconSize: [30, 30],
                            iconAnchor: [15, 15],
                        }),
                    }).addTo(map);
                }

                if (this._accuracyCircle) {
                    this._accuracyCircle.setLatLng([latitude, longitude]);
                    this._accuracyCircle.setRadius(accuracy);
                } else {
                    this._accuracyCircle = L.circle([latitude, longitude], {
                        radius: accuracy,
                        color: '#136AFE',
                        fillColor: '#136AFE',
                        fillOpacity: 0.2,
                    }).addTo(map);
                }

                map.setView([latitude, longitude], map.getZoom(), { animate: true });
                this._locationBuffer = [];
            }
        };

        const startTracking = () => {
            if ('geolocation' in navigator) {
                this._watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude, accuracy } = position.coords;
                        this._locationBuffer.push({ latitude, longitude, accuracy });

                        if (this._locationBuffer.length > 50) {
                            this._locationBuffer.shift();
                        }
                    },
                    (error) => {
                        console.error('Error retrieving location:', error.message);
                        alert('Unable to retrieve location. Ensure GPS or internet is active.');
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
                );

                this._intervalId = setInterval(updateLocationDisplay, 5000);
            } else {
                alert('Geolocation is not supported by your browser.');
            }
        };

        const stopTracking = () => {
            if (this._watchId !== null) {
                navigator.geolocation.clearWatch(this._watchId);
                this._watchId = null;
            }

            if (this._intervalId !== null) {
                clearInterval(this._intervalId);
                this._intervalId = null;
            }

            if (this._userMarker) {
                map.removeLayer(this._userMarker);
                this._userMarker = null;
            }

            if (this._accuracyCircle) {
                map.removeLayer(this._accuracyCircle);
                this._accuracyCircle = null;
            }

            this._locationBuffer = [];
            alert('Stopped live location tracking.');
        };

        L.DomEvent.on(button, 'click', () => {
            this._isTracking = !this._isTracking;
            if (this._isTracking) {
                startTracking();
                button.title = 'Stop Tracking My Live Location';
                button.style.backgroundColor = '#ffcccc';
            } else {
                stopTracking();
                button.title = 'Track My Live Location';
                button.style.backgroundColor = '';
            }
        });

        return button;
    },

    onRemove: function (map) {
        if (this._watchId !== null) {
            navigator.geolocation.clearWatch(this._watchId);
        }
        if (this._intervalId !== null) {
            clearInterval(this._intervalId);
        }
    },
});

const LocateControlComponent = () => {
    const map = useMap();

    useEffect(() => {
        const control = new LocateControl({ position: 'topleft' });
        map.addControl(control);

        return () => {
            map.removeControl(control);
        };
    }, [map]);

    return null;
};

export default LocateControlComponent;
