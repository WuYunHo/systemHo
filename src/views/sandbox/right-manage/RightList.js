import React, { useEffect, useState } from 'react'
import { Button, Table , Tag , Modal , Popover, Switch} from 'antd'
import axios from 'axios'
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const {confirm} = Modal
 
export default function RightList() {

  useEffect(()=>{
    axios.get("http://localhost:8000/rights?_embed=children").then((res)=>{
      const mylist = res.data
      mylist.forEach(item=>{
        if(item.children.length===0){
          item.children = ""
        }
      })
      setdataSource(res.data)
    })
  },[])

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
      title: '权限名称',
      dataIndex: 'title',
      //key: 'age',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      //key: 'address',
      render:(key)=>{
        return <Tag icon={<CheckCircleOutlined />} color="success">{key}</Tag>
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

          <Popover 
            content={<div style={{textAlign:"center"}}>
              <Switch 
                checked={item.pagepermisson}
                onChange={()=>switchMethod(item)}></Switch>
            </div>} 
            title="权限管理" 
            trigger={item.pagepermisson===undefined?'':'click'}>
            <Button shape="circle" icon={<EditOutlined />} type="primary" 
              disabled={item.pagepermisson===undefined}></Button>
          </Popover>
        </div>
      }
  }];

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

    if(item.grade===1){
      setdataSource(dataSource.filter(data=>data.id!==item.id))
      axios.delete(`http://localhost:8000/rights/${item.id}`)
    }else{
      let list = dataSource.filter(data=>data.id===item.rightId)
      list[0].children = list[0].children.filter(data=>data.id!==item.id)
      setdataSource([...dataSource])
      axios.delete(`http://localhost:8000/children/${item.id}`)
    }
  }

  const switchMethod = (item)=>{
    item.pagepermisson = (item.pagepermisson===1?0:1)
    //console.log(item)
    setdataSource([...dataSource])

    if(item.grade===1){
      axios.patch(`http://localhost:8000/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{
      axios.patch(`http://localhost:8000/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize:5
      }}/>
    </div>
  )
}
