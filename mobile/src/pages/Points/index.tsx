import React from 'react';

import { View, TouchableOpacity, Text } from 'react-native';

import { Feather as Icon } from '@expo/vector-icons';

import styles from './styles';

import { useNavigation } from '@react-navigation/native';

import MapView from 'react-native-maps';

const Points = () => {
    const navigation = useNavigation();

    function handleNavigateBack() {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateBack}>
                <Icon name="arrow-left" size={20} color="#34cb79"/>
            </TouchableOpacity>

            <Text style={styles.title}>Bem vindo.</Text>
            <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

            <View style={styles.mapContainer}>
            <MapView style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
            </View>
        </View>
    );
}

export default Points;