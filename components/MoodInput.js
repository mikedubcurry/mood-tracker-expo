import { StyleSheet, View, TextInput, Text, Button, TouchableOpacity } from "react-native"
import Constants from "expo-constants";

export default function MoodInput({ mood, onMoodChange, activites, note, onNoteChange, selectedActivities, onSelectedActivitiesChange, onSave }) {
    const moods = [
        { value: 5, mood: 'Great', icon: ":D" },
        { value: 4, mood: 'Good', icon: ':)' },
        { value: 3, mood: 'Okay', icon: ':|' },
        { value: 2, mood: 'Bad', icon: ":/" },
        { value: 1, mood: 'Aweful', icon: ":(" },
    ]

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

const styles = StyleSheet.create({
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
