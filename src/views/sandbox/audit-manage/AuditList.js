import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, notification } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function AuditList() {
  const {username} = JSON.parse(localStorage.getItem("token"))

  const [dataSource, setdataSource] = useState([])

  const navigate = useNavigate()

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render:(category)=>{
        return <div>{category.title}</div>
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render:(auditState)=>{
        const colorList = ["","orange","green","red"]
        const auditList = ["草稿箱","审核中","已通过","未通过"]
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title:"操作",
      render:(item)=>{
        return <div>
          {
            item.auditState===1 && <Button danger onClick={()=>{handleRevert(item)}}>撤销</Button>
          }
          {
            item.auditState===2 && <Button onClick={()=>handlePublish(item)}>发布</Button>
          }
          {
            item.auditState===3 && <Button type="primary" onClick={()=>{handleUpdate(item)}}>更新</Button>
          }
        </div>
      }
  }];

  const handleRevert = (item)=>{
    setdataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      "auditState":0
    }).then(res=>{
      notification.info({
        message:'tips',
        description:`您可以到"草稿箱"中查看您的新闻`,
        placement:"bottomRight"
      })
    })
  }

  const handleUpdate = (item)=>{
    navigate(`/new-manage/update/${item.id}`)
  }

  const handlePublish = (item)=>{
    setdataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      "publishState":2,
      "publishTime":Date.now()
    }).then(res=>{
      navigate(`/publish-manage/published`)
      notification.info({
        message:'tips',
        description:`您可以到"发布管理/已发布"中查看您的新闻`,
        placement:"bottomRight"
      })
    })
  }

  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res=>{
      //console.log(res.data)
      //console.log(username)
      setdataSource(res.data)
    }) //JSONserver:_ne代表不等于；_lte代表小于
  },[username])

  return (
    <div>
      <Table 
        dataSource={dataSource} 
        columns={columns} 
        pagination={{
          pageSize:5
        }}
        rowKey={item=>item.id}
      />
    </div>
  )
}
