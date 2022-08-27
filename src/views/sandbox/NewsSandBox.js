import React, { createContext, useEffect } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import "./css/NewsSandBox.css"

import { Layout , Carousel} from 'antd'
import NewsRouter from '../../components/sandbox/NewsRouter'

const { Content , Footer} = Layout;
const contentStyle = {
  height: '160px',
  // width: '100%',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

export default function NewsSandBox() {
  NProgress.start()

  useEffect(()=>{
    NProgress.done()
  })

  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow:"auto"
          }}
        >
          <NewsRouter/>
        </Content>
        <Footer>
          <Carousel autoplay style={{bottom:"0px"}}>
            <div>
              {/* <img className="img-container" src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.huanghelou.cc%2Fzb_users%2Fupload%2F2022%2F05%2F20220530144039165389283942775.png&refer=http%3A%2F%2Fimg.huanghelou.cc&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664018271&t=7a8b43fc9d061fce7ca54cb6233a8b94'></img> */}
              <h3 style={contentStyle}>better late than never.</h3>
            </div>
            <div>
              <h3 style={contentStyle}>honesty is the best policy.</h3>
            </div>
            <div>
              <h3 style={contentStyle}>where there is a will, there is a way.</h3>
            </div>
            <div>
              <h3 style={contentStyle}>a friend in need is a friend indeed.</h3>
            </div>
          </Carousel>
          <div style={{textAlign:"right"}}>
          Ant Design ©2018 Created by Ant UED
          </div>
        </Footer>
        
      </Layout>
      
    </Layout>
  )
}

