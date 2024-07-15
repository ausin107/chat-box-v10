import ChatBox from '../components/ChatBox'
import Navbar from '../components/Navbar'

function App() {
  return (
    <div className='App' style={{ overflow: 'hidden' }}>
      <Navbar />
      <main className='container'>
        <div className='header'>
          Chatbox with
          <span style={{ color: '#ff9900' }}> ChatGPT</span>
        </div>
        <ChatBox />
      </main>
    </div>
  )
}

export default App
