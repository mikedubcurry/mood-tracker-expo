import { TouchableOpacity, View, Text } from "react-native";
import { moods } from "../constants";
import { useEffect, useState } from "react";
import { db } from "../db-service";
import { getMoodActivities, getMoodNote } from "../moods";

export default function EntryView({ entry }) {
    const [activities, setActivities] = useState([])
    const [note, setNote] = useState('')
    useEffect(() => {
        getMoodActivities(entry).then(setActivities)
        getMoodNote(entry).then(setNote)
    }, [])

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
