import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function BackButton({ onBack }) {
    return (
            <TouchableOpacity onPress={onBack} style={styles.button}>
                <Text accessibilityLabel="Back Button" style={styles.text}>&larr;</Text>
            </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12
    },
    text: {
        fontSize: 24
    }
})
