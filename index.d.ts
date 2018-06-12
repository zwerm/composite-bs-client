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
                'submit-event': SubmitEventData,
                'render-letter': RenderLetterData
            }

            export type RequestType =
                | 'handshake'
                | 'submit-query'
                | 'submit-event'
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

            /**
             * Data provided by the client in it's handshake requests.
             */
            interface ClientHandshakeData {
                /**
                 * @deprecated in favor of userId
                 */
                sessionId: string;
                /**
                 * @deprecated in favor of userId
                 */
                clientId: string;
                /**
                 * The id of the user that the client *wants* to
                 * represent when sending messages to the server.
                 */
                userId: string;
                /**
                 * The timezone that the client is operating in.
                 */
                timezone?: string;
            }

            // endregion
            // region ServerHandshake
            interface ServerHandshake extends RequestMessage {
                request: 'handshake';
                data: ServerHandshakeData;
            }

            /**
             * Data provided by the server in it's handshake requests.
             */
            interface ServerHandshakeData {
                /**
                 * The id of the user that the server *says* the client
                 * represents when sending messages to the server.
                 */
                userId: string;
                /**
                 * How long (in seconds) the server thinks that the
                 * client should wait before trying to reconnect,
                 * whenever the server disconnects the client.
                 */
                retryWaitTime: number;
                /**
                 * The id of the connection that handles this clients
                 * interactions with the server.
                 */
                connectionId: string;
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
            // region SubmitEvent
            interface SubmitEvent<PayloadData extends object, DataData extends object | StaMP.Protocol.Messages.StandardisedEventMessageData> extends RequestMessage {
                request: 'submit-event';
                data: SubmitEventData<PayloadData, DataData>;
            }

            interface SubmitEventData<PayloadData extends object, DataData extends object | StaMP.Protocol.Messages.StandardisedEventMessageData> extends StaMP.Protocol.Messages.StandardisedEventMessage<PayloadData, DataData> {

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
