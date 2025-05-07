import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    LogLevel,
} from "@microsoft/signalr";

const connections: Record<string, HubConnection> = {};

export async function createOrGetConnection(
    hubName: string
): Promise<HubConnection> {
    let conn = connections[hubName];
    if (!conn) {
        conn = new HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${hubName}`, {
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
        connections[hubName] = conn;
    }
    if (conn.state === HubConnectionState.Disconnected) {
        await conn.start();
    }
    return conn;
}
