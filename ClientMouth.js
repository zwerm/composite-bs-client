const PrefixedAudioContext = window.AudioContext || window.webkitAudioContext || null;

class ClientMouth {
    /**
     * Creates a new `ClientMouth` with the given `AudioContext`.
     *
     * If the `AudioContext` is null, then the `ClientMouth` will assume it's not supported,
     * and so ignore any requests made to it, rather than try and use the `AudioContext`.
     *
     * @param {?AudioContext} [audioContext=window.AudioContext ? new AudioContext() : null]
     */
    constructor(audioContext = PrefixedAudioContext ? new PrefixedAudioContext() : null) {
        /**
         * @type {?AudioContext}
         * @private
         */
        this._audioContext = audioContext;
        /**
         * @type {Array<AudioBufferSourceNode>}
         * @private
         */
        this._audioQueue = [];
    }

    shutup() {
        // stop all audio buffer source nodes so that none are playing
        this._audioQueue.forEach(audioBufferSourceNode => {
            audioBufferSourceNode.onended = () => {}; // clear the onended event, since we're bulk removing anyway

            try {
                audioBufferSourceNode.stop();
            } catch (ignore) {
                // we can't test if a source is actually playing, so it's best just to shotgun-call stop
            }
        });
        this._audioQueue.length = 0; // clear the array, since they can't be reused anyway
    }

    onSourceNodeEnded(event, resolve = null) {
        this._audioQueue = this._audioQueue.slice(1);

        if (this._audioQueue.length) { // if there's still a source in the queue, move the queue along
            this._audioQueue[0].start();
        }

        if (resolve) resolve();
    }

    /**
     * @param {{speech: Polly.SynthesizeSpeechOutput}} message
     *
     * @return {Promise} A promise that resolves when the source finishes playing or is stopped.
     *                    It's possible that a source is discarded before it's played, meaning this promise never resolves.
     *                    Because of this, it's best not to chain critical code on this promise.
     *                    Instead this promise is best used for minor cosmetic flair.
     */
    speakMessage(message) {
        if (!this._audioContext) {
            return Promise.resolve();
        }

        const source = this._audioContext.createBufferSource();
        this._audioQueue.push(source);

        return Promise
            .resolve(message.speech.AudioStream.data)
            .then(audioData => (new Uint8Array(audioData)).buffer)
            .then(buffer => this._audioContext.decodeAudioData(buffer))
            .then(decodedAudio => new Promise(resolve => {
                source.buffer = decodedAudio;

                source.connect(this._audioContext.destination);
                source.onended = (event) => this.onSourceNodeEnded(event, resolve);

                if (this._audioQueue.length) {
                    try {
                        this._audioQueue[0].start();
                    } catch (ignore) {
                        // we can't test if a source is actually playing, so it's best just to call start and ignore if it fails
                    }
                }
            }));
    }
}

module.exports = ClientMouth;
