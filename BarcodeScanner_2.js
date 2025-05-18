import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Dimensions } from 'react-native';
import { CameraView, Camera } from "expo-camera";

const BarcodeScanner_2 = ({ onScan }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [dimensions, setDimensions] = useState({ width: Dimensions.get('window').width, height: Dimensions.get('window').height });

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

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        onScan(data);

        setTimeout(() => {
        setScanned(false); // Allow next scan after delay
    }, 3000); // 1-second delay
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
                style={styles.camera}
            />
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
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
        // width: Dimensions.get('window').width * 0.5, // 90% of the screen width
        // height: Dimensions.get('window').height * 0.3, // 40% of the screen height
        width: 290, // Fixed width in pixels
        height: 280, // Fixed height in pixels
    },
});

export default BarcodeScanner_2;