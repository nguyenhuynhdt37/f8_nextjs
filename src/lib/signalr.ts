import * as signalR from "@microsoft/signalr";


export async function startSignalRConnection(hubAddress: string) {
    const hubUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${hubAddress}`;

    const connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, { withCredentials: true })
        .withAutomaticReconnect()
        .build();

    try {
        await connection.start();
        console.log(`${hubAddress}, SignalR connected!`);
    } catch (err) {
        console.error(`${hubAddress}, SignalR connection failed: `, err);
    }

    return connection;
}


