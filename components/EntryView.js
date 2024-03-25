import { TouchableOpacity, View, Text } from "react-native";
import { moods } from "../constants";
import { useEffect, useState } from "react";
import { db } from "../db-service";

export default function EntryView({ entry }) {
    const [activities, setActivities] = useState([])
    const [note, setNote] = useState('')
    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(`select * from moodActivities where moodId = ?;`, [entry.id,], (t, { rows }) => {
                const moodActivities = rows._array;
                const params = moodActivities.map(ma => ma.activityId)
                const qMarks = moodActivities.map(() => "?").join(', ')
                if (moodActivities) {
                    t.executeSql(`select * from activities where id in (${qMarks});`, params, (_, { rows }) => {
                        const acts = rows._array
                        setActivities(acts)
                    })
                }
            })
            tx.executeSql(`select * from moodNotes where moodId = ?;`, [entry.id], (_, { rows }) => {
                console.log(rows)
                if (rows._array.length) {
                    setNote(rows._array[0])
                }
            })
        })
    }, [])

    useEffect(() => {
        console.log({ activities })
    }, [activities])

    const mood = moods.find(m => m.value === entry.value)

    return (
        <View>
            <Text >{mood.icon}</Text>
            <Text >{mood.mood}</Text>
            <Text>{note.note}</Text>
            {activities.map((act) => (
                <Text key={act.id}>{act.activity}</Text>
            ))}
        </View>
    )
}
