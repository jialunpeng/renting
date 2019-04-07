import React from 'react'
// 1. 导入相关的依赖包, 会自动导入依赖的核心样式
import Tloader from 'react-touch-loader'
import './style.less'
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      hasMore: false,
      initializing: 1,
      total: 0 // 总条数
    }
  }

  refresh = (resolve, reject) => {
    setTimeout(() => {
      // 获取第一页的数据
      this.setState({
        total: 10,
        hasMore: true
      })
      resolve()
    }, 1000)
  }

  loadMore = (resolve, reject) => {
    setTimeout(() => {
      let newTotal = this.state.total + 10
      this.setState({
        total: newTotal,
        hasMore: newTotal > 0 && newTotal < 50
      })
      resolve()
    }, 1000)
  }

  componentDidMount() {
    // 后台加载数据
    setTimeout(() => {
      this.setState({
        total: 10,
        initializing: 2,
        hasMore: true
      })
    }, 1000)
  }

  render() {
    let { hasMore, initializing, total } = this.state
    let data = []
    for (var i = 0; i < total; i++) {
      data.push(
        <li key={i}>
          <p>{i}</p>
        </li>
      )
    }
    return (
      <div className="view">
        {/* onRefresh: 下拉刷新功能 */}
        <Tloader
          className="main"
          initializing={initializing}
          hasMore={hasMore}
          onRefresh={this.refresh}
          onLoadMore={this.loadMore}
        >
          <ul>{data}</ul>
        </Tloader>
      </div>
    )
  }
}
export default Demo
