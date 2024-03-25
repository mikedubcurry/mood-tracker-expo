import { ScrollView, StyleSheet, Text } from "react-native"
import EntryListItem from "./EntryListItem";

export default function EntryList({ entries, onSelectEntry }) {
    const groupedByDate = entries.reduce((byDate, entry) => {
        let { date } = entry;
        date = date.slice(0, 10)
        if (!byDate[date]) {
            byDate[date] = [];
        }
        byDate[date].push(entry)
        return byDate
    }, {});

    return (
        <ScrollView style={styles.listArea}>
            {Object.keys(groupedByDate).length > 0 && Object.keys(groupedByDate).map(date => {
                return (
                    <>
                        <Text>{date}</Text>
                        {groupedByDate[date].map(entry => (
                            <EntryListItem key={entry.id} entry={entry} onSelectEntry={onSelectEntry} />
                        ))}
                    </>
                )
            })}
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
