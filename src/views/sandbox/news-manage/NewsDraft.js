import React, { useEffect, useState } from 'react'
import { Button, Table , Modal , notification} from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const {confirm} = Modal
 
export default function NewsDraft() {
  const navigate = useNavigate()

  const {username} = JSON.parse(localStorage.getItem("token"))

  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then((res)=>{
      setdataSource(res.data)
      //console.log(res.data)
    })
  },[username])

  const [dataSource,setdataSource] = useState([])
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      //key: 'name',
      render:(id)=>{
        return <b>{id}</b>
      }
    },
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
        //console.log(category.title)
        return category.title
      }
    },
    {
      title:"操作",
      render:(item)=>{
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />}
          onClick={()=>{
            confirmMethod(item)
          }}></Button>

          <Button shape="circle" icon={<EditOutlined />} onClick={()=>{
            navigate(`/news-manage/update/${item.id}`)
          }}></Button>

          <Button shape="circle" icon={<CloudUploadOutlined />} type="primary" onClick={()=>{
            handleCheck(item.id)
          }}></Button>
        </div>
      }
  }];

  const handleCheck = (id)=>{
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then(res=>{
      navigate(`/audit-manage/list`)

      notification.info({
        message:`tips`,
        description:`您可以在|审核列表|中查看您的新闻`,
        placement:"bottomRight"
      })
    })
  }

  const confirmMethod = (item)=>{
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      //content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item)=>{
    console.log(item)

    setdataSource(dataSource.filter(data=>data.id!==item.id))
    axios.delete(`/news/${item.id}`)
    
  }

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
