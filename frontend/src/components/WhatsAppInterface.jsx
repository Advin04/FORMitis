import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { FiArrowLeft, FiUser, FiSend } from 'react-icons/fi';

const WhatsAppInterface = () => {
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // Jisse baat chal rahi hai
  const [chatHistory, setChatHistory] = useState({}); // { username: [msg1, msg2] }
  const [inputMessage, setInputMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);
  
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username') || "Unknown";
  const role = localStorage.getItem('role');

  // Naye message aane par screen neeche scroll karne ke liye
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, activeChat]);

  // 1. Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/users');
        // Khud ka naam contacts se hata dete hain
        setContacts(response.data.filter(user => user !== currentUser));
      } catch (err) {
        console.error("Failed to fetch contacts", err);
      }
    };
    fetchUsers();
  }, [currentUser]);

  // 2. Setup WebSocket
  useEffect(() => {
    const socket = new SockJS('http://localhost:8081/ws-chat');
    const client = Stomp.over(socket);
    client.debug = () => {}; 

    client.connect({}, () => {
      client.subscribe(`/topic/messages/${currentUser}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        
        // Naye message ko history me daalein
        setChatHistory(prevHistory => {
          const sender = receivedMessage.sender;
          const userHistory = prevHistory[sender] || [];
          return {
            ...prevHistory,
            [sender]: [...userHistory, receivedMessage]
          };
        });
      });
    });

    setStompClient(client);

    return () => {
      if (client) client.disconnect();
    };
  }, [currentUser]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && activeChat && stompClient) {
      const chatMessage = {
        sender: currentUser,
        recipient: activeChat, 
        content: inputMessage
      };

      stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
      
      // Apni screen par message turant dikhane ke liye
      setChatHistory(prevHistory => {
        const userHistory = prevHistory[activeChat] || [];
        return {
          ...prevHistory,
          [activeChat]: [...userHistory, chatMessage]
        };
      });
      
      setInputMessage('');
    }
  };

  const activeMessages = activeChat ? (chatHistory[activeChat] || []) : [];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', background: 'var(--bg)', color: 'white', zIndex: 9999, textAlign: 'left' }}>
      
      {/* Left Sidebar - Contacts List */}
      <div style={{ width: '350px', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.3)' }}>
        
        {/* Sidebar Header */}
        <div style={{ padding: '20px', background: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate(role === 'ADMIN' ? '/admin' : '/dashboard')} 
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <FiArrowLeft size={24} />
          </button>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Chats ({currentUser})</div>
        </div>

        {/* Contacts */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {contacts.map((contact, index) => (
            <div 
              key={index} 
              onClick={() => setActiveChat(contact)}
              style={{ 
                padding: '20px', 
                borderBottom: '1px solid var(--glass-border)', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                background: activeChat === contact ? 'rgba(147, 51, 234, 0.2)' : 'transparent',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FiUser size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{contact}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {chatHistory[contact] && chatHistory[contact].length > 0 
                    ? chatHistory[contact][chatHistory[contact].length - 1].content.substring(0, 20) + "..." 
                    : "Tap to chat"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Active Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.5)' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FiUser size={20} />
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{activeChat}</div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {activeMessages.map((msg, index) => (
                <div 
                  key={index} 
                  style={{ 
                    alignSelf: msg.sender === currentUser ? 'flex-end' : 'flex-start', 
                    background: msg.sender === currentUser ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)', 
                    padding: '12px 18px', 
                    borderRadius: msg.sender === currentUser ? '20px 20px 0 20px' : '20px 20px 20px 0', 
                    maxWidth: '60%',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ fontSize: '1rem', lineHeight: '1.4' }}>{msg.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={sendMessage} style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '15px', background: 'rgba(0,0,0,0.5)' }}>
              <input 
                type="text" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)} 
                placeholder={`Message ${activeChat}...`}
                style={{ flex: 1, padding: '15px 20px', borderRadius: '30px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', fontSize: '1rem' }}
              />
              <button 
                type="submit" 
                disabled={!inputMessage.trim()}
                style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', border: 'none', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: inputMessage.trim() ? 'pointer' : 'not-allowed', opacity: inputMessage.trim() ? 1 : 0.5 }}
              >
                <FiSend size={20} />
              </button>
            </form>
          </>
        ) : (
          /* Empty State (When no chat is selected) */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '30px', background: 'rgba(147, 51, 234, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', color: 'var(--primary)' }}>
              <FiUser size={60} />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Signal Chat for Desktop</h2>
            <p style={{ fontSize: '1.1rem' }}>Select a contact from the left menu to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppInterface;
