import React, {Component} from 'react';
import {ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View} from 'react-native';

import TimerCounter from "../components/TimerCounter";
import TimerController from "../components/TimerController";
import {Audio} from "expo-av";

const ALLOWED_TIME_MIN = 1;
const ALLOWED_TIME_MAX = 999;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;
const PERCENTS_MAX = 100;
const VIBRATION_PATTERN = [100, 100, 100];
const COUNTER_WORK_SECONDS = 25 * 60;
const COUNTER_REST_SECONDS = 5 * 60;

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
            minutes: 25,
            seconds: '00',
            percentage: 0
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
    }



    startCounter() {
        let timer = setInterval(this.tick, MILLISECONDS_IN_SECOND);
        this.setState({timer,counterRunning:true})
    }

    controlCounter() {
        // End condition
        if (this.state.counter >= this.state.counterMax) {
            this.stopCounter(true);
            this.startCounter();
        }
    };


    stopCounter(swapState = false) {
        // State change
        clearInterval(this.state.timer);
        this.setState({counter: 0, counterRunning:false});

        if (swapState === true) {
            this.swapCounterType();
        }

        // Effects
        Vibration.vibrate(VIBRATION_PATTERN);
        this.playSound();
    };

    swapCounterType() {
        let timerState = this.state.timerState;

        if (timerState === 'work') {
            this.setState({timerState: 'rest'})
        } else if (timerState === 'rest') {
            this.setState({timerState: 'work'})
        }

    }

    async playSound() {
        const soundObject = new Audio.Sound();
        try {
            await soundObject.loadAsync(require('.././assets/sounds/metronome.mp3'));
            await soundObject.playAsync();
            // Your sound is playing!
        } catch (error) {
            // An error occurred!
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
    // TODO Handle changing it while running

    incWork() {
        if (this.state.counterWork < 99 && this.state.counterType === 'work') {
            this.setState((prevState, props) => ({
                counterWork: prevState.counterWork + 1,
                counterMax: prevState.counterMax + 60,
                minutes: prevState.minutes + 1
            }))
        } else if (this.state.counterWork < 99){
            this.setState((prevState, props) => ({
                counterWork: prevState.counterWork + 1,
                minutes: prevState.minutes + 1
            }))
        }
        this.granulateTime()
    };

    decWork() {
        if (this.state.counterWork > 1 && this.state.counterType === 'work') {
            this.setState((prevState, props) => ({
                counterWork: prevState.counterWork - 1,
                counterMax: prevState.counterMax - 60,
                minutes: prevState.minutes - 1
            }))
        } else if (this.state.counterWork > 1){
            this.setState((prevState, props) => ({
                counterWork: prevState.counterWork - 1,
                minutes: prevState.minutes - 1
            }))
        }
        this.granulateTime()
    };

    incRest() {
        if (this.state.counterRest < 99 && this.state.counterType === 'rest') {
            this.setState((prevState, props) => ({
                counterRest: prevState.counterRest + 1,
                counterMax: prevState.counterMax + 60,
                minutes: prevState.minutes + 1
            }))
        } else if (this.state.counterRest < 99){
            this.setState((prevState, props) => ({
                counterRest: prevState.counterRest + 1,
                minutes: prevState.minutes + 1
            }))
        }
        this.granulateTime()
    };

    decRest() {
        if (this.state.counterRest > 1 && this.state.counterType === 'rest') {
            this.setState((prevState, props) => ({
                counterRest: prevState.counterRest - 1,
                counterMax: prevState.counterMax - 60,
                minutes: prevState.minutes - 1
            }))
        } else if (this.state.counterRest > 1){
            this.setState((prevState, props) => ({
                counterRest: prevState.counterRest - 1,
                minutes: prevState.minutes - 1
            }))
        }
        this.granulateTime()
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




    render() {
        let button, bg;

        if (this.state.counterRunning === true) {
            button = <TouchableOpacity style={styles.mainButton} onPress={this.stopCounter}>
                <Text style={styles.mainButtonText}>Peata</Text>
            </TouchableOpacity>
        } else {
            button = <TouchableOpacity style={styles.mainButton} onPress={this.startCounter}>
                <Text style={styles.mainButtonText}>Alusta</Text>
            </TouchableOpacity>
        }

        if (this.state.counterType === 'work'){
            bg = require('.././assets/images/5.jpg')
        } else {
            bg = require('.././assets/images/1.jpg')
        }

        return (
            <View style={styles.container}>
                <ImageBackground source={bg} style={styles.bg}>
                    <ScrollView
                        style={styles.container}
                        contentContainerStyle={styles.contentContainer}>
                        <View style={styles.getStartedContainer}>
                            <TimerCounter
                                minutes={this.state.minutes}
                                seconds={this.state.seconds}
                                percentage={this.state.percentage}
                            />
                        </View>
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcomeText}>Keskendu</Text>
                        </View>
                        <View style={styles.helpContainer}>
                            <TimerController
                                workTimer={this.state.counterWork}
                                restTimer={this.state.counterRest}
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

                    <View style={styles.tabBarInfoContainer}>
                        {/*<AdMobBanner*/}
                        {/*    adUnitID="ca-app-pub-3940256099942544/6300978111"*/}
                        {/*    onAdViewWillLeaveApplication={()=>({})}*/}
                        {/*    onAdViewWillPresentScreen={()=>({})}*/}
                        {/*    onAdViewDidReceiveAd={()=>({})}*/}
                        {/*    onAdViewDidDismissScreen={()=>({})}*/}
                        {/*    onDidFailToReceiveAdWithError={()=>({})}*/}
                        {/*    onAdViewWillDismissScreen={()=>({})}*/}
                        {/*    servePersonalizedAds={false}*/}
                        {/*    additionalRequestParams={()=>({})}*/}
                        {/*    testDeviceID="EMULATOR"/>*/}
                    </View>
                </ImageBackground>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 10,
        justifyContent: 'space-around'
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
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
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    flex: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
    },

    bg: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainButtonContainer: {
        marginTop: 10,
        flex: 1,
        alignItems: 'center',

    },
    mainButton: {
        backgroundColor: '#34B3FE',
        width: 200,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        borderRadius: 3,
    },
    mainButtonText: {
        color: '#E1E4F3',
        fontSize: 24,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10
    },
    welcomeText: {
        fontSize: 30,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 20
    },
    helpContainer: {
        marginTop: 10,
        alignItems: 'center',
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


export default HomeScreen;