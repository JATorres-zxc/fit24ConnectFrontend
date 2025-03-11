import { 
  Text, 
  View, 
  StyleSheet,
  Modal,
  Platform,
  ActivityIndicator,
 } from 'react-native';
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Camera, CameraView } from 'expo-camera';
import { router } from 'expo-router';

import Header from '@/components/ScanHeader';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [accessStatus, setAccessStatus] = useState<'granted' | 'denied' | null>(null);
  const [scanData, setScanData] = useState<{ type: string; data: string } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

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
      setScanData(null);
      return () => setIsCameraActive(false); // Deactivate camera when leaving
    }, [])
  );

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (isLoading || scanned) return;

    setScanData({ type, data });
    setIsLoading(true);

    try {
      const API_BASE_URL =
          Platform.OS === 'web'
              ? 'http://127.0.0.1:8000' // Web uses localhost
              : 'http://192.168.1.7:8000'; // Mobile uses local network IP

      // Replace with your actual API endpoint 
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/facility/qr-scan/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ qrCode: data }),
      });
  
      const result = await response.json();
  
      // Assuming the API response has a field "accessGranted"
      const hasAccess = result.accessGranted;
  
      setAccessStatus(hasAccess ? "granted" : "denied");
      setShowPopup(true);
    } catch (error) {
      console.error("API Error:", error);
      setAccessStatus("denied");
      setShowPopup(true);
    } finally {
      setIsLoading(false);
  
      setTimeout(() => {
        setShowPopup(false);
        setScanned(false);
        setScanData(null);
  
        if (accessStatus === "granted") {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(tabs)/scan");
        }
      }, 2000);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (

    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.scannercontainer}>
          {isCameraActive && ( // Render camera only when active
            <CameraView
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
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
        onRequestClose={() => {
          setShowPopup(false);
          router.push('/(tabs)/home');
        }}
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
                : 'You do not have permission to enter this facility.'}
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
