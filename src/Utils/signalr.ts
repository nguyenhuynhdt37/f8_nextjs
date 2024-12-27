import * as signalR from '@microsoft/signalr';

const connectToSignalR = async () => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/commentHub`) // Đường dẫn tới SignalR Hub
    .withAutomaticReconnect() // Tự động kết nối lại nếu mất kết nối
    .configureLogging(signalR.LogLevel.Information) // Log thông tin khi debug
    .build();

  try {
    await connection.start();
    console.log('SignalR connected!');
  } catch (err) {
    console.error('SignalR connection failed: ', err);
  }

  // Lắng nghe sự kiện từ server
  connection.on('ReceiveComment', comment => {
    console.log('Received new comment: ', comment);
  });

  return connection;
};

export default connectToSignalR;
