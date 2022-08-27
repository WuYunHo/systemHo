import React from 'react'
import { Layout , Dropdown , Menu , Avatar , Image } from 'antd';
import { MenuFoldOutlined ,MenuUnfoldOutlined } from '@ant-design/icons';
import {useNavigate} from "react-router";
import { connect } from 'react-redux/es/exports';

const { Header } = Layout;

function TopHeader(props) {
  console.log(props)

  let navigate = useNavigate()

  //const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = ()=>{
    //console.log(props)
    props.changeCollapsed()
  }

  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          type: 'group',
          label: roleName,
          children: [
            {
              key: '1-1',
              label: 'settings',
            },
            {
              key: '1-2',
              label: 'Exit',
              onClick:()=>{
                localStorage.removeItem("token")
                navigate("/login")
              }
            },
          ],
        },
        {
          key: '2',
          label: 'sub menu',
          children: [
            {
              key: '2-1',
              label: '3rd menu item',
            },
            {
              key: '2-2',
              label: '4th menu item',
            },
          ],
        },
        {
          key: '3',
          label: 'disabled sub menu',
          disabled: true,
          children: [
            {
              key: '3-1',
              label: '5d menu item',
            },
            {
              key: '3-2',
              label: '6th menu item',
            },
          ],
        },
      ]}
    />
  );  

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
          {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })} */}
    {
      props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> : <MenuFoldOutlined onClick={changeCollapsed}/>
    }

    <div style={{float:"right"}}>
      <span>Welcome <span style={{color:"#1890ff"}}>{username}</span> back</span>
      <Dropdown overlay={menu}>
      <Avatar
        src={
          <Image
            src="https://tse1-mm.cn.bing.net/th/id/OIP-C.Sld8xeccjYmqg2oBrsmZVAHaHa?w=170&h=180&c=7&r=0&o=5&pid=1.7"
            style={{
              width: 32,
              backgroundColor: '#000000',
            }}
          />
        }
      />
      </Dropdown>
    </div>

    </Header>
  )
}

const mapStoreToProps = ({CollapsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed(){
    return {
      type:"change_collapsed",
      // payload:
    }
  }
}

export default connect(mapStoreToProps,mapDispatchToProps)(TopHeader)
