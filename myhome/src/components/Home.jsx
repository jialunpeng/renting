import React from 'react'
import './Home.css'
import { Grid, Icon } from 'semantic-ui-react'
import { NavLink, Switch, Route } from 'react-router-dom'
import Main from './home/main/Main'
import Info from './home/info/Info'
import Chat from './home/chat/Chat'
import My from './home/my/My'
// import Demo from './home/demo/Demo.jsx'
class Home extends React.Component {
  // 点标记语法
  render() {
    return (
      <div className="home">
        <div className="home_content">
          <Switch>
            <Route exact path="/home" component={Main} />
            <Route path="/home/info" component={Info} />
            <Route path="/home/my" component={My} />
            <Route path="/home/chat" component={Chat} />
          </Switch>
        </div>
        <div className="home_menu">
          {/* 网格布局 */}
          <Grid>
            <Grid.Row columns={4}>
              <Grid.Column>
                <NavLink exact to="/home">
                  <Icon name="hospital" />
                  <p>主页</p>
                </NavLink>
              </Grid.Column>
              <Grid.Column>
                <NavLink to="/home/info">
                  <Icon name="paste" />
                  <p>资讯</p>
                </NavLink>
              </Grid.Column>
              <Grid.Column>
                <NavLink to="/home/chat">
                  <Icon name="envelope" />
                  <p>微聊</p>
                </NavLink>
              </Grid.Column>
              <Grid.Column>
                <NavLink to="/home/my">
                  <Icon name="user" />
                  <p>我的</p>
                </NavLink>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    )
  }
}

export default Home
