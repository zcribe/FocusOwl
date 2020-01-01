import {Audio} from "expo-av";

export default async function playSound(sound) {
    // Sound playback management
    const soundObject = new Audio.Sound();

    if (sound === 'end') {
        try {
            await soundObject.loadAsync(require('../../assets/sounds/metronome.mp3'));
            await soundObject.playAsync();
        } catch (error) {
            // An error occurred!
        }
    } else if (sound === 'press') {
        try {
            await soundObject.loadAsync(require('../../assets/sounds/button2.wav'));
            await soundObject.playAsync();
        } catch (error) {
            // An error occurred!
        }
    }

};