import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native"
import EntryListItem from "./EntryListItem";

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
                    <EntryListItem key={entry.id} entry={entry} onSelectEntry={onSelectEntry} />
                ))
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    listArea: {
        backgroundColor: "#f0f0f0",
        flex: 1,
        padding: 16,
    },
})
