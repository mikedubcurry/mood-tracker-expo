import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native"

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
}

export default function EntryList({ entries, onSelectEntry }) {
    const [forceUpdate, forceUpdateId] = useForceUpdate();

    return (
        <ScrollView style={styles.listArea}>
            {entries.length > 0 && (
                entries.map(entry => (
                    <TouchableOpacity key={entry.id} onPress={onSelectEntry}>
                        <Text>{entry.value}</Text>
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    listArea: {
        backgroundColor: "#f0f0f0",
        flex: 1,
        paddingTop: 16,
    },
})
