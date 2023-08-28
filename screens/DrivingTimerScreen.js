import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function DrivingTimerScreen() {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [distance, setDistance] = useState(0);
    const [startLocation, setStartLocation] = useState('Unknown');
    const [endLocation, setEndLocation] = useState('Unknown');

    useEffect(() => {
        let interval;
        if (isActive) {
            interval = setInterval(() => {
                setElapsedSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.timerCircle}>
                <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => setIsActive(!isActive)}>
                    <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => { setIsActive(false); setElapsedSeconds(0); }}>
                    <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => { /* Finish logic here */ }}>
                    <Text style={styles.buttonText}>Finish</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.detailsContainer}>
                <Text><Text style={styles.detailLabel}>Distance:</Text> {distance} km</Text>
                <Text><Text style={styles.detailLabel}>Start:</Text> {startLocation}</Text>
                <Text><Text style={styles.detailLabel}>End:</Text> {endLocation}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
        padding: 20,
    },
    timerCircle: {
        backgroundColor: '#424242',
        borderRadius: 150,
        width: 300,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        elevation: 5,
    },
    timerText: {
        color: 'white',
        fontSize: 28,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: '#2196F3',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 5,
        elevation: 3,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    detailsContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
        padding: 15,
        elevation: 5,
    },
    detailLabel: {
        fontWeight: 'bold',
    },
});

export default DrivingTimerScreen;
