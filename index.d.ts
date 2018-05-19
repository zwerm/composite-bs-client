import { StaMP } from 'stamp';
import { EventEmitter } from 'events';

export declare namespace BotSocket {
    import MessagesRequestDataMap = BotSocket.Protocol.Messages.MessagesRequestDataMap;

    type StatusLevel =
        | 'info'
        | 'danger'
        | 'warning'
        | 'success'
        ;

    interface ClientSocket extends EventEmitter {
        connect();

        reconnect();

        close(code);

        sendMessageToServer<RequestType extends keyof MessagesRequestDataMap>(request: RequestType, data: MessagesRequestDataMap[RequestType]);
    }

    // region namespace: Protocol
    namespace Protocol {
        namespace Messages {
            interface MessagesRequestDataMap {
                'handshake': ClientHandshakeData,
                'submit-query': SubmitQueryData,
                'render-letter': RenderData
            }

            export type RequestType =
                | 'handshake'
                | 'submit-query'
                | 'render-messages'
                | 'render-letter'
                ;

            export type RenderRequest =
                'render-messages'
                | 'render-letter'
                ;

            interface RequestMessage {
                request: RequestType;
                data: StandardData;
            }

            interface StandardData {
            }

            // region unique messages
            interface ClientHandshake extends RequestMessage {
                request: 'handshake';
                data: ClientHandshakeData;
            }

            interface ClientHandshakeData {
                /**
                 * @deprecated in favor of clientId
                 */
                sessionId: string;
                clientId: string;
                supports: Array<string>;
                timezone?: string;
            }

            interface ServerHandshake extends RequestMessage {
                request: 'handshake';
                data: ServerHandshakeData;
            }

            interface ServerHandshakeData {
                /**
                 * @deprecated in favor of clientId
                 */
                sessionId: string;
                clientId: string;
                retryWaitTime: number;
            }

            interface SubmitQuery extends RequestMessage {
                request: 'submit-query';
                data: SubmitQueryData;
            }

            interface SubmitQueryData extends StaMP.Protocol.Messages.StandardisedQueryMessage {

            }

            // endregion
            // region render messages
            interface Render extends RequestMessage {
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
            }

            // endregion
        }
    }
    // endregion
}
