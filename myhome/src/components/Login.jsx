import React from 'react'
// 引入semanticui的组件
import { Form } from 'semantic-ui-react'
// 引入Login.css样式
import './Login.css'

// 引入withRouter实现编程式导航
import { withRouter } from 'react-router-dom'

class Login extends React.Component {
  // 构造函数
  constructor(props) {
    super(props)
    this.state = {
      uname: '',
      pwd: ''
    }
  }

  // 用于处理受控组件
  handleChange = e => {
    let { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  // 登录功能
  login = async e => {
    e.preventDefault()
    let { history } = this.props
    // 发送请求
    let { uname, pwd } = this.state
    // await必须在async函数中使用，await可以在promise对象前面使用
    // await会暂停aysnc函数的执行，等待promise的结果，才会继续async函数的执行
    let res = await this.axios.post('users/login', {
      uname,
      pwd
    })
    let { meta, data } = res
    if (meta.status === 200) {
      //1. 把token给保存到浏览器本地
      localStorage.setItem('myToken', data.token)
      //2. 把userid存储起来
      localStorage.setItem('uid', data.uid)
      //3. 跳转到home组件
      history.push('/home')
    } else {
      console.log(meta.msg)
    }
  }

  // 组件的渲染方法
  render() {
    return (
      <div className="login_container">
        <div className="login_title">登录</div>
        <div className="login_form">
          {/* Form:表示整个表单组件 */}
          {/* Form.Field：表示表单的一个字段 */}
          <Form action="" onSubmit={this.login}>
            <Form.Field>
              <Form.Input
                size="big"
                icon="user"
                iconPosition="left"
                placeholder="请输入用户名..."
                name="uname"
                autoComplete="off"
                value={this.state.uname}
                onChange={this.handleChange}
                required
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                size="big"
                icon="lock"
                iconPosition="left"
                placeholder="请输入密码..."
                name="pwd"
                autoComplete="off"
                value={this.state.pwd}
                onChange={this.handleChange}
                required
              />
            </Form.Field>
            <Form.Field>
              <Form.Button fluid positive size="big">
                登录
              </Form.Button>
            </Form.Field>
          </Form>
        </div>
      </div>
    )
  }
}

export default withRouter(Login)
