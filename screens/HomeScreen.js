import React, {Component} from 'react';
import {ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View} from 'react-native';
import {Audio} from "expo-av";
import * as SQLite from 'expo-sqlite';

import TimerCounter from "../components/TimerCounter";
import TimerController from "../components/TimerController";

const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;
const PERCENTS_MAX = 100;

const ALLOWED_TIME_MIN = 1;
const ALLOWED_TIME_MAX = 99;

const VIBRATION_PATTERN = [100, 100, 100];

const COUNTER_WORK_MINUTES = 25;
const COUNTER_REST_MINUTES = 5;
const COUNTER_WORK_SECONDS = COUNTER_WORK_MINUTES * SECONDS_IN_MINUTE;
const COUNTER_REST_SECONDS = COUNTER_REST_MINUTES * SECONDS_IN_MINUTE;

const DB_NAME = 'sessionStore';
const DB = SQLite.openDatabase(DB_NAME);

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: null,
            counter: 0,
            counterRunning: false,
            counterMax: COUNTER_WORK_SECONDS,
            counterType: 'work',
            counterWork: COUNTER_WORK_MINUTES,
            counterRest: COUNTER_REST_MINUTES,
            minutes: COUNTER_WORK_MINUTES,
            seconds: '00',
            percentage: 0,
        };


        this.startCounter = this.startCounter.bind(this);
        this.controlCounter = this.controlCounter.bind(this);
        this.stopCounter = this.stopCounter.bind(this);
        this.playSound = this.playSound.bind(this);
        this.tick = this.tick.bind(this);
        this.swapCounterType = this.swapCounterType.bind(this);
        this.granulateTime = this.granulateTime.bind(this);
        this.percentLeft = this.percentLeft.bind(this);
        this.handleButtonPress = this.handleButtonPress.bind(this);
        this.createDaysEntry = this.createDaysEntry.bind(this);
        this.createSessionEntry = this.createSessionEntry.bind(this);
        this.createSessionsTable = this.createSessionsTable.bind(this);
        this.createDaysTable = this.createDaysTable.bind(this);
        this.readDaysTable = this.readDaysTable.bind(this);
        this.updateDayEntry = this.updateDayEntry.bind(this);
        this.readDayEntry = this.updateDayEntry.bind(this);
    }

    componentDidMount() {
        this.createDaysEntry()
    }

    startCounter() {
        // Create a counter that calls back to ticking method
        let timer = setInterval(this.tick, MILLISECONDS_IN_SECOND);
        this.setState({timer, counterRunning: true});
    }

    controlCounter() {
        // Check if the counter has met end conditions
        if (this.state.counter >= this.state.counterMax) {
            this.stopCounter(true);
            this.swapCounterType();
            this.startCounter();
        }
    };


    stopCounter(swapState = false) {
        // Methods that are called when the timer meets an end condition
        clearInterval(this.state.timer);
        this.setState({counter: 0, counterRunning: false});

        this.createSessionEntry();
        this.updateDayEntry();

        Vibration.vibrate(VIBRATION_PATTERN);
        this.playSound('end');
    };

    swapCounterType() {
        // Handle swapping counter states

        const timerState = this.state.counterType;
        const rest = this.state.counterRest;
        const work = this.state.counterWork;
        const restMax = rest * SECONDS_IN_MINUTE;
        const workMax = work * SECONDS_IN_MINUTE;

        if (timerState === 'work') {
            this.setState({
                counterType: 'rest',
                counterMax: restMax,
                minutes: rest,
                seconds: '00'
            })
        } else if (timerState === 'rest') {
            this.setState({
                counterType: 'work',
                counterMax: workMax,
                minutes: work,
                seconds: '00'
            })
        }

    }

    async playSound(sound) {
        // Sound playback management
        const soundObject = new Audio.Sound();

        if (sound === 'end') {
            try {
                await soundObject.loadAsync(require('.././assets/sounds/metronome.mp3'));
                await soundObject.playAsync();
            } catch (error) {
                // An error occurred!
            }
        } else if (sound === 'press') {
            try {
                await soundObject.loadAsync(require('.././assets/sounds/button2.wav'));
                await soundObject.playAsync();
            } catch (error) {
                // An error occurred!
            }
        }

    };

    tick = () => {
        // What happens every tick of an counter
        this.setState({
            counter: this.state.counter + 1
        });
        this.controlCounter();
        this.granulateTime();
        this.percentLeft();

    };

    handleButtonPress(operation, target) {
        // Handle increasing and decreasing of the counters
        const currentTimerType = this.state.counterType;
        const counterWork = this.state.counterWork;
        const counterRest = this.state.counterRest;

        // Manage specific counters values
        if (target === 'work') {
            if (operation === 'inc' && counterWork < ALLOWED_TIME_MAX) {
                this.setState((prevState) => ({
                    counterWork: prevState.counterWork + 1
                }))
            } else if (operation === 'dec' && counterWork > ALLOWED_TIME_MIN) {
                this.setState((prevState) => ({
                    counterWork: prevState.counterWork - 1
                }))
            }
        } else {
            if (operation === 'inc' && counterRest < ALLOWED_TIME_MAX) {
                this.setState((prevState) => ({
                    counterRest: prevState.counterRest + 1
                }))
            } else if (operation === 'dec' && counterRest > ALLOWED_TIME_MIN) {
                this.setState((prevState) => ({
                    counterRest: prevState.counterRest - 1
                }))
            }
        }


        // Manage the main overall counter values
        if (currentTimerType === target) {
            if (operation === 'inc' && counterWork < ALLOWED_TIME_MAX) {
                this.setState((prevState) => ({
                    counterMax: prevState.counterMax + SECONDS_IN_MINUTE,
                    minutes: prevState.minutes + 1
                }))
            } else if (operation === 'dec' && counterWork > ALLOWED_TIME_MIN) {
                this.setState((prevState) => ({
                    counterMax: prevState.counterMax - SECONDS_IN_MINUTE,
                    minutes: prevState.minutes - 1
                }))
            }
        }

        this.playSound('press')
    }


    granulateTime() {
        let minutes, seconds;

        const time = this.state.counterMax - this.state.counter;

        minutes = Math.floor(time / SECONDS_IN_MINUTE);
        seconds = time - minutes * SECONDS_IN_MINUTE;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        this.setState({
            minutes: minutes,
            seconds: seconds
        });
    }

    percentLeft() {
        const current = this.state.counter;
        const max = this.state.counterMax;
        const percentage = Math.round(current / max * PERCENTS_MAX);

        this.setState({percentage: percentage})
    }

    createDaysEntry() {
        DB.transaction(tx => {
                tx.executeSql(`
                    INSERT INTO days
                    VALUES (DATE('now'), ?, ?, ?, ?)`, [0, 0, 0, 0])
            }
        )
    }

    createSessionEntry() {
        const type = this.state.counterType;
        const length = Math.round(this.state.counter / SECONDS_IN_MINUTE)

        DB.transaction(
            tx => {
                tx.executeSql(`
                    INSERT INTO sessions
                    VALUES (DATE('now'), ?, ?)`, [type, length])
            }
        )
    }

    createDaysTable() {
        DB.transaction(
            tx => {
                tx.executeSql(`CREATE TABLE IF NOT EXISTS days
                               (
                                   date        DATE UNIQUE NOT NULL,
                                   workMinutes INTEGER,
                                   workCount   INTEGER,
                                   restMinutes INTEGER,
                                   restCount   INTEGER
                               )`)
            }
        );
    }

    readDaysTable() {
        DB.transaction(
            tx => {
                tx.executeSql(`SELECT * FROM days`)
            }
        );
    }



    createSessionsTable() {
        DB.transaction(
            tx => {
                tx.executeSql(`CREATE TABLE IF NOT EXISTS sessions
                               (
                                   date   DATE UNIQUE NOT NULL,
                                   type   TEXT,
                                   length INTEGER
                               )`)
            }
        )
    }

    updateDayEntry() {
        this.createSessionsTable();
        this.createDaysTable();


        let minutes, type;

        type = this.state.counterType;

        if (type === 'work') {
            minutes = Math.round(this.state.counter / SECONDS_IN_MINUTE);
            DB.transaction(
                tx => {
                    tx.executeSql(`
                        UPDATE days
                        SET workMinutes = workMinutes + ?,
                            workCount   = workCount + 1
                        WHERE DATE = DATE('now')`, [minutes])
                }, error => console.log(error)
            )
        } else {
            minutes = Math.round(this.state.counter / SECONDS_IN_MINUTE);
            DB.transaction(
                tx => {
                    tx.executeSql(`
                        UPDATE days
                        SET restMinutes = restMinutes + ?,
                            restCount   = restCount + 1
                        WHERE DATE = DATE('now')`, [minutes])
                }
            )
        }


    }

    readDayEntry() {
        // READ TODAY
        DB.transaction(tx => {
            tx.executeSql(`
                        SELECT workMinutes
                        FROM days
                        WHERE date = DATE('now')`,
                null,
                (trans, res) => {

                    if (res['rows']['length'] > 0) {
                        let totalMinutes = res['rows']['_array'][0]['workMinutes']
                        this.setState({
                            totalMinutes: totalMinutes
                        })
                    }
                })
        });
    }


    render() {
        let button, bg, order, buttonTheme, buttonThemeText, orderButton;

        if (this.state.counterType === 'work') {
            bg = require('.././assets/images/5.jpg')
            order = 'Focus'
            buttonTheme = styles.mainButton
            buttonThemeText = styles.mainButtonText
        } else {
            bg = require('.././assets/images/1.jpg')
            order = 'Rest'
            buttonTheme = styles.mainButtonAlt
            buttonThemeText = styles.mainButtonTextAlt
        }

        if (this.state.counterRunning === true) {
            button = <TouchableOpacity style={buttonTheme} onPress={this.stopCounter}>
                <Text style={buttonThemeText}>Stop</Text>
            </TouchableOpacity>
        } else {
            button = <TouchableOpacity style={buttonTheme} onPress={this.startCounter}>
                <Text style={buttonThemeText}>Start</Text>
            </TouchableOpacity>
        }


        orderButton = <TouchableOpacity onPress={this.swapCounterType}>
            <Text style={styles.orderText}>{order}</Text>
        </TouchableOpacity>

        return (

            <ImageBackground source={bg} style={styles.bg}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}>
                    <View>
                        <TimerCounter
                            minutes={this.state.minutes}
                            seconds={this.state.seconds}
                            percentage={this.state.percentage}
                            counterType={this.state.counterType}
                        />
                    </View>
                    <View>
                        {orderButton}
                        <Text style={{color:'#9FA6C9'}}>Swap timer</Text>
                    </View>
                    <View style={styles.controllerContainer}>
                        <TimerController
                            workTimer={this.state.counterWork}
                            restTimer={this.state.counterRest}
                            counterType={this.state.counterType}
                            handleButtonPress={this.handleButtonPress}
                        />
                    </View>
                    <View style={styles.mainButtonContainer}>
                        {button}
                    </View>
                </ScrollView>
            </ImageBackground>

        );
    }
}


