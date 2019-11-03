import * as WebBrowser from 'expo-web-browser';
import React, {useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Vibration} from 'react-native';
import Timer from "../components/Timer";
import TimerController from "../components/TimerController";
// import {AdMobBanner} from "expo-ads-admob";

const addStyles = StyleSheet.create({
    flex: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    largeFont: {
        fontSize: 30,
        fontWeight: 'bold'
    }
})

const ALLOWED_TIME_MIN = 1;
const ALLOWED_TIME_MAX = 999;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_SECOND = 1000;
const PERCENTS_MAX = 100;
const VIBRATION_PATTERN = [1000, 2000, 3000];


export default function HomeScreen() {
    let button;

    const [timerIsRunning, setTimerIsRunning] = useState(false)
    const [timerState, setTimerState] = useState("work")
    const [timerId, setTimerId] = useState(0)

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

    const stopTimer = () => {
        setTimerIsRunning(false)
        clearInterval(timerId)
        if (timerState === 'work'){
            setTimeLeftString(`${timeLengthWork} : 00`)
        } else {
            setTimeLeftString(`${timeLengthRest} : 00`)
        }
    }

    const startTimer = () => {
        let duration;

        if (timerState === 'work') {
            duration = timeLengthWork;
        } else {
            duration = timeLengthRest;
        }

        let totalTime = duration * SECONDS_IN_MINUTE;
        let currentTime = duration * SECONDS_IN_MINUTE;
        let minutes, seconds, minutes_str, seconds_str;

        setTimerIsRunning(true);


        let timer = setInterval(() => {
            setTimerId(timer)

            minutes = Math.floor(currentTime / SECONDS_IN_MINUTE)
            seconds = currentTime - minutes * SECONDS_IN_MINUTE

            currentTime -= 1

            if (currentTime <= 0) {
                Vibration.vibrate(VIBRATION_PATTERN)
                if (timerState === "work") {
                    setTimerState("rest")
                    stopTimer()
                    startTimer()
                } else {
                    setTimerState("work")
                    stopTimer()
                    startTimer()
                }
            }

            console.log(currentTime)
            console.log(timerState)

            // Minute to second conversion
            if (seconds === 0 && currentTime > 0) {
                minutes -= 1
                seconds = 59
            } else {
                seconds -= 1
            }

            // Reporting
            minutes_str = minutes < 10 ? "0" + minutes : minutes;
            seconds_str = seconds < 10 ? "0" + seconds : seconds;

            setTimeLeftString(`${minutes_str} : ${seconds_str}`)
            setPercentTimerCompleted(PERCENTS_MAX - currentTime / totalTime * PERCENTS_MAX)


        }, MILLISECONDS_IN_SECOND)
    }



    if (timerIsRunning) {
        button = <TouchableOpacity style={addStyles.flex} onPress={stopTimer}>
            <Text style={addStyles.largeFont}>Peata</Text>
        </TouchableOpacity>
    } else {
        button = <TouchableOpacity style={addStyles.flex} onPress={startTimer}>
            <Text style={addStyles.largeFont}>Alusta</Text>
        </TouchableOpacity>
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}>
                <View style={styles.welcomeContainer}>
                    <Text>Keskendu!</Text>
                </View>

                <View style={styles.getStartedContainer}>
                    <Timer
                        timeLeft={timeLeftString}
                        donePercent={percentTimerCompleted}
                    />
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
                <View>
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
        </View>
    );
}

HomeScreen.navigationOptions = {
    header: null,
};

function DevelopmentModeNotice() {
    if (__DEV__) {
        const learnMoreButton = (
            <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
                Learn more
            </Text>
        );

        return (
            <Text style={styles.developmentModeText}>
                Development mode is enabled: your app will be slower but you can use
                useful development tools. {learnMoreButton}
            </Text>
        );
    } else {
        return (
            <Text style={styles.developmentModeText}>
                You are not in development mode: your app will run at full speed.
            </Text>
        );
    }
}

function handleLearnMorePress() {
    WebBrowser.openBrowserAsync(
        'https://docs.expo.io/versions/latest/workflow/development-mode/'
    );
}

function handleHelpPress() {
    WebBrowser.openBrowserAsync(
        'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
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
        color: '#2e78b7',
    },
});
