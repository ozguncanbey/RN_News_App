import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle, TextStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // Expo projesi için bu import daha yaygın olabilir

interface EmptyStateProps {
    message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message = 'No data available.' }) => {
    return (
        <View style={styles.container}>
            <MaterialIcons name="inbox" size={80} color="#ccc" />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    } as ViewStyle, // Tip güvenliği için stil tipleri eklenebilir, isteğe bağlı
    image: { // Bu stil EmptyState kodunda kullanılmıyor gibi görünüyor, kaldırılabilir veya eklenmişse düzeltilebilir
        width: 160,
        height: 160,
        marginBottom: 24,
        opacity: 0.5,
    } as ViewStyle,
    text: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    } as TextStyle,
});

export default EmptyState;