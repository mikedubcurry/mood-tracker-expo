import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { moods } from '../constants'
import { useEffect, useState } from 'react'
import { db } from '../db-service'

export default function EntryListItem({ entry, onSelectEntry }) {
    const [activities, setActivities] = useState(null)
    const [note, setNote] = useState('')
    const { icon, mood } = moods.find(m => m.value === entry.value)

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(`select * from moodActivities where moodId = ?;`, [entry.id,], (t, { rows }) => {
                const moodActivities = rows._array;
                const whereClause = moodActivities.map(() => `where id = ?`).join(' or ');
                const params = moodActivities.map(ma => ma.activityId)
                if (moodActivities)
                    t.executeSql(`select * from activities ${whereClause};`, params, (_, { rows }) => {
                        const acts = rows._array
                        setActivities(acts)
                    })
            })
        })
    }, [])

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
            <Text>
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    entry: {
        padding: 8,
        display: 'flex',
        flexDirection: 'row'
    },
    entryIcon: {
        display: 'flex',
        alignItems: 'center',
    },
    activityList: {

    },
    moodText: {

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
