import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ViewStyle, TextStyle } from 'react-native';

interface FilterOption {
    label: string;
    value: string; // Veya number, API'nizin veya constant'ınızın yapısına göre
}

interface FilterMenuProps {
    visible: boolean;
    options: FilterOption[]; // Seçenekler için tip tanımladık
    onSelect: (value: string) => void; // Seçildiğinde çalışacak fonksiyon
    onClose: () => void; // Modal kapatıldığında çalışacak fonksiyon
}

const FilterMenu: React.FC<FilterMenuProps> = ({ visible, options, onSelect, onClose }) => {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}> {/* Android'de geri tuşu için onRequestClose ekledik */}
            <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}> {/* Overlay'e tıklandığında menü kapanmalı, içerik tıklamasını engellemek için activeOpacity={1} */}
                <View style={styles.menu}>
                    {options.map((option) => (
                        <TouchableOpacity key={option.value} onPress={() => onSelect(option.value)} style={styles.item}>
                            <Text style={styles.text}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingRight: 16,
    } as ViewStyle,
    menu: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 8,
        minWidth: 140,
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    } as ViewStyle,
    item: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    } as ViewStyle,
    text: {
        fontSize: 14,
        color: '#333',
    } as TextStyle,
});

export default FilterMenu;