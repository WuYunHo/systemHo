import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, List, Typography, Avatar, Drawer } from 'antd';
import { 
  EditOutlined, 
  EllipsisOutlined, 
  SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as Echarts from 'echarts';
import _ from 'lodash'


const { Meta } = Card;

export default function Home() {

  const [viewList, setviewList] =  useState([])
  const [starList, setstarList] =  useState([])
  const [visible, setvisible] = useState(false)
  const [allList, setallList] = useState([])

  const barRef = useRef()
  const pieRef = useRef()

  useEffect(()=>{
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res=>{
      //console.log(res.data)
      setviewList(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res=>{
      //console.log(res.data)
      setstarList(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get(`/news?publishState=2&_expand=category`).then(res=>{
      renderBarView(_.groupBy(res.data,item=>item.category.title))
      setallList(res.data)
    })

    return ()=>{
      window.onresize = null
    }
    
  },[])

  const renderBarView = (obj)=>{
    var myChart = Echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类示例'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel:{
          //rotate:45,
          interval:0
        }
      },
      yAxis: {
        minInterval:1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item=>item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = ()=>{
      myChart.resize()
    }
  }

  const renderPieView = (obj)=>{
    var currentList = allList.filter(item=>item.author===username)
    var gruopList = _.groupBy(currentList,item=>item.category.title)

    var list = []
    for(var i in gruopList){
      list.push({
        value:gruopList[i].length,
        name:i,
      })
    }
    console.log(list)

    var myChart = Echarts.init(pieRef.current);

    var option = {
      title:{
        text:`${username}新闻分类图示`,
        left: 'center'
      },
      tooltip:{
        trigger:'item'
      },
      series: [
        {
          type: 'pie',
          data: list,
          roseType: 'area'
        }
      ],
    };

    myChart.setOption(option);
  }

  const {username,region,role:{roleName}} = JSON.parse(localStorage.getItem("token"))

  const ajax = ()=>{
    //get-查
    // axios.get("http://localhost:8000/posts").then(res=>{
    //   console.log(res.data)
    // })

    //post-增

    //delete-删

    //put-改（替换改）

    //patch-改（补丁改）

    //_embed-关联查找
    // axios.get("http://localhost:8000/posts?_embed=comments").then(res=>{
    //   console.log(res.data)
    // })

    //_expand
    // axios.get("http://localhost:8000/comments?_expand=post").then(res=>{
    //   console.log(res.data)
    // })

  }

  return (
    <div>
      <div className="site-card-wrapper">
        <Row gutter={8}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered={true}>
              <List
                //bordered
                dataSource={viewList}
                renderItem={(item) => (
                  <List.Item>
                    <Typography.Text mark>{item.category.title}</Typography.Text><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="用户点赞最多" bordered={true}>
              <List
                  //bordered
                  dataSource={starList}
                  renderItem={(item) => (
                    <List.Item>
                      <Typography.Text mark>{item.category.title}</Typography.Text><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                    </List.Item>
                  )}
                />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              // style={{
              //   width: 300,
              // }}
              cover={
                <img
                  alt="example"
                  //src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  src='http://mms0.baidu.com/it/u=667691704,3759420652&fm=253&app=120&f=JPEG&fmt=auto&q=75?w=889&h=500'
                />
              }
              actions={[
                <SettingOutlined key="setting"  onClick={()=>{
                  setvisible(true)
                  setTimeout(()=>{
                    renderPieView()
                  },0)
                }}/>,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={
                  <div>
                    <b>{region?region:"全球"}</b>
                    <span style={{
                      paddingLeft:"20px"
                    }}>{roleName}</span>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Drawer 
        title="个人信息"
        placement="right" 
        closable={true}
        onClose={()=>{
          setvisible(false)
        }} 
        visible={visible}
        width="500px"
      >
        <div 
          ref={pieRef} 
          style={{
            height:"400px",
            marginTop:"180px",
            width:"100%"
          }}
        ></div>

      </Drawer>

      <div 
        ref={barRef} 
        style={{
          height:"400px",
          marginTop:"180px",
          width:"100%"
        }}></div>
    </div>
  )
}
