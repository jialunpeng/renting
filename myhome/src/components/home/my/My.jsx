import React from 'react'
import './My.css'
import { Button, Grid, Icon, Modal } from 'semantic-ui-react'
import AvatarEditor from 'react-avatar-editor'
class My extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      avatar: '',
      username: '',
      isShowSelect: false, // 是否显示选择图片的模态框
      isShowCrop: false, // 是否显示裁切图片的模态框
      avatarFile: ''
    }
  }
  // 显示选择图片的弹窗
  showSelect = () => {
    this.setState({
      isShowSelect: true
    })
  }

  // 显示裁切图片的弹窗
  showCrop = file => {
    // 1. 隐藏选择图片的弹窗
    // 2. 把上传到的图片保存起来
    //3. 显示裁切图片的弹窗
    this.setState({
      isShowSelect: false,
      avatarFile: file,
      isShowCrop: true
    })
  }

  // 关闭裁切模态框
  closeCrop = avatar => {
    this.setState({
      isShowCrop: false,
      avatar: avatar
    })
  }

  // 当组件挂载好了，发送ajax请求，获取到个人信息
  // 接口需要参数： user_id
  async componentDidMount() {
    let res = await this.axios.post('my/info', {
      user_id: localStorage.getItem('uid')
    })
    let { meta, data } = res
    if (meta.status === 200) {
      this.setState({
        avatar: data.avatar,
        username: data.username
      })
    }
  }

  render() {
    return (
      <div className="my-container">
        <SelectAvatar open={this.state.isShowSelect} showCrop={this.showCrop} />
        <CropAvatar
          open={this.state.isShowCrop}
          avatarFile={this.state.avatarFile}
          closeCrop={this.closeCrop}
        />
        <div className="my-title">
          <img src={'http://127.0.0.1:9999/public/my-bg.png'} alt="me" />
          <div className="info">
            <div className="myicon">
              {/* 给头像注册点击事件，显示选择头像的弹窗 */}
              <img
                src={this.state.avatar}
                alt="icon"
                onClick={this.showSelect}
              />
            </div>
            <div className="name">{this.state.username}</div>
            <Button color="green" size="mini">
              已认证
            </Button>
            <div className="edit">编辑个人资料</div>
          </div>
        </div>
        <Grid padded className="my-menu">
          <Grid.Row columns={3}>
            <Grid.Column>
              <Icon name="clock outline" size="big" />
              <div>看房记录</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="yen sign" size="big" />
              <div>我的订单</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="bookmark outline" size="big" />
              <div>我的收藏</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="user outline" size="big" />
              <div>个人资料</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="home" size="big" />
              <div>身份认证</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="microphone" size="big" />
              <div>联系我们</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className="my-ad">
          <img src={'http://127.0.0.1:9999/public/ad.png'} alt="" />
        </div>
      </div>
    )
  }
}
export default My

// 选择头像的弹窗组件
class SelectAvatar extends React.Component {
  constructor(props) {
    super(props)
    this.fileRef = React.createRef()
  }

  submitFile = () => {
    // 获取到上传的文件, 传递给父组件
    let file = this.fileRef.current.files[0]
    this.props.showCrop(file)
  }

  render() {
    let { open } = this.props
    return (
      <div>
        {/* 弹窗组件 */}
        <Modal size="small" open={open}>
          <Modal.Header>选择图片</Modal.Header>
          <Modal.Content>
            <input type="file" ref={this.fileRef} />
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="确定"
              onClick={this.submitFile}
            />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

// 裁切头像的弹窗组件
class CropAvatar extends React.Component {
  constructor() {
    super()
    this.state = {
      scale: 1
    }
  }

  handleScale = e => {
    this.setState({
      scale: e.target.value - 0
    })
  }

  // 设置编辑的ref
  setEditorRef = editor => (this.editor = editor)

  submitAvatar = async () => {
    // 发送ajax请求，上传裁切的图片
    //1. 如果获取到裁切后的图片
    let avatar = this.editor.getImageScaledToCanvas().toDataURL()
    // 2.发送ajax请求，修改图片了
    let res = await this.axios.post('my/avatar', {
      avatar: avatar
    })
    let { meta } = res
    if (meta.status === 200) {
      // 修改关闭模态框, 把裁切后的图片传给父组件，让父组件把图片修改
      this.props.closeCrop(avatar)
    }
  }
  render() {
    let { open, avatarFile } = this.props
    return (
      <div>
        <Modal size="small" open={open}>
          <Modal.Header>上传头像</Modal.Header>
          <Modal.Content>
            <AvatarEditor
              ref={this.setEditorRef}
              borderRadius={100}
              image={avatarFile}
              width={200}
              height={200}
              border={50}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={this.state.scale}
              rotate={0}
            />
            <div>
              <span className="avatar-zoom">缩放:</span>
              <input
                value={this.state.scale}
                onChange={this.handleScale}
                name="scale"
                type="range"
                min="1"
                max="2"
                step="0.01"
              />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="确定"
              onClick={this.submitAvatar}
            />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}
