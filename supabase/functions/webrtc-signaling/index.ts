
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join-room' | 'leave-room';
  roomId: string;
  userId: string;
  payload?: any;
}

// Armazenar conexões WebSocket por sala
const rooms = new Map<string, Set<WebSocket>>();

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let currentRoom: string | null = null;
  let currentUserId: string | null = null;

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onmessage = (event) => {
    try {
      const message: SignalingMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'join-room':
          currentRoom = message.roomId;
          currentUserId = message.userId;
          
          if (!rooms.has(currentRoom)) {
            rooms.set(currentRoom, new Set());
          }
          
          rooms.get(currentRoom)!.add(socket);
          
          // Notificar outros participantes
          broadcastToRoom(currentRoom, {
            type: 'user-joined',
            userId: currentUserId
          }, socket);
          
          break;

        case 'offer':
        case 'answer':
        case 'ice-candidate':
          // Repassar mensagem para outros participantes da sala
          if (currentRoom) {
            broadcastToRoom(currentRoom, message, socket);
          }
          break;

        case 'leave-room':
          if (currentRoom) {
            rooms.get(currentRoom)?.delete(socket);
            broadcastToRoom(currentRoom, {
              type: 'user-left',
              userId: currentUserId
            }, socket);
          }
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
    
    if (currentRoom) {
      rooms.get(currentRoom)?.delete(socket);
      broadcastToRoom(currentRoom, {
        type: 'user-left',
        userId: currentUserId
      }, socket);
      
      // Remover sala se estiver vazia
      if (rooms.get(currentRoom)?.size === 0) {
        rooms.delete(currentRoom);
      }
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return response;
});

function broadcastToRoom(roomId: string, message: any, excludeSocket?: WebSocket) {
  const roomSockets = rooms.get(roomId);
  
  if (roomSockets) {
    roomSockets.forEach(ws => {
      if (ws !== excludeSocket && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }
}
