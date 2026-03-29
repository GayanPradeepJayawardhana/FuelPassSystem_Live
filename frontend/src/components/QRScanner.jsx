import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';

function QRScanner({ onScan, onClose }) {
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState('unknown');
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanningRef = useRef(false);

  // Check camera permissions and list devices
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'camera' });
        setCameraPermissionStatus(result.state);

        // List available media devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableDevices(videoDevices);

        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }

        if (result.state === 'granted') {
          startCamera(videoDevices[0]?.deviceId);
        } else if (result.state === 'prompt') {
          // Will show permission prompt when starting camera
          startCamera(videoDevices[0]?.deviceId);
        }
      } catch (err) {
        console.error('Permission check error:', err);
        // Fallback: try to start camera anyway
        startCamera();
      }
    };

    checkPermissions();
  }, []);

  // Initialize camera
  const startCamera = async (deviceId = null) => {
    try {
      setError('');
      
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      // If specific device ID is available, use it
      if (deviceId) {
        constraints.video = {
          ...constraints.video,
          deviceId: { exact: deviceId }
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setCameraPermissionStatus('granted');
        startScanning();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMessage = '';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please:\n1. Click the permission icon in your browser address bar\n2. Select "Allow" for camera access\n3. Refresh and try again';
        setCameraPermissionStatus('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera device found. Please check if your device has a camera connected.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera is being used by another application. Please close other apps using the camera and try again.';
      } else if (err.name === 'OverconstrainedError' || err.name === 'TypeError') {
        errorMessage = 'Camera format not supported. Trying alternative settings...';
        // Fallback with fewer constraints
        tryFallbackCamera();
        return;
      } else if (err.name === 'AbortError') {
        errorMessage = 'Camera access was aborted. Please try again.';
      } else {
        errorMessage = `Camera error: ${err.message || err.name || 'Unknown error'}. Please try again.`;
      }

      setError(errorMessage);
      setIsCameraActive(false);
    }
  };

  // Fallback camera with minimal constraints
  const tryFallbackCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setCameraPermissionStatus('granted');
        startScanning();
      }
    } catch (err) {
      setError('Unable to access camera with any settings. Please ensure:\n• Camera is connected\n• Camera permissions are granted\n• No other app is using the camera');
      setIsCameraActive(false);
    }
  };

  // Handle device selection change
  const handleDeviceChange = (newDeviceId) => {
    setSelectedDeviceId(newDeviceId);
    // Stop current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    scanningRef.current = false;
    // Start with new device
    startCamera(newDeviceId);
  };

  // Scanning loop
  const startScanning = () => {
    scanningRef.current = true;
    const scan = () => {
      if (!scanningRef.current || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data and scan for QR code
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrCode && qrCode.data && !scanned) {
          // QR code detected
          try {
            const qrData = JSON.parse(qrCode.data);
            setScanned(true);
            scanningRef.current = false;

            // Stop camera
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }
            setIsCameraActive(false);

            // Call the onScan callback with vehicle ID
            onScan(qrData.vehicleId);
          } catch (err) {
            // QR code scanned but not valid JSON, treat as text
            setScanned(true);
            scanningRef.current = false;

            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }
            setIsCameraActive(false);

            onScan(qrCode.data);
          }
        }
      }

      if (scanningRef.current) {
        requestAnimationFrame(scan);
      }
    };

    requestAnimationFrame(scan);
  };

  const handleClose = () => {
    scanningRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      if (stream) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        stream.getTracks().forEach(track => track.stop());
        
        // Permission granted, retry starting camera
        setCameraPermissionStatus('granted');
        setError('');
        startCamera(selectedDeviceId);
      }
    } catch (err) {
      console.error('Permission request error:', err);
      setError('Permission request failed. Please enable camera in browser settings.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      {/* Close Button */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: 'var(--danger)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--border-radius)',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: 600,
          zIndex: 1001,
          transition: 'var(--transition)'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'var(--danger)'}
      >
        ✕ Close
      </button>

      <div style={{ textAlign: 'center', marginBottom: '2rem', color: 'white' }}>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>📱 Scan QR Code</h2>
        <p style={{ marginBottom: '0', fontSize: '1.1rem', opacity: 0.9 }}>
          Position the QR code within the frame
        </p>
      </div>

      {/* Device Selection */}
      {availableDevices.length > 1 && !error && isCameraActive && (
        <div style={{ marginBottom: '1.5rem', maxWidth: '500px', width: '100%' }}>
          <select
            value={selectedDeviceId}
            onChange={(e) => handleDeviceChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--border-radius)',
              border: '2px solid var(--primary)',
              backgroundColor: 'white',
              color: 'var(--dark)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            {availableDevices.map((device, idx) => (
              <option key={device.deviceId} value={device.deviceId}>
                📷 Camera {idx + 1} {device.label && `- ${device.label}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Video Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        aspectRatio: '1',
        borderRadius: '1rem',
        overflow: 'hidden',
        border: '3px solid var(--primary)',
        boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)',
        backgroundColor: '#000'
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: isCameraActive && !error ? 'block' : 'none'
          }}
        />

        {/* Camera Not Active - Loading */}
        {!isCameraActive && !error && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}>📷</div>
              <p>Initializing camera...</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
                {cameraPermissionStatus === 'denied' ? 
                  'Waiting for permission...' : 
                  'Please grant camera access'}
              </p>
            </div>
          </div>
        )}

        {/* Scanning Frame Overlay */}
        {isCameraActive && !error && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            border: '3px solid var(--primary)',
            borderRadius: '0.5rem',
            boxShadow: 'inset 0 0 20px rgba(37, 99, 235, 0.3)',
            pointerEvents: 'none'
          }} />
        )}

        {/* Hidden Canvas for QR detection */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>

      {/* Error Message with Solutions */}
      {error && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '2px solid var(--danger)',
          borderRadius: 'var(--border-radius)',
          color: '#fca5a5',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.75rem' }}>⚠️ Camera Access Error</strong>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {error}
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {cameraPermissionStatus === 'denied' && (
              <button
                onClick={requestCameraPermission}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--primary-dark)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary)'}
              >
                🔄 Retry Permission
              </button>
            )}
            
            <button
              onClick={() => tryFallbackCamera()}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--warning)',
                color: '#1f2937',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'var(--transition)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f59e0b'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'var(--warning)'}
            >
              🔧 Try Fallback
            </button>

            <button
              onClick={handleClose}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--secondary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontWeight: 600,
                gridColumn: cameraPermissionStatus === 'denied' ? '1 / -1' : 'auto',
                transition: 'var(--transition)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'var(--secondary)'}
            >
              ↩️ Back to Manual Entry
            </button>
          </div>

          {/* Troubleshooting Tips */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderRadius: 'var(--border-radius)',
            textAlign: 'left',
            fontSize: '0.9rem'
          }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>💡 Troubleshooting Tips:</strong>
            <ul style={{ marginBottom: '0', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
              <li>Check camera is connected and not in use by another app</li>
              <li>Go to browser settings → Privacy → Camera → Enable for this site</li>
              <li>Try a different camera if you have multiple</li>
              <li>Clear browser cache and try again</li>
              <li>Use HTTPS (camera requires secure connection)</li>
              <li>If all fails, use manual Vehicle ID entry instead</li>
            </ul>
          </div>
        </div>
      )}

      {/* Scanned Message */}
      {scanned && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          border: '2px solid var(--success)',
          borderRadius: 'var(--border-radius)',
          color: '#86efac',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
          <p style={{ marginBottom: '0', fontSize: '1.1rem' }}>
            QR Code scanned successfully!
          </p>
        </div>
      )}

      {/* Instructions */}
      {isCameraActive && !error && (
        <div style={{
          marginTop: '2rem',
          color: 'white',
          textAlign: 'center',
          maxWidth: '500px',
          padding: '0 1rem'
        }}>
          <p style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '0' }}>
            💡 Make sure the QR code is well-lit and clearly visible
          </p>
        </div>
      )}

      {/* Add animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default QRScanner;
