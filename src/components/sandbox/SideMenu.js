import React , { useEffect, useState } from 'react'
import axios from 'axios';
import { Menu , Layout} from 'antd';
import { 
  AccountBookOutlined,
  AimOutlined,
  AlertOutlined,
  ApartmentOutlined,
  CarryOutOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  AuditOutlined,
  BankOutlined,
  BarcodeOutlined,
  BarsOutlined,
  BellOutlined,
  BlockOutlined,
  BookOutlined,
  BorderOutlined,
  BorderlessTableOutlined,
  BranchesOutlined,
  BugOutlined,
  BuildOutlined,
  PieChartOutlined, 
  IdcardOutlined,
  KeyOutlined,
  ReconciliationOutlined,
  SolutionOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux/es/exports';

import './index.css'
import SubMenu from 'antd/lib/menu/SubMenu';
import MenuItem from 'antd/lib/menu/MenuItem';
import {useNavigate, useLocation} from "react-router";

const { Sider } = Layout;

const iconList = {
  "/home":<BorderOutlined />,
  "/user-manage":<IdcardOutlined />,
  "/user-manage/add":<AccountBookOutlined />,
  "/user-manage/delete":<AimOutlined />,
  "/user-manage/update":<AlertOutlined />,
  "/user-manage/list":<ApartmentOutlined />,
  "/right-manage":<KeyOutlined />,
  "/right-manage/role/list":<CarryOutOutlined />,
  "/right-manage/right/list":<AppstoreAddOutlined />,
  "/right-manage/role/update":<AppstoreOutlined />,
  "/right-manage/role/delete":<AudioOutlined />,
  "/right-manage/right/update":<AudioMutedOutlined />,
  "/right-manage/right/delete":<AuditOutlined />,
  "/news-manage":<SoundOutlined />,
  "/news-manage/list":<BankOutlined />,
  "/news-manage/add":<BarcodeOutlined />,
  "/news-manage/update/:id":<BarsOutlined />,
  "/news-manage/preview/:id":<BellOutlined />,
  "/news-manage/draft":<BlockOutlined />,
  "/news-manage/category":<BookOutlined />,
  "/audit-manage":<SolutionOutlined />,
  "/audit-manage/audit":<BorderOutlined />,
  "/audit-manage/list":<BorderlessTableOutlined />,
  "/publish-manage":<ReconciliationOutlined />,
  "/publish-manage/unpublished":<BranchesOutlined />,
  "/publish-manage/published":<BugOutlined />,
  "/publish-manage/sunset":<BuildOutlined />,
};

function SideMenu(props) {

  //react-router-dom@6 代替高阶组件withRouter
  let navigate = useNavigate()
  let location = useLocation()

  const [menu, setMenu] = useState([])

  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))

  const checkPagePermisson = (item)=>{
    return item.pagepermisson && rights.includes(item.key)
  }

  const selectKeys = [location.pathname] //利用高阶组件props动态获取页面路径
  const openKeys = ["/" + location.pathname.split("/")[1]]

  console.log(selectKeys)
  console.log(openKeys)

  const renderMenu = (menuList)=>{
    return menuList.map(item=>{
      if(item.children){
        if(item.children.length > 0  && checkPagePermisson(item)){
          return <SubMenu 
            key={item.key}
            icon={iconList[item.key]}
            title={item.title}
            >
              {renderMenu(item.children)}
            </SubMenu>
        }
      }

      return checkPagePermisson(item) && <MenuItem 
        key={item.key}
        icon={iconList[item.key]}
        onClick={()=>{
          navigate(item.key)
        }}
        >
          {item.title}
        </MenuItem>
    })
  }

  useEffect(()=>{
    axios.get("http://localhost:8000/rights?_embed=children").then(res=>{
      //console.log(res.data)
      setMenu(res.data)
    })
  },[])

  //console.log(selectKeys)
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{
        display:"flex",
        height:"100%",
        flexDirection:"column"
      }}>
        <div className="logo" >
          <PieChartOutlined /><br></br>
          VIP System
        </div>
        
        <div style={{
          flex:1,
          overflow:"auto"
        }}>
          <Menu
            defaultSelectedKeys={selectKeys}  //高亮现实的菜单项目(defalult)
            //selectedKeys={selectKeys}
            defaultOpenKeys={openKeys}  //初始展开的菜单项目(default)
            //openKeys={openKeys}
            mode="inline"
            theme="dark"
            // inlineCollapsed={true}
            //items={items}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>

      </Sider>
  )
}

const mapStoreToProps = ({CollapsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
}

export default connect(mapStoreToProps)(SideMenu)