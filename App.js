import {AppLoading} from 'expo';
import * as Font from 'expo-font';
import React, {useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import * as Sentry from 'sentry-expo';
import {Ionicons} from "@expo/vector-icons";
import Constants from 'expo-constants';

import AppNavigator from './navigation/AppNavigator';

Sentry.init({
    dsn: 'https://e2db542092f34f62992911184e6400dc@sentry.io/1852330',
    enableInExpoDevelopment: true,
    debug: true
});
Sentry.setRelease(Constants.manifest.revisionId);



export default function App(props) {



    const [isLoadingComplete, setLoadingComplete] = useState(false);

    if (!isLoadingComplete && !props.skipLoadingScreen) {
        return (
            <AppLoading
                startAsync={loadResourcesAsync}
                onError={handleLoadingError}
                onFinish={() => handleFinishLoading(setLoadingComplete)}
            />
        );
    } else {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#1A2640"/>
                <AppNavigator/>
            </View>
        );
    }
}

async function loadResourcesAsync() {
    await Promise.all([
        Font.loadAsync({
            'space-mono': require('./assets/fonts/IBMPlexSans-Regular.ttf'),
            ...Ionicons.font
        }),
    ]);
}

function handleLoadingError(error) {
    // In this case, you might want to report the error to your error reporting
    // service, for example Sentry
    console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
    setLoadingComplete(true);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A2640',
    },
    bg: {
        flex: 1,
        resizeMode: 'cover'
    },
});
