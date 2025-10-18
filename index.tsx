/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// Fix for 'google' not found on 'window'
declare global {
  interface Window {
    google: any;
  }
}

const CompanionModeModal = ({ contacts, onClose, onStart }) => {
    const [selectedContactIds, setSelectedContactIds] = useState([]);
    const [duration, setDuration] = useState(30); // default 30 minutes

    const handleContactToggle = (contactId) => {
        setSelectedContactIds(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    const handleStart = () => {
        if (selectedContactIds.length === 0) {
            alert('Please select at least one contact to share your location with.');
            return;
        }
        onStart(selectedContactIds, duration);
    };
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleEsc = (event) => {
           if (event.keyCode === 27) onClose();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Start Companion Mode</h2>
                    <button onClick={onClose} className="close-btn" aria-label="Close">
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <p>Select contacts to share your live location with and set a duration for the session.</p>

                    <div className="form-group">
                        <label>Share with:</label>
                        <div className="contact-selection-list">
                            {contacts.length > 0 ? contacts.map(contact => (
                                <label key={contact.id} className="contact-selection-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedContactIds.includes(contact.id)}
                                        onChange={() => handleContactToggle(contact.id)}
                                    />
                                    <span>{contact.name}</span>
                                </label>
                            )) : <p>Please add an emergency contact first.</p>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="duration">Duration:</label>
                        <div className="duration-options">
                            {[15, 30, 60, 120].map(d => (
                                <button
                                    key={d}
                                    type="button"
                                    className={`btn ${duration === d ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setDuration(d)}
                                >
                                    {d < 60 ? `${d} min` : `${d/60} hr`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={handleStart} disabled={contacts.length === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                            <path d="M1 14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.5a.5.5 0 0 0-1 0V14a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v4.5a.5.5 0 0 0 1 0V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12z"/>
                        </svg>
                        Start Sharing
                    </button>
                </div>
            </div>
        </div>
    );
};

const MapView = ({ center }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const markerRef = useRef(null);

  useEffect(() => {
    async function initMap() {
        if (ref.current && !map && window.google) {
            const { Map } = await window.google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
            
            const newMap = new Map(ref.current, {
                center,
                zoom: 16,
                mapId: 'GUARDIANLINK_MAP_ID',
                disableDefaultUI: true,
            });
            
            const markerElement = document.createElement('div');
            markerElement.className = 'custom-marker';

            markerRef.current = new AdvancedMarkerElement({
                position: center,
                map: newMap,
                title: "Your Location",
                content: markerElement,
            });
            
            setMap(newMap);
        }
    }
    if (window.google) {
        initMap();
    }
  }, [ref, map, center]);

  useEffect(() => {
    if (map && markerRef.current) {
        markerRef.current.position = center;
        map.panTo(center);
    }
  }, [center, map]);

  return <div ref={ref} id="map" />;
};

const HomeScreen = ({
  isElderlyMode,
  setIsElderlyMode,
  isSosActive,
  companionSession,
  handleStartSos,
  handleCancelSos,
  handleMarkSafe,
  sosCountdown,
  timeLeft,
  formatTime,
  isMapScriptLoaded,
  currentPosition,
  stopCompanionMode
}) => {
  return (
    <div className="home-screen">
      <div className="home-header">
        <h1>GuardianLink</h1>
        <div className="form-group toggle-group">
          <label htmlFor="elderly-mode-home">Elderly Mode</label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              id="elderly-mode-home"
              checked={isElderlyMode}
              onChange={() => setIsElderlyMode(!isElderlyMode)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      <div className="sos-panel">
        <button
          className={`sos-button ${sosCountdown !== null ? 'sos-pending' : ''}`}
          aria-label="Activate SOS"
          onClick={sosCountdown !== null ? handleCancelSos : handleStartSos}
        >
          {sosCountdown !== null ? (
            <>
              CANCEL
              <span className="sos-timer">{sosCountdown}</span>
            </>
          ) : (
            'SOS'
          )}
        </button>
        <p className={`status-label ${isSosActive ? 'status-active' : ''}`}>
          {isSosActive ? 'EMERGENCY ACTIVE' : "You're Safe"}
        </p>
      </div>

      <div className="companion-panel">
        <h2>Companion Mode</h2>
        <p>Status: <strong>{companionSession.isActive ? 'Active' : 'Inactive'}</strong></p>
        
        {companionSession.isActive && (
          <div className="companion-active-details">
            <div className="timer">{formatTime(timeLeft)}</div>
            <p>Sharing location with: <strong>{companionSession.sharedWith.join(', ')}</strong></p>
            {isMapScriptLoaded && currentPosition ? (
                <MapView center={currentPosition} />
            ) : (
                <div className="map-placeholder">Loading map...</div>
            )}
             <button type="button" className="btn btn-secondary" onClick={stopCompanionMode}>Stop Sharing</button>
          </div>
        )}
      </div>

      {isSosActive && (
        <div className="mark-safe-container">
            <button className="btn btn-primary" onClick={handleMarkSafe}>
                Mark Me as Safe
            </button>
        </div>
      )}
    </div>
  );
};


const ContactsScreen = ({ contacts, handleContactChange, addContact, removeContact }) => {
    return (
        <div className="page-content">
            <div className="header">
                <h1>Emergency Contacts</h1>
            </div>
             <div className="section-header" style={{marginTop: 0}}>
              <p>Manage the people who will be notified in an emergency.</p>
              <button type="button" className="btn btn-secondary" onClick={addContact}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                Add Contact
              </button>
            </div>
            {contacts.map((contact, index) => (
              <div key={contact.id} className="contact-item">
                <div className="contact-header">
                  <h3>Contact #{index + 1}</h3>
                  <button type="button" className="btn btn-danger" onClick={() => removeContact(contact.id)} aria-label={`Remove Contact ${index + 1}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </button>
                </div>
                <div className="form-group">
                  <label htmlFor={`contact-name-${contact.id}`}>Full Name</label>
                  <input type="text" id={`contact-name-${contact.id}`} name="name" value={contact.name} onChange={(e) => handleContactChange(contact.id, e)} required />
                </div>
                <div className="form-group">
                  <label htmlFor={`contact-phone-${contact.id}`}>Phone Number</label>
                  <input type="tel" id={`contact-phone-${contact.id}`} name="phone" value={contact.phone} onChange={(e) => handleContactChange(contact.id, e)} required />
                </div>
                <div className="form-group">
                  <label htmlFor={`contact-email-${contact.id}`}>Email Address</label>
                  <input type="email" id={`contact-email-${contact.id}`} name="email" value={contact.email} onChange={(e) => handleContactChange(contact.id, e)} required />
                </div>
              </div>
            ))}
        </div>
    );
}

const HistoryScreen = () => {
    return (
        <div className="page-content">
            <div className="header">
                <h1>Alert History</h1>
            </div>
            <p>Recent alerts and activity logs will be shown here.</p>
        </div>
    );
}

const CameraView = ({ onCapture, onClose }) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const openCamera = async () => {
            try {
                streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = streamRef.current;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("Could not access the camera. Please check permissions.");
                onClose();
            }
        };
        openCamera();
        
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [onClose]);

    const handleCapture = () => {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
    };

    return (
        <div className="camera-overlay">
            <video ref={videoRef} autoPlay playsInline className="camera-video"></video>
            <div className="camera-controls">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleCapture}>Capture</button>
            </div>
        </div>
    );
};


const ProfileScreen = ({ user, handleUserChange, handleSubmit, profileImage, setProfileImage, setIsCameraOpen, passwords, handlePasswordChange }) => {
    const fileInputRef = useRef(null);
    
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <div className="page-content">
            <form onSubmit={handleSubmit}>
                <div className="header">
                    <h1>My Profile</h1>
                </div>

                <div className="profile-image-section">
                    <div className="profile-image-preview" style={{ backgroundImage: `url(${profileImage || 'https://via.placeholder.com/150'})` }}>
                         {!profileImage && <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16"><path d="M3 9.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5.5-2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5zm.793.146a.5.5 0 0 1 .707 0l1.5 1.5a.5.5 0 0 1-.707.708L9.5 9.207l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5z"/><path d="M.5 1a.5.5 0 0 0 0 1h.21l.447.894A2.5 2.5 0 0 0 4.105 5H8.5a2.5 2.5 0 0 0 2.345-1.106l.447-.894h.21a.5.5 0 0 0 0-1H.5z"/><path d="M16 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM14 6.025a.5.5 0 0 1 .5-.5h.5a.5.5 0 1 1 0 1h-.5a.5.5 0 0 1-.5-.5zM12 9.025a.5.5 0 0 1 .5-.5h.5a.5.5 0 1 1 0 1h-.5a.5.5 0 0 1-.5-.5zM10.5 12a.5.5 0 0 1 .5-.5h.5a.5.5 0 1 1 0 1h-.5a.5.5 0 0 1-.5-.5zM9 13.5a.5.5 0 0 1 .5-.5h.5a.5.5 0 1 1 0 1h-.5a.5.5 0 0 1-.5-.5zM4 6.025a.5.5 0 0 1 .5-.5h.5a.5.5 0 1 1 0 1H4.5a.5.5 0 0 1-.5-.5zM2.5 9a.5.5 0 0 1 .5-.5h.5a.5.5 0 1 1 0 1H3a.5.5 0 0 1-.5-.5zM1 12.5a.5.5 0 0 1 .5-.5h.5a.5.5 0 1 1 0 1H1.5a.5.5 0 0 1-.5-.5z"/></svg>}
                    </div>
                    <div className="image-actions">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                        <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current.click()}>Upload Photo</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsCameraOpen(true)}>Take Photo</button>
                    </div>
                </div>

                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" value={user.name} onChange={handleUserChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" value={user.email} onChange={handleUserChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="safeword">Voice Activation Safeword (Optional)</label>
                  <input type="password" id="safeword" name="safeword" value={user.safeword} onChange={handleUserChange} placeholder="e.g., 'Guardian Angel'" />
                </div>

                <div className="divider"></div>

                <div className="password-section">
                    <h2>Change Password</h2>
                    <div className="form-group">
                        <label htmlFor="current-password">Current Password</label>
                        <input type="password" id="current-password" name="current" value={passwords.current} onChange={handlePasswordChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="new-password">New Password</label>
                        <input type="password" id="new-password" name="new" value={passwords.new} onChange={handlePasswordChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm New Password</label>
                        <input type="password" id="confirm-password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} />
                    </div>
                </div>

                <div className="footer">
                    <button type="submit" className="btn btn-primary">Save Profile</button>
                </div>
            </form>
        </div>
    )
}

const BottomNavBar = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'home', label: 'Home', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
        { id: 'contacts', label: 'Contacts', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><circle cx="12" cy="10" r="2"></circle><line x1="8" x2="8" y1="2" y2="4"></line><line x1="16" x2="16" y1="2" y2="4"></line></svg> },
        { id: 'history', label: 'History', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M12 8v4l2 2"></path></svg> },
        { id: 'profile', label: 'Profile', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg> },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                <button
                    key={item.id}
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                    aria-label={item.label}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};


const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState({
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    safeword: '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [contacts, setContacts] = useState([
    { id: 1, name: 'Jane Smith', phone: '555-123-4567', email: 'jane.s@example.com' },
  ]);

  const [isElderlyMode, setIsElderlyMode] = useState(false);
  const [companionSession, setCompanionSession] = useState({
    isActive: false,
    sharedWith: [],
    endTime: null,
  });
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false);
  const watchIdRef = useRef(null);

  const [isSosActive, setIsSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(null);
  const countdownTimerRef = useRef(null);
  const sosActivationTimeoutRef = useRef(null);


  useEffect(() => {
    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId) || window.google) {
      setIsMapScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&v=beta`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsMapScriptLoaded(true);
    script.onerror = () => console.error("Failed to load Google Maps script.");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (companionSession.isActive && companionSession.endTime) {
        const updateTimer = () => {
            const now = Date.now();
            const remaining = Math.round((companionSession.endTime - now) / 1000);
            if (remaining > 0) {
                setTimeLeft(remaining);
            } else {
                setTimeLeft(0);
                stopCompanionMode();
            }
        };

        const intervalId = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(intervalId);
    }
  }, [companionSession.isActive, companionSession.endTime]);


  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };
  
  const handlePasswordChange = (e) => {
      const { name, value } = e.target;
      setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (id, e) => {
    const { name, value } = e.target;
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === id ? { ...contact, [name]: value } : contact
      )
    );
  };

  const addContact = () => {
    const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    setContacts([...contacts, { id: newId, name: '', phone: '', email: '' }]);
  };

  const removeContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted");
    console.log("User Data:", user);
    console.log("Password Data:", passwords);
    console.log("Emergency Contacts:", contacts);
    alert('Settings saved! (Check console for data)');
  };
  
  const handleStartCompanionMode = (selectedContactIds, durationInMinutes) => {
    navigator.geolocation.getCurrentPosition(position => {
        const durationInSeconds = durationInMinutes * 60;
        const endTime = Date.now() + durationInSeconds * 1000;
        
        const sharedWithNames = contacts
            .filter(c => selectedContactIds.includes(c.id))
            .map(c => c.name);

        setCompanionSession({
            isActive: true,
            sharedWith: sharedWithNames,
            endTime: endTime,
        });

        setTimeLeft(durationInSeconds);
        
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCurrentPosition(coords);

        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
            (newPosition) => {
                setCurrentPosition({
                    lat: newPosition.coords.latitude,
                    lng: newPosition.coords.longitude,
                });
            },
            (error) => {
                console.error("Geolocation watch error:", error);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

    }, (error) => {
        console.error("Geolocation error:", error);
        alert("Could not get your location. Please enable location services and try again.");
    });
  };

  const stopCompanionMode = () => {
    if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
    }
    setCurrentPosition(null);
    setCompanionSession({
        isActive: false,
        sharedWith: [],
        endTime: null,
    });
    setTimeLeft(0);
    console.log('Companion Mode stopped.');
  };

  const handleStartSos = () => {
    setSosCountdown(5);
    countdownTimerRef.current = setInterval(() => {
        setSosCountdown(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    sosActivationTimeoutRef.current = setTimeout(() => {
        clearInterval(countdownTimerRef.current);
        setSosCountdown(null);
        setIsSosActive(true);
        // Automatically start companion mode with all contacts for 1 hour
        const allContactIds = contacts.map(c => c.id);
        if(allContactIds.length > 0) {
            handleStartCompanionMode(allContactIds, 60);
        }
        document.body.classList.add('sos-flash');
        setTimeout(() => document.body.classList.remove('sos-flash'), 500);
    }, 5000);
  };

  const handleCancelSos = () => {
      clearInterval(countdownTimerRef.current);
      clearTimeout(sosActivationTimeoutRef.current);
      setSosCountdown(null);
  };

  const handleMarkSafe = () => {
      setIsSosActive(false);
      stopCompanionMode();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  
  const handleCapturePhoto = (imageDataUrl) => {
      setProfileImage(imageDataUrl);
      setIsCameraOpen(false);
  }

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'contacts':
        return <ContactsScreen 
                contacts={contacts}
                handleContactChange={handleContactChange}
                addContact={addContact}
                removeContact={removeContact}
                />;
      case 'history':
        return <HistoryScreen />;
      case 'profile':
        return <ProfileScreen 
                user={user}
                handleUserChange={handleUserChange}
                handleSubmit={handleSubmit}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                setIsCameraOpen={setIsCameraOpen}
                passwords={passwords}
                handlePasswordChange={handlePasswordChange}
                />;
      case 'home':
      default:
        return <HomeScreen 
                isElderlyMode={isElderlyMode}
                setIsElderlyMode={setIsElderlyMode}
                isSosActive={isSosActive}
                companionSession={companionSession}
                handleStartSos={handleStartSos}
                handleCancelSos={handleCancelSos}
                handleMarkSafe={handleMarkSafe}
                sosCountdown={sosCountdown}
                timeLeft={timeLeft}
                formatTime={formatTime}
                isMapScriptLoaded={isMapScriptLoaded}
                currentPosition={currentPosition}
                stopCompanionMode={stopCompanionMode}
                />;
    }
  };

  return (
    <>
      <div className={`container ${isElderlyMode ? 'elderly-mode' : ''}`}>
        {renderActiveTab()}
      </div>
      {isCameraOpen && <CameraView onCapture={handleCapturePhoto} onClose={() => setIsCameraOpen(false)} />}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);