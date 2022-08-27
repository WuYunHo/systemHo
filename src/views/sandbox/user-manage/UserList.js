import React, { useEffect, useState , useRef} from 'react'
import { Button, Table , Modal , Switch } from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'

const {confirm} = Modal
 
export default function UserList() {

  const roleObj = {
    "1":"superadmin",
    "2":"admin",
    "3":"editor",
  }

  useEffect(()=>{
    axios.get("http://localhost:8000/users?_expand=role").then((res)=>{
      const list = res.data
      setdataSource(roleObj[roleId]==="superadmin"?list:[
        ...list.filter(item=>item.username===username),
        ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")
      ])
    })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:8000/regions").then((res)=>{
      setregionList(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:8000/roles").then((res)=>{
      setroleList(res.data)
    })
  },[])

  const [dataSource,setdataSource] = useState([])  //原生数据
  const [isAddvisible,setisAddvisible] = useState(false)  //控制form表单开关
  const [roleList,setroleList] = useState([])  //
  const [regionList,setregionList] =  useState([])  //区域数据

  const [isUpdatevisible,setisUpdatevisible] = useState(false) //控制修改form表单开关
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false) //控制表单项禁用（父传子）
  const [current, setcurrent] = useState(null)

  const addForm = useRef(null)
  const updateForm = useRef(null)

  const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))


  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters:[
        ...regionList.map(item=>({
          text:item.title,
          value:item.value
        })),
        {
            text:"All",
            value:"All"
        }
      ],

      onFilter:(vaLue,item)=>{
        if(vaLue==="All"){
          return item.region===""
        }
        return item.region===vaLue
      }, 

      render:(region)=>{
        return <b>{region===''?'All':region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render:(role)=>{
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      //key: 'address'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render:(roleState,item)=>{
        return <Switch checked={roleState} disabled={item.default} onChange={()=>{
          handleChange(item)
        }}></Switch>
      }
    },
    {
      title:"操作",
      render:(item)=>{
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default}
          onClick={()=>{
            confirmMethod(item)
          }}></Button>

          <Button shape="circle" icon={<EditOutlined />} type="primary" onClick={()=>{
            handleUpdate(item)
          }}></Button>
        </div>
      }
  }];

  //控制删除表项按钮点击后弹出提示
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

  //控制删除表项按钮
  const deleteMethod = (item)=>{
    console.log(item)

    //当前页面同步状态+后端同步
    
    setdataSource(dataSource.filter(data=>data.id!==item.id))

    axios.delete(`http://localhost:8000/users/${item.id}`)
  }

  //控制增加用户表项
  const addFormOk = ()=>{
    addForm.current.validateFields().then(vaLue=>{
      
      setisAddvisible(false)

      //刷新重置表项内内容（重置清空）
      addForm.current.resetFields()

      //post到后端生成id，再设置datasource以方便之后的删除和更新
      axios.post(`http://localhost:8000/users`,{
        ...vaLue,
        "roleState": true,
        "default": false,
      }).then(res=>{
        console.log(res.data)
        setdataSource([...dataSource,{
          ...res.data,

          //生成新数据后筛选出对应的roleId表项，也可再发一次请求解决
          role:roleList.filter(item=>item.id===vaLue.roleId)[0]}])
      })
      
    }).catch(err=>{
      console.log(err)
    })
  }

  //控制用户状态开关
  const handleChange = (item)=>{
    item.roleState = !item.roleState
    setdataSource([...dataSource])

    axios.patch(`http://localhost:8000/users/${item.id}`,{
      roleState:item.roleState
    })
  }

  //控制更新列表
  const handleUpdate = (item)=>{
    setisUpdatevisible(true)

    //console.log(item)
    //updateForm.current.setFieldsValue(item)

    //react不保证状态总是先于组件更新完毕，因而需要保证先打开列表，再给列表赋值
    setTimeout(()=>{
      if(item.roleId===1){
        setisUpdateDisabled(true)
      }else{
        setisUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    })

    setcurrent(item)
  }

  const updateFormOk = ()=>{
    updateForm.current.validateFields().then(vaLue=>{
      setisUpdatevisible(false)
      setdataSource(dataSource.map(item=>{
        if(item.id===current.id){
          return{
            ...item,
            ...vaLue,
            role:roleList.filter(data=>data.id===vaLue.roleId)[0]
          }
        }
        return item
      }))
      setisUpdateDisabled(!isUpdateDisabled)

      axios.patch(`http://localhost:8000/users/${current.id}`,vaLue)
    })
  }

  return (
    <div>
      <Button type='primary' onClick={()=>{
        setisAddvisible(true)
      }}>add</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={item=>item.id} pagination={{
        pageSize:5
      }}/>

      <Modal
        visible={isAddvisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={()=>{
          setisAddvisible(false)
        }}
        onOk={() => 
          addFormOk()
        }
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      <Modal
        visible={isUpdatevisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={()=>{
          setisUpdatevisible(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => 
          updateFormOk()
        }
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm}
          isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
