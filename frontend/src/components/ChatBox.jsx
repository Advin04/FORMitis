import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [targetUser, setTargetUser] = useState(''); // Naya: Kis se baat karni hai?
  const [stompClient, setStompClient] = useState(null);
  
  const currentUser = localStorage.getItem('username') || "Unknown"; 

  useEffect(() => {
    const socket = new SockJS('http://localhost:8081/ws-chat');
    const client = Stomp.over(socket);
    client.debug = () => {}; 

    client.connect({}, () => {
      // 3. Apna personal topic sunna shuru karein
      client.subscribe(`/topic/messages/${currentUser}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, receivedMessage]);
      });
    });

    setStompClient(client);

    return () => {
      if (client) client.disconnect();
    };
  }, [currentUser]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && targetUser.trim() && stompClient) {
      
      const chatMessage = {
        sender: currentUser,
        recipient: targetUser, 
        content: inputMessage
      };

      stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
      
      setMessages((prev) => [...prev, chatMessage]);
      setInputMessage('');
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '320px', background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', border: '1px solid var(--glass-border)', borderRadius: '16px', overflow: 'hidden', zIndex: 1000, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
      {/* Chat Header & Target Input */}
      <div style={{ padding: '15px', background: 'var(--primary)', color: 'white' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Real-Time Chat</div>
        <input 
          type="text" 
          value={targetUser} 
          onChange={(e) => setTargetUser(e.target.value)} 
          placeholder="Enter username to chat..." 
          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: 'none', color: 'black', outline: 'none' }}
        />
      </div>
      
      {/* Chat Messages */}
      <div style={{ height: '250px', padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ alignSelf: msg.sender === currentUser ? 'flex-end' : 'flex-start', background: msg.sender === currentUser ? 'rgba(147, 51, 234, 0.4)' : 'rgba(255, 255, 255, 0.1)', padding: '8px 12px', borderRadius: '12px', maxWidth: '85%' }}>
            <small style={{ fontSize: '10px', color: msg.sender === currentUser ? '#e9d5ff' : 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              {msg.sender === currentUser ? 'You' : msg.sender}
            </small>
            <div style={{ fontSize: '0.95rem' }}>{msg.content}</div>
          </div>
        ))}
      </div>
      
      {/* Chat Input form */}
      <form onSubmit={sendMessage} style={{ display: 'flex', borderTop: '1px solid var(--glass-border)', padding: '10px', gap: '5px' }}>
        <input 
          type="text" 
          value={inputMessage} 
          onChange={(e) => setInputMessage(e.target.value)} 
          placeholder="Type a message..." 
          disabled={!targetUser.trim()}
          style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', padding: '5px' }}
        />
        <button type="submit" disabled={!targetUser.trim()} style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: targetUser.trim() ? 'pointer' : 'not-allowed', fontWeight: '600', opacity: targetUser.trim() ? 1 : 0.5 }}>Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
