import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(81, {
  cors: {
    origin: "*", // whitelist
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor() {}

  afterInit(server: any) {
    // throw new Error("Method not implemented.");
    console.log("Esto se ejecuta cuando inicia el servicio.....");
  }

  handleConnection(client: any, ...args: any[]) {
    // throw new Error("Method not implemented.");
    console.log("Esto se ejecuta cuando alguien se conecta al socket.....");
  }

  handleDisconnect(client: any) {
    // throw new Error("Method not implemented.");
    console.log("Esto se ejecuta cuando alguien se desconecta al socket..... ");
  }

  @SubscribeMessage("event_join")
  handleJoinRoom(client: Socket, room: string) {
    console.log(`room_${room}`);
  }

  @SubscribeMessage("event_message")
  handleIncommingMessage(
    client: Socket,
    payload: { room: string; message: string }
  ) {
    const { room, message } = payload;
    console.log(payload);
    this.server.to(`room_${room}`).emit('new_message', message);
  }

  @SubscribeMessage("event_leave")
  handleRoomLeave(client: Socket, room: string) {
    console.log(`room_${room}`);
    client.leave(`room_${room}`);
  }

}
