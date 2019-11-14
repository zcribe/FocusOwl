import React, {Component} from 'react';
import {ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View} from 'react-native';
import {Audio} from "expo-av";
import * as SQLite from 'expo-sqlite';

import TimerCounter from "../components/TimerCounter";
import TimerController from "../components/TimerController";

const ALLOWED_TIME_MIN = 1;
const ALLOWED_TIME_MAX = 99;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;
const PERCENTS_MAX = 100;
const VIBRATION_PATTERN = [100, 100, 100];
const COUNTER_WORK_SECONDS = 25 * 60;
const COUNTER_REST_SECONDS = 5 * 60;
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
            counterWork: 25,
            counterRest: 5,
            minutes: '25',
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
        this.incWork = this.incWork.bind(this);
        this.incRest = this.incRest.bind(this);
        this.decWork = this.decWork.bind(this);
        this.decRest = this.decRest.bind(this);
        this.createDaysEntry = this.createDaysEntry.bind(this);
        this.createSessionEntry = this.createSessionEntry.bind(this);
        this.updateDayEntry = this.updateDayEntry.bind(this);
    }

    componentDidMount() {
        this.createDaysEntry()
    }



    startCounter() {
        let timer = setInterval(this.tick, MILLISECONDS_IN_SECOND);
        this.setState({timer, counterRunning: true});
    }

    controlCounter() {
        // End condition
        if (this.state.counter >= this.state.counterMax) {
            this.stopCounter(true);
            this.swapCounterType();
            this.startCounter();
        }
    };


    stopCounter(swapState = false) {
        // State change
        clearInterval(this.state.timer);
        this.setState({counter: 0, counterRunning: false});

        // Create record
        this.createSessionEntry();
        // Update days entry
        this.updateDayEntry();

        // Effects
        Vibration.vibrate(VIBRATION_PATTERN);
        this.playSound('end');
    };

    swapCounterType() {
        let timerState = this.state.counterType;

        if (timerState === 'work') {
            this.setState({
                counterType: 'rest',
                counterMax: this.state.counterRest * SECONDS_IN_MINUTE
            })
        } else if (timerState === 'rest') {
            this.setState({
                counterType: 'work',
                counterMax: this.state.counterWork * SECONDS_IN_MINUTE
            })
        }

        this.granulateTime()
    }

    async playSound(sound) {
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
                await soundObject.loadAsync(require('.././assets/sounds/press.mp3'));
                await soundObject.playAsync();
            } catch (error) {
                // An error occurred!
            }
        }

    };

    tick = () => {
        this.setState({
            counter: this.state.counter + 1
        });
        this.controlCounter();
        this.granulateTime();
        this.percentLeft();

    };


    incWork() {
        if (this.state.counterWork < ALLOWED_TIME_MAX && this.state.counterType === 'work') {
            this.setState((prevState, props) => ({
                counterWork: prevState.counterWork + 1,
                counterMax: prevState.counterMax + SECONDS_IN_MINUTE,

            }))
        } else if (this.state.counterWork < ALLOWED_TIME_MAX) {
            this.setState((prevState, props) => ({
                counterWork: prevState.counterWork + 1,

            }))
        }
        this.granulateTime();
        this.playSound('press')
    };

    decWork() {
        if (this.state.counterWork > ALLOWED_TIME_MIN && this.state.counterType === 'work') {
            this.setState((prevState, props) => ({
                counterWork: prevState.counterWork - 1,
                counterMax: prevState.counterMax - SECONDS_IN_MINUTE,

            }))
        } else if (this.state.counterWork > ALLOWED_TIME_MIN) {
            this.setState((prevState, props) => ({
                counterWork: prevState.counterWork - 1,

            }))
        }
        this.granulateTime()
        this.playSound('press')
    };

    incRest() {
        if (this.state.counterRest < ALLOWED_TIME_MAX && this.state.counterType === 'rest') {
            this.setState((prevState, props) => ({
                counterRest: prevState.counterRest + 1,
                counterMax: prevState.counterMax + SECONDS_IN_MINUTE,

            }));
            this.granulateTime()
        } else if (this.state.counterRest < ALLOWED_TIME_MAX) {
            this.setState((prevState, props) => ({
                counterRest: prevState.counterRest + 1,

            }))
        }
        this.granulateTime()
        this.playSound('press')
    };

    decRest() {
        if (this.state.counterRest > ALLOWED_TIME_MIN && this.state.counterType === 'rest') {
            this.setState((prevState, props) => ({
                counterRest: prevState.counterRest - 1,
                counterMax: prevState.counterMax - SECONDS_IN_MINUTE,

            }))
        } else if (this.state.counterRest > ALLOWED_TIME_MIN) {
            this.setState((prevState, props) => ({
                counterRest: prevState.counterRest - 1,

            }))
        }
        this.granulateTime()
        this.playSound('press')
    };

    granulateTime() {
        let time, minutes, seconds;

        time = this.state.counterMax - this.state.counter;

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
        this.setState({percentage: this.state.counter / this.state.counterMax * PERCENTS_MAX})
    }

    createDaysEntry() {
        DB.transaction(tx => {
            tx.executeSql(`
                INSERT INTO days
                VALUES (DATE('now'), ?, ?, ?, ?)`, [0, 0, 0, 0])
        })
    }

    createSessionEntry() {
        let length, type;

        type = this.state.counterType;

        if (type === 'work') {
            length = this.state.counterWork
        } else {
            length = this.state.counterRest
        }

        DB.transaction(
            tx => {
                tx.executeSql(`
                    INSERT INTO sessions
                    VALUES (DATE('now'), ?, ?)`, [type, length])
            }
        )
    }

    updateDayEntry() {
        let minutes, type;

        type = this.state.counterType;

        if (type === 'work') {
            minutes = this.state.counterWork;
            DB.transaction(
                tx => {
                    tx.executeSql(`
                        UPDATE days
                        SET workMinutes = workMinutes + ?,
                            workCount   = workCount + 1
                        WHERE DATE = DATE('now')`, [minutes])
                }
            )
        } else {
            minutes = this.state.counterRest
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


    render() {
        let button, bg, order, buttonTheme, buttonThemeText, orderButton;


        if (this.state.counterType === 'work') {
            bg = require('.././assets/images/5.jpg')
            order = 'Keskendu'
            buttonTheme = styles.mainButton
            buttonThemeText = styles.mainButtonText
        } else {
            bg = require('.././assets/images/1.jpg')
            order = 'Puhka'
            buttonTheme = styles.mainButtonAlt
            buttonThemeText = styles.mainButtonTextAlt
        }

        if (this.state.counterRunning === true) {
            button = <TouchableOpacity style={buttonTheme} onPress={this.stopCounter}>
                <Text style={buttonThemeText}>Peata</Text>
            </TouchableOpacity>
        } else {
            button = <TouchableOpacity style={buttonTheme} onPress={this.startCounter}>
                <Text style={buttonThemeText}>Alusta</Text>
            </TouchableOpacity>
        }

        if (this.state.counterType === 'work') {
            orderButton = <TouchableOpacity  onPress={this.swapCounterType}>
                <Text style={styles.orderText}>{order}</Text>
            </TouchableOpacity>
        } else {
            orderButton = <TouchableOpacity  onPress={this.swapCounterType}>
                <Text style={styles.orderText}>{order}</Text>
            </TouchableOpacity>
        }

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
                    </View>
                    <View style={styles.controllerContainer}>
                        <TimerController
                            workTimer={this.state.counterWork}
                            restTimer={this.state.counterRest}
                            counterType={this.state.counterType}
                            incWork={this.incWork}
                            decWork={this.decWork}
                            incRest={this.incRest}
                            decRest={this.decRest}
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