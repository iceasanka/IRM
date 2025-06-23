import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, StyleSheet, Dimensions } from 'react-native';
import { CameraView, Camera } from "expo-camera";

const BarcodeScanner_2 = ({ onScan }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [dimensions, setDimensions] = useState({ width: Dimensions.get('window').width, height: Dimensions.get('window').height });
    const timeoutRef = useRef(null);

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getCameraPermissions();

        const handleDimensionsChange = ({ window }) => {
            setDimensions({ width: window.width, height: window.height });
        };

        const subscription = Dimensions.addEventListener('change', handleDimensionsChange);

        return () => {
            subscription?.remove();
        };
    }, []);

    useEffect(() => {
        // Cleanup timeout on unmount
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        if (scanned) return; // Prevent multiple scans during cooldown
        setScanned(true);
        onScan(data);
        // Disable scanning for 2 seconds
        timeoutRef.current = setTimeout(() => {
            setScanned(false);
        }, 2000);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.cameraContainer} >
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['code128', 'code93', 'codabar', 'ean13', 'ean8', 'code39']
                }}
                autofocus='on'
                style={styles.camera}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: 230, 
        height: 280, 
    },
});

export default BarcodeScanner_2;