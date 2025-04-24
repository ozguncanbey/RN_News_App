import React, {
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
    ForwardRefRenderFunction,
} from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle, TextStyle } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants/dimensions'; // Import yolu güncellendi
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // Expo projesi için import

export type ToastRef = {
    show: (msg: string, duration?: number) => void;
};

const Toast = forwardRef<ToastRef, {}>((props, ref) => {
    const [message, setMessage] = useState('');
    const opacity = useRef(new Animated.Value(0)).current;

    useImperativeHandle(ref, () => ({
        show(msg: string, duration = 2000) {
            // Eğer zaten görünürse veya animasyon devam ediyorsa sıfırla
            opacity.stopAnimation();
            setMessage(msg);

            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                // Sadece mesaj gösteriliyorsa zamanlayıcıyı başlat
                if (message !== '') {
                    setTimeout(() => {
                        Animated.timing(opacity, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }).start(() => setMessage('')); // Animasyon bitince mesajı temizle
                    }, duration);
                }
            });
        },
    }));

    // Mesaj yoksa render etme
    if (!message) {
        return null;
    }


    return (
        <Animated.View style={[styles.toastContainer, { opacity }]}>
            <MaterialIcons
                name="info"
                size={20}
                color="#fff"
                style={styles.icon}
            />
            <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        bottom: SCREEN_HEIGHT * 0.05,
        width: SCREEN_WIDTH * 0.9,
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 999,
        alignSelf: 'center',
        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Android Shadow
        elevation: 5,
    } as ViewStyle,
    icon: {
        marginRight: 8,
    } as TextStyle,
    toastText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'left',
        flex: 1,
    } as TextStyle,
});

export default Toast;