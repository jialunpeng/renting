import React from 'react'
import './style.less'

import Tloader from 'react-touch-loader'

class Demo extends React.Component {
  // 构造函数
  constructor() {
    super()
    this.state = {
      // 能够下拉刷新（能）
      canRefreshResolve: 1,
      // 总的数量
      listLen: 0,
      // 是否有更多的数据
      hasMore: 0,
      // 0: 不显示进度条 1：显示进度条 2.结束进度条
      initializing: 1,
      // 刷新的时间
      refreshedAt: Date.now()
    }
  }

  // 组件刚挂载执行的代码
  componentDidMount() {
    // 发送ajax请求，获取到数据
    setTimeout(() => {
      this.setState({
        // 获取到了9条数据
        listLen: 9,
        // hasMore: true, 有更多，显示加载更多
        hasMore: 1,
        // 结束进度条
        initializing: 2 // initialized
      })
    }, 2000)
  }

  // 下拉刷新的代码
  refresh = (resolve, reject) => {
    setTimeout(() => {
      const { canRefreshResolve } = this.state
      if (!canRefreshResolve) reject()
      else {
        // 重置了状态
        this.setState({
          listLen: 9,
          hasMore: 1,
          refreshedAt: Date.now()
        })

        resolve()
      }
    }, 2000)
  }
  // 加载更多的代码
  loadMore = resolve => {
    setTimeout(() => {
      const { listLen } = this.state
      const l = listLen + 9

      this.setState({
        listLen: l,
        hasMore: l > 0 && l < 50
      })

      resolve()
    }, 2000)
  }

  render() {
    const { listLen, hasMore, initializing, refreshedAt } = this.state
    const list = []

    if (listLen) {
      for (let i = 0; i < listLen; i++) {
        list.push(
          <li key={i}>
            <p>{i}</p>
          </li>
        )
      }
    }
    return (
      <div className="view">
        <Tloader
          className="main"
          onRefresh={this.refresh}
          onLoadMore={this.loadMore}
          hasMore={hasMore}
          initializing={initializing}
        >
          <ul>{list}</ul>
        </Tloader>
      </div>
    )
  }
}

export default Demo
