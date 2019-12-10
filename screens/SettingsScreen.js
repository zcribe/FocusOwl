import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TouchableHighlight} from 'react-native';
import {Linking} from "expo";
import * as SQLite from "expo-sqlite";
import {AdMobBanner} from "expo-ads-admob";


const DB_NAME = 'sessionStore';
const DB = SQLite.openDatabase(DB_NAME);
const LINK_EMAIL = 'mailto:xxx@hot.ee';
const LINK_WEBSITE = 'https://zcribe.github.io/FocusOwl/';
const LINK_SOURCE = 'https://github.com/zcribe/FocusOwl';
const LINK_WIKI = 'https://en.wikipedia.org/wiki/Pomodoro_Technique';

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this._handlePress = this._handlePress.bind(this);
        this._deleteData = this._deleteData.bind(this);
    }

    _handlePress(type = 'website') {
        if (type === 'email') {
            Linking.openURL(LINK_EMAIL)
        } else if (type === 'website') {
            Linking.openURL(LINK_WEBSITE)
        } else if (type === 'delete') {
            this._deleteData()
        } else if (type === 'privacy') {
            this.props.navigation.navigate('Privacy')
        } else if (type === 'source') {
            Linking.openURL(LINK_SOURCE)
        } else if (type === 'license') {
            this.props.navigation.navigate('License')
        } else if (type === 'pomodoro') {
            Linking.openURL(LINK_WIKI)
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
                    this._handlePress('privacy')
                }}>
                    <Text style={styles.itemText}>Privacy policy</Text>
                </TouchableHighlight>

                <TouchableHighlight style={styles.item} onPress={() => {
                    this._handlePress('export')
                }}>
                    <Text style={styles.itemText}>Export saved data</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.item} onPress={() => {
                    this._handlePress('delete')
                }}>
                    <Text style={styles.itemText}>Delete saved data</Text>
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
                <AdMobBanner adUnitID={'ca-app-pub-6870019974253956/4241465282'} bannerSize='smartBannerPortrait'/>
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
        backgroundColor: '#272F50'
    },
    sectionHeader: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: '#1A2640',
        color:'#8293FF'
    },
    item: {
        padding: 10,
        height: 44,
        backgroundColor: '#272F50',
    },
    itemText: {
        fontSize: 18,
        color:'#E1E4F3'
    }
});
