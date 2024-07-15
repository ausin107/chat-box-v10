'use client'
import { useRef, useState, useEffect } from 'react'

import Avatar from './Avatar'
import Typing from './Typing'

import runChat from '../config/gemini'

import handleFileToText from '../lib/handleFileToText'

const GetHistory = async () => {
  const response = await fetch('https://backend-chatbot-khkf.onrender.com/v1/api/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  })

  if (!response.ok) {
    console.error(response.text)
    return []
  }
  const responseData = await response.json()
  console.log(responseData.data)
  return responseData.data
}

const SaveHistory = async (dataSave) => {
  const response = await fetch('https://backend-chatbot-khkf.onrender.com/v1/api/history/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    body: JSON.stringify(dataSave),
  })

  if (!response.ok) {
    console.error(response.text)
  }
}

function ChatBox() {
  const [messages, setMessages] = useState([])
  const [typingMessage, setTypingMessage] = useState(null)
  const [input, setInput] = useState('')
  const [isShow, setSow] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [file, setFile] = useState('')
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isShowHistory, setShowHistory] = useState(false)
  const chatboxRef = useRef()
  const inputFileRef = useRef()
  const addFileRef = useRef()

  // get history from backend
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsLogin(false)
      return
    }
    setIsLogin(true)
    const handle = async () => {
      const history = await GetHistory()

      setMessages(history)
    }
    handle()
  }, [])

  const sendMessage = async () => {
    const supportSendMessage = async (text) => {
      setInput('')
      setMessages([...messages, { sender: 'user', text }])
      if (isLogin) {
        await SaveHistory({ sender: 'user', text })
      }
      setLoading(true)
    }

    const processResponse = async (inputText) => {
      const response = await runChat(inputText)
      setLoading(false)
      displayTypingEffect(response)
    }

    if (file) {
      const text = input + ' ' + file.name
      await supportSendMessage(text)
      const fileText = await handleFileToText(file)
      setFile('')
      await processResponse(input + ' "' + fileText + '"')
    } else if (input.trim()) {
      await supportSendMessage(input)
      await processResponse(input)
    }
  }
  const displayTypingEffect = (text) => {
    let index = 0
    setTypingMessage(text[0])
    const typingInterval = setInterval(async () => {
      setTypingMessage((prev) => prev + text[index])
      index++

      if (index === text.length) {
        clearInterval(typingInterval)
        setTypingMessage(null)
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text }])
        if (isLogin) {
          await SaveHistory({ sender: 'bot', text })
        }
      }
    }, 10)
  }
  const handleShowChatBox = () => {
    setSow(!isShow)
    !isShow ? chatboxRef.current.classList.add('active') : chatboxRef.current.classList.remove('active')
  }
  const handleSize = () => {
    setIsFullWidth(!isFullWidth)
    !isFullWidth ? chatboxRef.current.classList.add('full-width') : chatboxRef.current.classList.remove('full-width')
  }

  return (
    <>
      <div className='chatbox-icon-container' onClick={handleShowChatBox}>
        <img src='/bot.png' alt='Icon' className='chatbox-icon' />
      </div>
      <div ref={chatboxRef} className='chatbox'>
        <div className='chatbox-nav'>
          <div className='chatbox-history'>
            <svg
              onClick={() => setShowHistory(!isShowHistory)}
              viewBox='0 0 24 24'
              width={30}
              height={30}
              className='chatbot-nav-menu'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M4 6H20M4 12H20M4 18H20'
                stroke='#000000'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'></path>
            </svg>
          </div>
          <div className='chatbox-nav-text'>ChatGPT</div>
          <svg
            viewBox='0 0 24 24'
            onClick={handleSize}
            className='chatbox-nav-size'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z'
              fill='#000000'></path>
          </svg>
        </div>
        <div className='messages'>
          {messages.map((msg, index) =>
            msg.sender === 'bot' ? (
              <div key={index} className='message-wrapper'>
                <Avatar width='2.5rem' height='2.5rem' alignSelf='flex-start' margin='1rem 0 0 0' />
                <div className={`message ${msg.sender}`}>{msg.text}</div>
              </div>
            ) : (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            )
          )}
          {isLoading && (
            <div className='typing-box'>
              <Avatar width='3rem' alignSelf='flex-start' margin='0 1rem 0 0' />
              <Typing />
            </div>
          )}
          {typingMessage && (
            <div className='message-wrapper'>
              <Avatar width='3rem' alignSelf='flex-start' margin='1rem 0 0 0' />
              <div className='message bot' style={{ alignSelf: 'flex-start' }}>
                {typingMessage}
              </div>
            </div>
          )}
          {isShowHistory && (
            <div className='history-sidebar'>
              <div className='history-item'>
                <svg viewBox='0 0 24 24' width={20} height={20} fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M3 7.2C3 6.07989 3 5.51984 3.21799 5.09202C3.40973 4.71569 3.71569 4.40973 4.09202 4.21799C4.51984 4 5.0799 4 6.2 4H17.8C18.9201 4 19.4802 4 19.908 4.21799C20.2843 4.40973 20.5903 4.71569 20.782 5.09202C21 5.51984 21 6.0799 21 7.2V20L17.6757 18.3378C17.4237 18.2118 17.2977 18.1488 17.1656 18.1044C17.0484 18.065 16.9277 18.0365 16.8052 18.0193C16.6672 18 16.5263 18 16.2446 18H6.2C5.07989 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V7.2Z'
                    stroke='#000000'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'></path>
                </svg>
                <p className='history-item-text'>Test</p>
              </div>
            </div>
          )}
        </div>
        <div className='chatbox-input'>
          <div className='chat-footer'>
            <div className='chat-input-container'>
              {!!file && (
                <div className='chat-file-name-container'>
                  <div className='chat-file-name-text'>{file.name}</div>
                  <svg
                    className='remove-icon'
                    onClick={() => setFile('')}
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      id='Vector'
                      d='M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18'
                      stroke='#000000'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'></path>
                  </svg>
                </div>
              )}
              <div className='chat-input-main'>
                <input
                  className='chat-input'
                  type='text'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Message chat bot...'
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <div className='chat-file-container'>
                  <input
                    type='file'
                    className='inputfile'
                    accept='.pdf,.docx'
                    ref={inputFileRef}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <svg
                    ref={addFileRef}
                    onClick={() => inputFileRef.current.click()}
                    viewBox='0 0 24 24'
                    width={24}
                    height={24}
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M9 12H15'
                      stroke='#323232'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'></path>
                    <path
                      d='M12 9L12 15'
                      stroke='#323232'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'></path>
                    <path
                      d='M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
                      stroke='#323232'
                      strokeWidth='2'></path>
                  </svg>
                </div>
              </div>
            </div>
            <button onClick={sendMessage} className='chat-btn'>
              <img src='/send.png' alt='Icon' className='send-icon' />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatBox
