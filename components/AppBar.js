import { StyleSheet, Text, View } from "react-native"
import BackButton from "./BackButton"

export default function AppBar({ heading, showBackButton, onBack }) {
    return (
        <View style={styles.appbar}>
            {showBackButton && (
                <BackButton onBack={onBack} />
            )}
            <Text style={styles.heading}>{heading}</Text>
            {showBackButton && (
                <View style={{opacity: 0}}><BackButton /></View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    appbar: {
        display: 'flex',
        backgroundColor: 'rebeccapurple',
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxHeight: '24px'
    },
    heading: {
        flex: 1,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: '#fff'
    },
})
