import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";


const generalStart = () => {
    return (<View style={styles.constainer}>
        <Text style={styles.header}>Inventory Wizard</Text>

        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create Inventory</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Manage Inventory</Text>
        </TouchableOpacity>

    </View>)
};


const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    button: {
        width: "80%",
        paddingVertical: 25,
        backgroundColor: "#e0e0e0",
        borderRadius: 12,
        alignItems: "center",
        marginTop: 100,
        marginLeft: 30
    },
    buttonText: {
        fontSize: 16,
        color: "#000",
        fontWeight: "500",
    },


});


export default generalStart;