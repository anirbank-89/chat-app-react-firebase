import React from 'react'

// Components
import Navbar from './Navbar';
import Search from "./ChatMemberSearch";
import Chats from "./Chats";

function ChatSidebar() {
  return (
    <div className='chat_sidebar'>
        <Navbar />
        <Search />
        <Chats />
    </div>
  )
}

export default ChatSidebar