import React, {useState} from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View, ImageBackground} from 'react-native';
import {Audio} from 'expo-av';


import TimerCounter from "../components/TimerCounter";
import TimerController from "../components/TimerController";

const addStyles = StyleSheet.create({
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
        marginTop: 20
    },
    mainButtonContainer: {
        marginTop: 30,
        flex: 1,
        alignItems: 'center',

    },
    mainButton: {
        backgroundColor:'#34B3FE',
        width: 200,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        borderRadius: 3,
    },
    mainButtonText: {
        color:'#E1E4F3',
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
    }
})

const ALLOWED_TIME_MIN = 1;
const ALLOWED_TIME_MAX = 999;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;
const PERCENTS_MAX = 100;
const VIBRATION_PATTERN = [100, 100, 100];


export default function HomeScreenBackup() {
    let button;

    const [timerIsRunning, setTimerIsRunning] = useState(false)
    const [timerState, setTimerState] = useState("work")
    const [timerId, setTimerId] = useState(null)

    const [timeLengthWork, setTimeLengthWork] = useState(25)
    const [timeLengthRest, setTimeLengthRest] = useState(5)

    const [percentTimerCompleted, setPercentTimerCompleted] = useState(0)
    const [timeLeftString, setTimeLeftString] = useState("25 : 00")


    const incrementWork = () => {
        let timeLeft = timeLengthWork;
        if (timeLeft < ALLOWED_TIME_MAX) {
            timeLeft += 1
            setTimeLengthWork(timeLeft)
            setTimeLeftString(`${timeLeft} : 00`)
        }
    }

    const decrementWork = () => {
        let timeLeft = timeLengthWork;
        if (timeLeft > ALLOWED_TIME_MIN) {
            timeLeft -= 1
            setTimeLengthWork(timeLeft)
            setTimeLeftString(`${timeLeft} : 00`)
        }
    }

    const incrementRest = () => {
        if (timeLengthRest < ALLOWED_TIME_MAX) {
            setTimeLengthRest(timeLengthRest + 1)
        }
    }

    const decrementRest = () => {
        if (timeLengthRest > ALLOWED_TIME_MIN) {
            setTimeLengthRest(timeLengthRest - 1)
        }
    }

    const playSound = async () => {
        const soundObject = new Audio.Sound();
        try {
            await soundObject.loadAsync(require('.././assets/sounds/metronome.mp3'));
            await soundObject.playAsync();
            // Your sound is playing!
        } catch (error) {
            // An error occurred!
        }

    }


    const stopTimer = () => {

        setTimerIsRunning(false)
        clearInterval(timerId)
        Vibration.vibrate(VIBRATION_PATTERN)
        playSound()

        if (timerState === 'work') {
            setTimeLeftString(`${timeLengthWork} : 00`)

        } else {
            setTimeLeftString(`${timeLengthRest} : 00`)

        }


    }

    const startTimer = () => {
        let duration, timeStatic, timeDynamic, coreTimer, minutes, seconds, minutes_str, seconds_str;

        // Swap between timer lengths
        if (timerState === 'work') {
            duration = timeLengthWork;
        } else {
            duration = timeLengthRest;
        }

        timeStatic = duration * SECONDS_IN_MINUTE;
        timeDynamic = duration * SECONDS_IN_MINUTE;

        setTimerIsRunning(true);
        coreTimer = setInterval(() => {

            setTimerId(coreTimer)

            // Split into minutes, seconds
            minutes = Math.floor(timeDynamic / SECONDS_IN_MINUTE)
            seconds = timeDynamic - minutes * SECONDS_IN_MINUTE

            // Time decrement
            timeDynamic -= 1

            // End conditions
            if (seconds < 0 && minutes < 0 || timeDynamic < 0) {
                console.log(
                    `
                    Durat: ${duration}-
                    -timeDynamic:${timeDynamic}-
                    -timerState:${timerState}-
                    -seconds:${seconds}-
                    -timerId:${timerId}-
                    `)
                // End old timer, start new
                if (timerState === 'work') {
                    setTimeLeftString(`${timeLengthWork} : 00`)
                    setTimerState('rest')
                } else {
                    setTimeLeftString(`${timeLengthRest} : 00`)
                    setTimerState('work')
                }
                stopTimer()
                startTimer()
            } else if (seconds === 0 && minutes > 0) {
                minutes -= 1
                seconds = 59
            } else {
                seconds -= 1
            }

            // Reporting
            minutes_str = minutes < 10 ? "0" + minutes : minutes;
            seconds_str = seconds < 10 ? "0" + seconds : seconds;

            setTimeLeftString(`${minutes_str} : ${seconds_str}`)
            setPercentTimerCompleted(PERCENTS_MAX - timeDynamic / timeStatic * PERCENTS_MAX)
        }, MILLISECONDS_IN_SECOND)

    }


    if (timerIsRunning) {
        button = <TouchableOpacity style={addStyles.mainButton} onPress={stopTimer}>
            <Text style={addStyles.mainButtonText}>Peata</Text>
        </TouchableOpacity>
    } else {
        button = <TouchableOpacity style={addStyles.mainButton} onPress={startTimer}>
            <Text style={addStyles.mainButtonText}>Alusta</Text>
        </TouchableOpacity>
    }

    return (

        <View style={styles.container}>
            <ImageBackground source={require('.././assets/images/5.jpg')} style={addStyles.bg}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}>

                <View style={styles.getStartedContainer}>
                    <TimerCounter
                        timeLeft={timeLeftString}
                        donePercent={percentTimerCompleted}
                    />
                </View>
                <View style={styles.welcomeContainer}>
                    <Text style={addStyles.welcomeText}>Keskendu</Text>
                </View>
                <View style={styles.helpContainer}>
                    <TimerController
                        workTimer={timeLengthWork}
                        restTimer={timeLengthRest}
                        incWork={incrementWork}
                        decWork={decrementWork}
                        incRest={incrementRest}
                        decRest={decrementRest}
                    />
                </View>
                <View style={addStyles.mainButtonContainer}>
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

HomeScreenBackup.navigationOptions = {
    header: null,
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 30,
        justifyContent: 'space-around'
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
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
    tabBarInfoText: {
        fontSize: 17,
        color: '#757FA1',
        textAlign: 'center',
    },
    navigationFilename: {
        marginTop: 5,
    },
    helpContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        fontSize: 14,
        color: '#b72c41',
    },

});
