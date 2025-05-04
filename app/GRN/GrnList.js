import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const GrnList = ({ data, toggleSelect }) => {
    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={[styles.headerText, { width: 10, marginLeft: 5, }]}>☐</Text>
            <Text style={[styles.headerText, { width: 130 }]}>Barcode</Text>
            <Text style={[styles.headerText, { width: 80, marginRight: 10 }]}>itemRef</Text>
            <Text style={[styles.headerText, { width: 40 }]}>Qty</Text>
            <Text style={[styles.headerText, { width: 200, marginLeft: 1, marginRight: 20 }]}>Des.</Text>
            <Text style={[styles.headerText, { width: 60, marginRight: 10 }]}>Status</Text>
            <Text style={[styles.headerText, { width: 60, marginRight: 10 }]}>grnRef</Text>
            <Text style={[styles.headerText, { width: 100 }]}>Date</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.row,
                item.selected ? styles.selectedRow : null,
                item.status === 2 ? styles.statusReturned : null,
            ]}
            onPress={() => toggleSelect(item.id)}
        >
            <View style={styles.row2}>
                <Text style={[styles.cellText, { width: 20, marginLeft: 5, }]}>{item.selected ? '☑' : '☐'}</Text>
                <Text style={[styles.cellText, { width: 130, marginRight: 10 }]}>{item.barCode}</Text>
                <Text style={[styles.cellText, { width: 80, marginRight: 10 }]}>{item.itemRefCode}</Text>
                <Text style={[styles.cellText, { width: 40 }]}>{item.qty}</Text>
                <Text style={[styles.cellText, { width: 200, marginLeft: 1, marginRight: 20 }]}>{item.descrip}</Text>
                <Text style={[styles.cellText, { width: 60, marginRight: 10 }]}>{item.status}</Text>
                <Text style={[styles.cellText, { width: 60, marginRight: 10 }]}>{item.grnReference}</Text>
               
                <Text style={[styles.cellText, { width: 100 }]}>{item.date}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView horizontal={true} >
            <View>
                {renderHeader()}
                <FlatList
                    data={data} // Use the data prop
                    renderItem={renderItem}
                    //ListHeaderComponent={renderHeader}
                    keyExtractor={(item, index) => index.toString()

                    }
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: '#708090',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedRow: {
        backgroundColor: '#ADD8E6', // Highlight color
        //backgroundColor: '#f0f0f0'
    },
    statusReturned: {
        backgroundColor: '#9FE2BF', // Light green for status 2
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        //  width: 100,
    },
    row2: {
        flexDirection: 'row',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        //backgroundColor: '#D3D3D3',
    },
    cellText: {
        flex: 1,
        textAlign: 'left',
        color: '#555',
        // width: 100,
        textAlignVertical: 'center',

    },
});

export default GrnList;
