import Constants from "expo-constants";
import { StyleSheet, View } from 'react-native';
import { db } from "./db-service";
import { useEffect, useState } from 'react';
import MoodInput from "./components/MoodInput";
import EntryList from "./components/EntryList";
import EntryView from "./components/EntryView";
import AppBar from "./components/AppBar";


export default function App() {
    const [mood, setMood] = useState(null)
    const [activities, setActivities] = useState([]);
    const [note, setNote] = useState('')
    const [selectedActivities, setSelectedActivities] = useState([])
    const [entries, setEntries] = useState([])
    const [selectedEntry, setSelectedEntry] = useState(null)

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(`
                create table if not exists moods (id integer primary key not null, value int not null, date text not null);
            `)
            tx.executeSql(`
                create table if not exists activities (id integer primary key not null, activity text);
            `)
            tx.executeSql(`
                create table if not exists moodActivities (id integer primary key not null, moodId int, activityId int);
            `)
            tx.executeSql(`
                create table if not exists moodNotes (id integer primary key not null, moodId int, note text);
            `)
            tx.executeSql(`
                select * from activities;
                `, null, (t, { rows }) => {
                if (rows.length === 0) {
                    t.executeSql(`
                        insert into activities (activity) values ('walk'), ('exercise'), ('clean');
                    `)
                }
            })
            tx.executeSql('select * from activities;', null, (_, { rows }) => {
                setActivities(rows._array)
            })
//tx.executeSql('delete from moods;')
//tx.executeSql('delete from moodActivities;')
//tx.executeSql('delete from activities;')
//tx.executeSql('delete from moodNotes;')

        })
    }, [])

    useEffect(() => {
        if (mood === null)
            db.transaction(tx => {

                tx.executeSql(`select * from moods;`, null, (t, { rows }) => {
                    setEntries(rows._array)
                })
            })
    }, [mood])

    const saveEntry = () => {
        if (mood) {
            let today = new Date().toISOString()
            db.transaction(tx => {
                tx.executeSql(`insert into moods (value, date) values (?, ?);`, [mood.value, today], (t, { insertId }) => {

                    if (selectedActivities.length) {
                        const values = selectedActivities.map(a => `(?, ?)`).join(',')
                        const params = selectedActivities.flatMap(a => {
                            return [insertId, a.id]
                        })
                        t.executeSql(`insert into moodActivities (moodId, activityId) values ${values};`, params)
                    }

                    if (note) {
                        t.executeSql(`insert into moodNotes (moodId, note) values (?, ?);`, [insertId, note])
                    }
                })
            })
        }
        setMood(null)
        setSelectedActivities([])
        setNote('')
    }

    const cancel = () => {
        setMood(null)
        setSelectedActivities([])
        setNote('')
        setSelectedEntry(null)
    }

    const handleSelectedActivitiesChange = id => {
        if (selectedActivities.map(a => a.id).includes(id)) {
            setSelectedActivities(selectedActivities.filter(a => a.id !== id))
        } else {
            const activity = activities.filter(a => a.id === id)
            if (activity)
                setSelectedActivities([...selectedActivities, ...activity])
        }
    }

//    useEffect(() => {
//        console.log(selectedActivities)
//
//    }, [selectedActivities])
//
    return (
        <View style={styles.container}>
            <AppBar heading="Mood Tracker" onBack={cancel} showBackButton={selectedEntry || mood} />
            {selectedEntry ? (
                <>
                    <EntryView entry={selectedEntry} onBack={cancel} />
                </>
            ) : (
                <>

                    <View style={styles.flexRow}>
                        <MoodInput
                            mood={mood}
                            onMoodChange={m => setMood(m)}
                            activites={activities}
                            note={note}
                            onNoteChange={setNote}
                            selectedActivities={selectedActivities}
                            onSelectedActivitiesChange={handleSelectedActivitiesChange}
                            onSave={saveEntry}
                            onCancel={cancel}
                        />
                    </View>
                    <EntryList entries={entries} onSelectEntry={entry => setSelectedEntry(entry)} />
                </>
            )}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    flexRow: {
        flexDirection: "row",
    },
});