const
    styles = StyleSheet.create({
        container: {
            flex: 1,

        },
        contentContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center'
        },
        orderContainer: {
            alignItems: 'center',


        },

        codeHighlightContainer: {
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: 3,
            paddingHorizontal: 4,

        },
        tabBarInfoContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            ...Platform.select({
                ios: {
                    shadowColor: 'black',
                    shadowOffset: {width: 0, height: -3},
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                },
                android: {
                    elevation: 20,
                },
            }),
            alignItems: 'center',
            backgroundColor: '#272F50',
            paddingVertical: 20,
        },
        timerContainer: {
            alignItems: 'center',

        },
        flex: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'stretch',
            justifyContent: 'center',
        },

        bg: {
            flex: 1,
            resizeMode: 'stretch'
        },
        mainButtonContainer: {},
        mainButton: {
            backgroundColor: '#34B3FE',
            height: 50,

            justifyContent: 'center',
            borderRadius: 3,
            paddingVertical: 10,
            paddingHorizontal: 60
        },
        mainButtonAlt: {
            backgroundColor: '#C6FF82',
            height: 50,

            justifyContent: 'center',
            borderRadius: 3,
            paddingVertical: 10,
            paddingHorizontal: 60
        },
        mainButtonText: {
            color: '#E1E4F3',
            fontSize: 24,
            fontWeight: 'bold',
            alignSelf: 'center'
        },
        mainButtonTextAlt: {
            color: '#002601',
            fontSize: 24,
            fontWeight: 'bold',
            alignSelf: 'center'
        },
        orderText: {
            fontSize: 30,
            color: '#fff',
            fontWeight: 'bold',
        },
        controllerContainer: {
            alignItems: 'center',
            height: 130,
            width: '90%',
            alignSelf: 'center'
        },
        helpLink: {
            paddingVertical: 10,
        },
        helpLinkText: {
            fontSize: 14,
            color: '#b72c41',
        },
        developmentModeText: {
            marginBottom: 20,
            color: 'rgba(0,0,0,0.4)',
            fontSize: 14,
            lineHeight: 19,
            textAlign: 'center',
        },

        homeScreenFilename: {
            marginVertical: 7,
        },
        codeHighlightText: {
            color: 'rgba(96,100,109, 0.8)',
        },

        getStartedText: {
            fontSize: 17,
            color: 'rgba(96,100,109, 1)',
            lineHeight: 24,
            textAlign: 'center',
        },

        tabBarInfoText: {
            fontSize: 17,
            color: '#757FA1',
            textAlign: 'center',
        },
        navigationFilename: {
            marginTop: 5,
        },


    })

HomeScreen
    .navigationOptions = {
    headerStyle: {
        backgroundColor: 'transparent',
    },
    headerTitleStyle: {
        color: '#E1E4F3'
    },
    headerBackTitleStyle: {
        color: '#E1E4F3'
    },
    headerTransparent: true
};


export default HomeScreen;