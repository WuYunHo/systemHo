import { Table , Button , Modal , Tree} from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleOutlined
}from '@ant-design/icons'

const {confirm} = Modal

export default function RoleList() {
  useEffect(()=>{
    axios.get("http://localhost:8000/roles").then(res=>{
      setdataSource(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:8000/rights?_embed=children").then(res=>{
      setRightList(res.data)
    })
  },[])

  const [dataSource, setdataSource] = useState([])
  const [RightList, setRightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(0)
  const [isModalVisible, setisModalVisible] = useState(false)

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
      axios.delete(`http://localhost:8000/roles/${item.id}`)
    }
  }

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
      title: '角色名称',
      dataIndex: 'roleName',
      //key: 'name',
    },
    {
      title:"操作",
      render:(item)=>{
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />}
          onClick={()=>{
            confirmMethod(item)
          }}></Button>

          <Button shape="circle" icon={<UnorderedListOutlined />} type="primary"
          onClick={()=>{
            setisModalVisible(true)
            setcurrentRights(item.rights)
            setcurrentId(item.id)
          }}></Button>
          
        </div>
      }
  }
  ]

  const handleOk = ()=>{
    setisModalVisible(false)
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return {
          ...item,
          Rights:currentRights
        }
      }
      return item
    }))

    axios.patch(`http://localhost:8000/roles/${currentId}`,{
      rights:currentRights
    })
  }

  const handleCancel = ()=>{
    setisModalVisible(false)
  }

  const onCheck = (checkedKeys)=>{
    console.log(checkedKeys)
    setcurrentRights(checkedKeys)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}></Table>

      <Modal
        title="权限分配"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={false}
          treeData={RightList}
        />
      </Modal>
    </div>
  )
}
