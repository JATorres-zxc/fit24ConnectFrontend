import { 
  Text, 
  View, 
  StyleSheet,
  Modal,
  ActivityIndicator,
 } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Camera, CameraView } from 'expo-camera';
import { router } from 'expo-router';
import { getItem } from '@/utils/storageUtils';

import Header from '@/components/ScanHeader';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { API_BASE_URL } from '@/constants/ApiConfig';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [accessStatus, setAccessStatus] = useState<'granted' | 'denied' | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const qrCodeProcessed = useRef(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true); // Activate camera when screen is focused
      setAccessStatus(null); // Reset access status when returning to the scan page
      setScanned(false);
      setErrorMessage(null);
      qrCodeProcessed.current = false; // Reset the processed state when screen comes into focus
      return () => setIsCameraActive(false); // Deactivate camera when leaving
    }, [])
  );

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    // Prevent multiple scans of the same QR code or during loading
    if (isLoading || scanned || qrCodeProcessed.current) return;

    // Set ref to true to prevent further processing until reset
    qrCodeProcessed.current = true;
    setScanned(true);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Get auth token
      const token = await getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // API call to validate QR code
      const response = await fetch(`${API_BASE_URL}/api/facility/qr-scan/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          qrCode: data,
          scan_method: "qr",
          location: "mobile-app"
         }),
      });
  
      if (!response.ok) {
        // Handle HTTP errors
        if (response.status === 404) {
          const errorData = await response.json();
          setAccessStatus("denied");
          setErrorMessage(errorData.error || 'Facility not found. Please scan a valid QR code.');
          setShowPopup(true);
          return;
        } else if (response.status === 403) {
          const errorData = await response.json();
          setAccessStatus("denied");
          setErrorMessage(errorData.reason || 'Access denied due to membership tier restrictions.');
          setShowPopup(true);
          return;
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const result = await response.json();
  
      // Check access status from the response
      const hasAccess = result.status === 'success';
  
      setAccessStatus(hasAccess ? "granted" : "denied");
      if (!hasAccess && result.reason) {
        setErrorMessage(result.reason);
      }
      setShowPopup(true);
    } catch (error) {
      console.error("API Error:", error);
      setAccessStatus("denied");
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred.');
      setShowPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset scanner manually if needed
  const resetScanner = () => {
    qrCodeProcessed.current = false;
    setScanned(false);
    setErrorMessage(null);
  };

  // Auto-close popup and navigate after a delay
  useEffect(() => {
    let navigationTimer: number | undefined;
    
    if (showPopup) {
      navigationTimer = setTimeout(() => {
        setShowPopup(false);
        
        // Navigate based on access status
        if (accessStatus === "granted") {
          router.replace("/(trainer)/home");
        } else { 
          // Reset scanner state only on access denied to allow new scan attempt
          resetScanner();
          // Stay on scan screen
        }
      }, 2000); // 2 second delay before automatic navigation
    }
    
    return () => {
      if (navigationTimer) clearTimeout(navigationTimer);
    };
  }, [showPopup, accessStatus]);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header userType='trainer' />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.scannercontainer}>
          {isCameraActive && ( // Render camera only when active
            <CameraView
              onBarcodeScanned={qrCodeProcessed.current ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              style={{ width: '100%', height: '100%' }}
            />
          )}
          {scanned && (
            <View style={styles.scannedOverlay}>
              {isLoading && <ActivityIndicator size="large" color={Colors.white} />}
            </View>
          )}
        </View>

        <Text style={styles.text}>Point camera to the designated Facility QR</Text>
      </View>
      
      <Modal
        transparent={true}
        visible={showPopup}
        animationType='fade'
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContainer,
            { backgroundColor: accessStatus === 'granted' ? Colors.green : Colors.red }
          ]}>
            <View style={[
              styles.statusIconContainer,
            ]}>
              <FontAwesome
                name={accessStatus === 'granted' ? 'check' : 'times'}
                size={40}
                color={accessStatus === 'granted' ? Colors.green : Colors.red }
              />
            </View>
            
            <Text style={styles.statusTitle}>
              {accessStatus === 'granted' ? 'Access Granted' : 'Access Denied'}
            </Text>
            
            <Text style={styles.statusMessage}>
              {accessStatus === 'granted' 
                ? 'You may now enter the facility.' 
                : errorMessage || 'An error occurred during verification.'}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
  headerContainer: {
    width: '85%',
    position: 'absolute',
    top: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannercontainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scannedOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: Fonts.italic,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  statusTitle: {
    fontFamily: Fonts.semibold,
    fontSize: 24,
    color: Colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  statusMessage: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
});
