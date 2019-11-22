import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TouchableHighlight} from 'react-native';
import {Linking} from "expo";
import * as SQLite from "expo-sqlite";

const DB_NAME = 'sessionStore';
const DB = SQLite.openDatabase(DB_NAME);

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props)
        this._handlePress = this._handlePress.bind(this);
        this._deleteData = this._deleteData.bind(this);
    }

    _handlePress(type = 'website') {
        if (type === 'email') {
            Linking.openURL('mailto:xxx@hot.ee')
        } else if (type === 'website') {
            Linking.openURL('http:www.google.com')
        } else if (type === 'delete') {
            this._deleteData()
        } else if (type === 'privacy') {
            Linking.openURL('http:www.google.com')
        } else if (type === 'source') {
            Linking.openURL('http:www.google.com')
        } else if (type === 'license') {
            Linking.openURL('http:www.google.com')
        } else if (type === 'credit') {
            console.log()
        } else if (type === 'pomodoro') {
            Linking.openURL('https://en.wikipedia.org/wiki/Pomodoro_Technique')
        }
    }

    _deleteData() {
        DB.transaction(
            tx => {
                tx.executeSql(`DROP TABLE days`)
            }
        )
        DB.transaction(
            tx => {
                tx.executeSql(`DROP TABLE sessions`)
            }
        )
        DB.transaction(
            tx => {
                tx.executeSql(`CREATE TABLE days
                               (
                                   date        DATE UNIQUE NOT NULL,
                                   workMinutes INTEGER,
                                   workCount   INTEGER,
                                   restMinutes INTEGER,
                                   restCount   INTEGER
                               )`)
            }
        )
        DB.transaction(
            tx => {
                tx.executeSql(`CREATE TABLE sessions
                               (
                                   date   DATE UNIQUE NOT NULL,
                                   type   TEXT,
                                   length INTEGER
                               )`)
            }
        )
    }


    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.sectionHeader}>Contact</Text>
                <TouchableHighlight style={styles.item} onPress={() => {
                    this._handlePress('email')
                }}>
                    <Text style={styles.itemText}>Email</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.item} onPress={() => {
                    this._handlePress('website')
                }}>
                    <Text style={styles.itemText}>Website</Text>
                </TouchableHighlight>
                <Text style={styles.sectionHeader}>Privacy</Text>
                <TouchableHighlight style={styles.item} onPress={() => {
                    this._handlePress('delete')
                }}>
                    <Text style={styles.itemText}>Delete saved data</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.item} onPress={() => {
                    this._handlePress('export')
                }}>
                    <Text style={styles.itemText}>Export saved data</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.item} onPress={() => {
                    this._handlePress('privacy')
                }}>
                    <Text style={styles.itemText}>Privacy policy</Text>
                </TouchableHighlight>
                <Text style={styles.sectionHeader}>About</Text>
                <TouchableHighlight style={styles.item} onPress={() => {
                    this._handlePress('about')
                }}>
                    <Text style={styles.itemText}>Source code</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.item} onPress={() => {
                    this._handlePress('licence')
                }}>
                    <Text style={styles.itemText}>Licence</Text>
                </TouchableHighlight>
            </ScrollView>
        );
    }
}


SettingsScreen.navigationOptions = {
    title: 'Settings',
    headerStyle: {
        backgroundColor: '#1A2640',
        color: '#E1E4F3'
    },
    headerTitleStyle: {
        color: '#E1E4F3'
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    sectionHeader: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        padding: 10,
        height: 44,
    },
    itemText: {
        fontSize: 18,
    }
});
