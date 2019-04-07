import React from 'react'
import { Icon, Form, Button, TextArea } from 'semantic-ui-react'
import './ChatWindow.css'
import handle from './wsmain'
class ChatWindow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      client: '',
      msgContent: '',
      fromAvatar: ''
    }
  }

  getChatList = async () => {
    // 发送ajax请求，获取聊天数据
    let res = await this.axios.post('chats/info', {
      from_user: this.props.chatInfo.from_user,
      to_user: this.props.chatInfo.to_user
    })
    let { meta, data } = res
    if (meta.status === 200) {
      this.setState({
        list: data.list
      })
    }
  }

  // 聊天窗口组件挂载的时候，获取聊天列表信息
  async componentDidMount() {
    // 获取当前用户的头像
    let res = await this.axios.post('my/info', {
      user_id: localStorage.getItem('uid')
    })
    let { meta, data } = res
    if (meta.status === 200) {
      // 通过websocket连接服务器，得到client对象
      let currentUser = localStorage.getItem('uid') - 0
      // 参数1： 连接聊天服务器的id
      // 参数2： 回调函数，服务器每次给发送的消息，都在data中
      // 返回值：client对象
      let client = handle(currentUser, data => {
        // 该回调函数用来处理服务器返回的消息（其实就是对方发送消息）
        // 其实就是接收对方返回的消息
        let newData = JSON.parse(data.content)
        let newList = [...this.state.list, newData]
        this.setState({
          list: newList
        })
      })
      this.setState({
        client: client,
        avatar: data.avatar
      })
    }
    this.getChatList()
  }

  // 给服务器发送数据
  sendMsg = () => {
    // 给服务器发送的数据包含：
    // from_user: 从谁发
    // to_user： 给谁发
    // this.state.msgContent: 发送的内容

    let pdata = {
      id: new Date().getTime(),
      from_user: this.props.chatInfo.from_user,
      to_user: this.props.chatInfo.to_user,
      chat_msg: this.state.msgContent,
      avatar: this.state.avatar
    }
    // 把消息发送出去
    this.state.client.emitEvent('msg_text_send', JSON.stringify(pdata))
    // 重新渲染聊天列表
    let newList = [...this.state.list, pdata]
    this.setState({
      list: newList,
      msgContent: ''
    })
  }

  handleChange = e => {
    this.setState({
      msgContent: e.target.value
    })
  }
  render() {
    let currentUser = localStorage.getItem('uid') - 0
    return (
      <div className="chat-window">
        <div className="chat-window-title">
          <Icon
            onClick={this.props.closeWindow}
            name="angle left"
            className="chat-ret-btn"
            size="large"
          />
          <span>{this.props.chatInfo.username}</span>
        </div>
        <div className="chat-window-content">
          <ul>
            {this.state.list.map(item => (
              // 通过currentUser与from_user去比较
              <li
                key={item.id}
                className={
                  currentUser === item.from_user
                    ? 'chat-info-right'
                    : 'chat-info-left'
                }
              >
                {/* 这个头像显示是错误 */}
                <img src={item.avatar} alt="" />
                <span>{item.chat_msg}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-window-input">
          <Form>
            <TextArea
              placeholder="请输入内容..."
              value={this.state.msgContent}
              onChange={this.handleChange}
            />
            <Button onClick={this.props.closeWindow}>关闭</Button>
            <Button primary onClick={this.sendMsg}>
              发送
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default ChatWindow
