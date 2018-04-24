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

            interface StandardRequest {
                request: Request;
                data: StandardData;
            }

            interface StandardData {
            }

            // region unique messages
            interface ClientHandshake extends StandardRequest {
                request: 'handshake';
                data: ClientHandshakeData;
            }

            interface ClientHandshakeData {
                sessionId: string;
                supports: Array<string>;
                timezone?: string;
            }

            interface ServerHandshake extends StandardRequest {
                request: 'handshake';
                data: ServerHandshakeData;
            }

            interface ServerHandshakeData {
                sessionId: string;
                retryWaitTime: number;
            }

            interface SubmitQuery extends StandardRequest {
                request: 'submit-query';
                data: StaMP.Protocol.Messages.StandardisedQueryMessage;
            }

            // endregion
            // region render messages
            interface Render extends StandardRequest {
                request: RenderRequest;
                data: RenderData;
            }

            interface RenderData {
                /**
                 * @deprecated in favor of the letter property
                 */
                messages: StaMP.Protocol.Letter;

                letter: StaMP.Protocol.Letter;
            }

            interface RenderMessages extends Render {
                request: 'render-messages';
            }

            interface RenderLetter extends Render {
                request: 'render-letter';
                letter: StaMP.Protocol.Letter;
            }

            // endregion
        }
    }
    // endregion
}
