import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Button, SafeAreaView, ScrollView, Alert, Modal, FlatList, TouchableOpacity } from 'react-native';
import BarcodeScanner from '../../BarcodeScanner';
import { apigetItemWithDetailsByBarcode, getPriceLink, deletePriceLink, addPriceLink } from '../../api';

const PriceLinkPage = () => {
    const [barcode, setBarcode] = useState('');
    const [scanning, setScanning] = useState(false);
    const [itemCode, setItemCode] = useState('');
    const [priceLinks, setPriceLinks] = useState([]);
    const [newPrice, setNewPrice] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (barcode) {
            fetchItemDetails(barcode);
        }
    }, [barcode]);

    const handleScan = (scannedData) => {
        setBarcode(scannedData);
        setScanning(false);
    };

    const fetchItemDetails = async (barcode) => {
        try {
            const response = await apigetItemWithDetailsByBarcode(barcode);
            const data = response.data;
            if (data) {
                setItemCode(data.item_Code);
                fetchPriceLinks(data.item_Code);
            } else {
                clearForm();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPriceLinks = async (itemCode) => {
        try {
            const response = await getPriceLink(itemCode);
            setPriceLinks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeletePriceLink = async (price) => {
        try {
            await deletePriceLink(itemCode);
            fetchPriceLinks(itemCode);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddPriceLink = async () => {
        try {
            const data = {
                itemCode,
                packsize: 1,
                costprice: 0,
                price: parseFloat(newPrice),
                ewholeprice: 0,
                pretprice: 0,
                pwholeprice: 0,
            };
            await addPriceLink(data);
            fetchPriceLinks(itemCode);
            setNewPrice('');
        } catch (error) {
            console.error(error);
        }
    };

    const clearForm = () => {
        setBarcode('');
        setItemCode('');
        setPriceLinks([]);
        setNewPrice('');
    };

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps='always'>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <Text style={styles.labelText}>Barcode</Text>
                        <TextInput style={styles.valueText} value={barcode} onChangeText={setBarcode} />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.labelText}>Item Code</Text>
                        <TextInput style={styles.valueText} value={itemCode} editable={false} />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.labelText}>Price Links</Text>
                        <FlatList
                            data={priceLinks}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.priceLinkRow}>
                                    <Text style={styles.priceText}>{item.price}</Text>
                                    <Button title="Delete" onPress={() => handleDeletePriceLink(item.price)} />
                                </View>
                            )}
                        />
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.labelText}>New Price</Text>
                        <TextInput
                            style={styles.valueText}
                            value={newPrice}
                            onChangeText={setNewPrice}
                            keyboardType="numeric"
                            ref={inputRef}
                        />
                    </View>

                    <View style={styles.row}>
                        <Button title="Add Price Link" onPress={handleAddPriceLink} />
                    </View>

                    <View style={styles.row}>
                        <Button title="Clear" onPress={clearForm} />
                    </View>

                    <Modal
                        visible={scanning}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setScanning(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.popup}>
                                <BarcodeScanner onScan={handleScan} />
                                <Button title="Close" onPress={() => setScanning(false)} />
                            </View>
                        </View>
                    </Modal>

                    <View style={styles.row}>
                        <Button title="Scan" onPress={() => setScanning(true)} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    labelText: {
        fontWeight: 'bold',
        flex: 1,
    },
    valueText: {
        flex: 2,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 5,
    },
    priceLinkRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    priceText: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
        width: '90%',
        height: '50%',
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
    },
});

export default PriceLinkPage;