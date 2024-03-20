import Constants from "expo-constants";
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { openDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';

function getDatabase() {
    return openDatabase('moods-app.db', '0.0.4');
}

const db = getDatabase();
function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
}

function Items({ done: doneHeading, onPressItem }) {
    const [items, setItems] = useState(null);
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                `select * from items where done = ?;`,
                [doneHeading ? 1 : 0],
                (_, { rows: { _array } }) => setItems(_array)
            );
        });
    }, []);

    const heading = doneHeading ? "Completed" : "Todo";

    if (items === null || items.length === 0) {
        return null;
    }

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>{heading}</Text>
            {items.map(({ id, done, value }) => (
                <TouchableOpacity
                    key={id}
                    onPress={() => onPressItem && onPressItem(id)}
                    style={{
                        backgroundColor: done ? '#1c9963' : '#fff',
                        borderColor: '#000',
                        borderWidth: 1,
                        padding: 8
                    }}
                >
                    <Text style={{ color: done ? '#fff' : '#000' }}>{value}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

function MoodInput({ mood, onMoodChange, activites, note, onNoteChange, selectedActivities, onSelectedActivitiesChange, onSave }) {
    const moods = [
        { value: 5, mood: 'Great', icon: ":D" },
        { value: 4, mood: 'Good', icon: ':)' },
        { value: 3, mood: 'Okay', icon: ':|' },
        { value: 2, mood: 'Bad', icon: ":/" },
        { value: 1, mood: 'Aweful', icon: ":(" },
    ]
    console.log(note)
    return (
        <>
            {mood ? (
                <View style={styles.sectionContainer}>
                    <View style={styles.activitiesSelector}>
                        <Text >{mood.mood}</Text>
                        <View style={styles.activityList}>
                            {activites.map(a => {
                                return (
                                    <TouchableOpacity style={{ ...styles.activityItem, backgroundColor: selectedActivities.filter(act => act.id === a.id).length ? 'blue' : '#555' }} key={a.id} onPress={() => onSelectedActivitiesChange(a.id)}>
                                        <Text style={styles.activityText}>{a.activity}</Text>
                                    </TouchableOpacity>

                                )
                            })}
                        </View>
                        <TextInput multiline style={styles.noteInput} value={note} onChangeText={onNoteChange} />
                        <Button color="green" title="Save Entry" style={styles.saveButton} onPress={onSave}>Save</Button>
                    </View>
                </View>
            ) : (
                <View style={styles.moodSelector}>
                    {moods.map(m => (
                        <TouchableOpacity key={m.value} onPress={() => onMoodChange(m)} style={styles.moodItem} >
                            <Text style={styles.moodText}>{m.mood}</Text>
                            <Text style={styles.mood[m.value]}>{m.icon}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </>
    )
}

export default function App() {
    const [mood, setMood] = useState(null)
    const [activities, setActivities] = useState([]);
    const [note, setNote] = useState('')
    const [selectedActivities, setSelectedActivities] = useState([])
    const [forceUpdate, forceUpdateId] = useForceUpdate();

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(`
                create table if not exists moods (id integer primary key not null, value int);
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
                `, null, (_, { rows }) => {
                if (rows.length === 0) {
                    tx.executeSql(`
                        insert into activities (activity) values ('walk'), ('exercise'), ('clean');
                    `)
                }
            })
            tx.executeSql('select * from activities;', null, (_, { rows }) => {
                setActivities(rows._array)
            })
        })
    }, [])

    const add = (mood) => {
        // TODO: save mood and activities to DB
    }

    const handleSelectedActivitiesChange = id => {
        console.log(selectedActivities)
        if (selectedActivities.map(a => a.id).includes(id)) {
            setSelectedActivities(selectedActivities.filter(a => a.id !== id))
        } else {
            let activity = activities.filter(a => a.id === id)
            if (activity)
                setSelectedActivities([...selectedActivities, ...activity])
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Mood Tracker</Text>
            <View style={styles.flexRow}>
                <MoodInput
                    mood={mood}
                    onMoodChange={m => setMood(m)}
                    activites={activities}
                    note={note}
                    onNoteChange={setNote}
                    selectedActivities={selectedActivities}
                    onSelectedActivitiesChange={handleSelectedActivitiesChange}
                    onSave={() => { }}
                />
            </View>
            <ScrollView style={styles.listArea}>
                <Items key={`forceupdate-todo-${forceUpdateId}`}
                    done={false}
                    onPressItem={(id) => {
                        db.transaction(tx => {
                            tx.executeSql(`update items set done = 1 where id = ?`, [id])
                        }, null, forceUpdate)
                    }
                    }
                />
                <Items done={true} key={`forceupdate-done-${forceUpdateId}`}
                    onPressItem={(id) => {
                        db.transaction(tx => {
                            tx.executeSql(`delete from items where id = ?`, [id])
                        }, null, forceUpdate)
                    }}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    flexRow: {
        flexDirection: "row",
    },
    input: {
        borderColor: "#4630eb",
        borderRadius: 4,
        borderWidth: 1,
        flex: 1,
        height: 48,
        margin: 16,
        padding: 8,
    },
    listArea: {
        backgroundColor: "#f0f0f0",
        flex: 1,
        paddingTop: 16,
    },
    sectionContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    sectionHeading: {
        fontSize: 18,
        marginBottom: 8,
    },
    moodSelector: {
        width: '100%',
        paddingHorizontal: 24,
        paddingVertical: 24,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    moodItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#555',
        flex: .18,
        padding: 8,
        borderRadius: 8
    },
    moodText: {
        color: '#fff'
    },
    activityList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    activityItem: {
        backgroundColor: '#555',
        padding: 8,
        borderRadius: 18
    },
    activityText: {
        color: '#fff',
        textAlign: 'center',
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
    saveButton: {
        backgroundColor: 'green',
        paddingHorizontal: 4
    },
    noteInput: {
        borderRadius: 12,
        padding: 12,
        marginVertical: 16,
        borderColor: '#000',
        borderWidth: 1,
        width: '100%',
        minHeight: 128
    }
});
