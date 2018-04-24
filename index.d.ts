import { StaMP } from 'stamp';

export declare namespace BotSocket {
    // region namespace: Protocol
    namespace Protocol {
        namespace Messages {
            export type Request =
                'handshake'
                | 'submit-query'
                | 'render-messages'
                | 'render-letter'
                ;

            export type RenderRequest =
                'render-messages'
                | 'render-letter'
                ;

            abstract class Standard {
                request: Request;
                data: StandardData;
            }

            abstract class StandardData {
            }

            // region unique messages
            class ClientHandshake extends Standard {
                request: 'handshake';
                data: ClientHandshakeData;
            }

            class ClientHandshakeData {
                sessionId: string;
                supports: Array<string>;
                timezone?: string;
            }

            class ServerHandshake extends Standard {
                request: 'handshake';
                data: ServerHandshakeData;
            }

            class ServerHandshakeData {
                sessionId: string;
                retryWaitTime: number;
            }

            class SubmitQuery extends Standard {
                request: 'submit-query';
                data: StaMP.Protocol.Messages.StandardisedQueryMessage;
            }

            // endregion
            // region render messages
            class Render extends Standard {
                request: RenderRequest;
                data: RenderData;
            }

            class RenderData {
                /**
                 * @deprecated in favor of the letter property
                 */
                messages: StaMP.Protocol.Letter;

                letter: StaMP.Protocol.Letter;
            }

            class RenderMessages extends Render {
                request: 'render-messages';
            }

            class RenderLetter extends Render {
                request: 'render-letter';
                letter: StaMP.Protocol.Letter;
            }

            // endregion
        }
    }
    // endregion
}
