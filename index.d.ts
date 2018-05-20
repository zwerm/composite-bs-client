import { EventEmitter } from 'events';
import { StaMP } from '@stampit/stamp';

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
                'render-letter': RenderLetterData
            }

            export type RequestType =
                | 'handshake'
                | 'submit-query'
                | 'render-letter'
                ;

            interface RequestMessage {
                request: RequestType;
                data: RequestData;
            }

            interface RequestData {
            }

            // region ClientHandshake
            interface ClientHandshake extends RequestMessage {
                request: 'handshake';
                data: ClientHandshakeData;
            }

            interface ClientHandshakeData {
                /**
                 * @deprecated in favor of userId
                 */
                sessionId: string;
                /**
                 * @deprecated in favor of userId
                 */
                clientId: string;
                userId: string;
                timezone?: string;
            }

            // endregion
            // region ServerHandshake
            interface ServerHandshake extends RequestMessage {
                request: 'handshake';
                data: ServerHandshakeData;
            }

            interface ServerHandshakeData {
                /**
                 * @deprecated in favor of userId
                 */
                sessionId: string;
                /**
                 * @deprecated in favor of userId
                 */
                clientId: string;
                userId: string;
                retryWaitTime: number;
            }

            // endregion
            // region SubmitQuery
            interface SubmitQuery extends RequestMessage {
                request: 'submit-query';
                data: SubmitQueryData;
            }

            interface SubmitQueryData extends StaMP.Protocol.Messages.StandardisedQueryMessage {

            }

            // endregion
            // region RenderLetter
            interface RenderLetter extends RequestMessage {
                request: 'render-letter';

                data: RenderLetterData;
            }

            interface RenderLetterData extends RequestData {
                /**
                 * @deprecated in favor of the letter property
                 */
                messages: StaMP.Protocol.Letter;

                letter: StaMP.Protocol.Letter;
            }

            // endregion
        }
    }
    // endregion
}
