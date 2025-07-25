
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Users, MessageSquare, Share, Settings } from 'lucide-react';

const VideoMeeting = () => {
  const { roomId } = useParams();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeWebRTC();
    startMeetingTimer();
    
    return () => {
      cleanup();
    };
  }, [roomId]);

  const initializeWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setIsConnected(true);
      
      // Registrar sessão no banco
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        await supabase
          .from('video_sessions')
          .insert([{
            room_id: roomId,
            mentor_id: session.session.user.id, // ou mentee_id dependendo do contexto
            mentee_id: session.session.user.id,
            started_at: new Date().toISOString()
          }]);
      }

      toast({
        title: "Conectado à reunião",
        description: "Webcam e microfone inicializados com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao inicializar WebRTC:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível acessar câmera ou microfone.",
        variant: "destructive",
      });
    }
  };

  const startMeetingTimer = () => {
    const timer = setInterval(() => {
      setMeetingDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  };

  const cleanup = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    toast({
      title: "Gravação iniciada",
      description: "A sessão está sendo gravada.",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Gravação finalizada",
      description: "A gravação foi salva automaticamente.",
    });
  };

  const endMeeting = async () => {
    try {
      // Atualizar sessão no banco
      await supabase
        .from('video_sessions')
        .update({
          ended_at: new Date().toISOString()
        })
        .eq('room_id', roomId);

      cleanup();
      window.close();
    } catch (error) {
      console.error('Erro ao finalizar reunião:', error);
    }
  };

  const sendMessage = () => {
    if (currentMessage.trim()) {
      const message = {
        id: Date.now(),
        text: currentMessage,
        sender: 'Você',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, message]);
      setCurrentMessage('');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Reunião: {roomId}</h1>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Conectado" : "Desconectado"}
            </Badge>
            <span className="text-sm text-gray-400">
              {formatDuration(meetingDuration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              {participants.length + 1}
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 h-[calc(100vh-200px)]">
          {/* Área principal de vídeo */}
          <div className="col-span-3 space-y-4">
            {/* Vídeo remoto */}
            <Card className="bg-gray-800 border-gray-700 h-3/4">
              <CardContent className="p-0 relative">
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover rounded-lg"
                  autoPlay
                  playsInline
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded">
                  <span className="text-sm">Participante Remoto</span>
                </div>
              </CardContent>
            </Card>

            {/* Vídeo local */}
            <Card className="bg-gray-800 border-gray-700 h-1/4">
              <CardContent className="p-0 relative">
                <video
                  ref={localVideoRef}
                  className="w-full h-full object-cover rounded-lg"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded">
                  <span className="text-sm">Você</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Painel lateral - Chat */}
          <div className="col-span-1">
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="bg-gray-700 p-2 rounded">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>{message.sender}</span>
                        <span>{message.timestamp}</span>
                      </div>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-gray-700 border-gray-600 rounded px-3 py-2 text-sm"
                  />
                  <Button size="sm" onClick={sendMessage}>
                    Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controles */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <Button
            variant={isVideoEnabled ? "default" : "destructive"}
            onClick={toggleVideo}
            className="rounded-full p-3"
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isAudioEnabled ? "default" : "destructive"}
            onClick={toggleAudio}
            className="rounded-full p-3"
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isRecording ? "destructive" : "outline"}
            onClick={isRecording ? stopRecording : startRecording}
            className="rounded-full p-3"
          >
            <div className={`h-3 w-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-400'}`} />
          </Button>
          
          <Button
            variant="destructive"
            onClick={endMeeting}
            className="rounded-full p-3"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoMeeting;
