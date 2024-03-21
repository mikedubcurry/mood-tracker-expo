import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text } from "react-native"

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
}

export default function EntryList({ entries }) {
    const [forceUpdate, forceUpdateId] = useForceUpdate();

    return (
        <ScrollView style={styles.listArea}>
            {entries.length > 0 && (
                entries.map(entry => (
                    <Text key={entry.id} >{entry.value}</Text>
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
