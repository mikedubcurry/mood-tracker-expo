import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { moods } from '../constants'
import { useEffect, useState } from 'react'
import { db } from '../db-service'
import { getMoodActivities, getMoodNote } from '../moods'

export default function EntryListItem({ entry, onSelectEntry }) {
    const [activities, setActivities] = useState(null)
    const [note, setNote] = useState(null)
    const { icon, mood } = moods.find(m => m.value === entry.value)

    useEffect(() => {
        getMoodActivities(entry).then(setActivities)
        getMoodNote(entry).then(setNote)
    }, [])

    const truncateNote = (note) => {
        if (!note) return null
        if (note.note.length > 25) {
            return note.note.slice(0, 25) + '...'
        }
        return note.note
    }

    return (
        <TouchableOpacity key={entry.id} onPress={() => onSelectEntry(entry)} style={styles.entry}>
            <View style={styles.entryIcon}>
                <Text style={styles.mood[entry.value]}>{icon}</Text>
                <Text style={styles.moodText}>{mood}</Text>
            </View>
            <View style={styles.activityList}>
                {activities && activities.map((act) => (
                    <Text key={act.id}>{act.activity}</Text>
                ))}
            </View>
            <View style={styles.note}>
                <Text>
                    {truncateNote(note)}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    entry: {
        padding: 8,
        display: 'flex',
        flexDirection: 'row',
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 8
    },
    entryIcon: {
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        gap: 8,
    },
    activityList: {
        display: 'flex',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderColor: '#aaa',
        paddingHorizontal: 8
    },
    moodText: {

    },
    note: {
        borderLeftWidth: 1,
        borderColor: '#aaa',
        paddingHorizontal: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mood: {
        1: {
            color: 'red',
            fontWeight: 'bold',
            transform: [{ rotate: '90deg' }]
        },
        2: {
            color: 'orange',
            fontWeight: 'bold',
            transform: [{ rotate: '90deg' }]
        },
        3: {
            color: 'gray',
            fontWeight: 'bold',
            transform: [{ rotate: '90deg' }]
        },
        4: {
            color: 'lightgreen',
            fontWeight: 'bold',
            transform: [{ rotate: '90deg' }]
        },
        5: {
            color: 'green',
            fontWeight: 'bold',
            transform: [{ rotate: '90deg' }]
        }
    },
})
