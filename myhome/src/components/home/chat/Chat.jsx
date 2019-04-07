import React from 'react'
import './Chat.css'
import moment from 'moment'
import ChatWindow from './ChatWindow'
class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      isShow: false,
      chatInfo: {}
    }
  }

  async componentDidMount() {
    let res = await this.axios.post('chats/list')
    let { meta, data } = res
    if (meta.status === 200) {
      this.setState({
        list: data.list
      })
    }
  }

  toChat = item => {
    // console.log(item)
    this.setState({
      isShow: true,
      chatInfo: {
        from_user: item.from_user,
        to_user: item.to_user,
        avatar: item.avatar,
        username: item.username
      }
    })
  }

  closeWindow = () => {
    this.setState({
      isShow: false
    })
  }

  render() {
    return (
      <div className="chat-container">
        {this.state.isShow && (
          <ChatWindow
            closeWindow={this.closeWindow}
            chatInfo={this.state.chatInfo}
          />
        )}
        <div className="chat-title">聊天</div>
        <div className="chat-list">
          <ul>
            {this.state.list.map(item => (
              <li key={item.id} onClick={this.toChat.bind(this, item)}>
                <div className="avarter">
                  <img src={item.avatar} alt="avarter" />
                  <span className="name">{item.username}</span>
                  <span className="info">{item.chat_msg}</span>
                  <span className="time">
                    {moment(item.ctime).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
export default Chat
