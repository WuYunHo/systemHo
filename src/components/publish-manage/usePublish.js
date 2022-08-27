import axios from 'axios'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'

function usePublish(publishState){
    const { username } = JSON.parse(localStorage.getItem("token"))

    const [dataSource, setdataSource] = useState([])

    const navigate = useNavigate()
  
    useEffect(()=>{
      axios(`/news?author=${username}&publishState=${publishState}&_expand=category`).then(res=>{
        setdataSource(res.data)
      })
    },[username, publishState])

    const handlePublish = (id)=>{
      setdataSource(dataSource.filter(item=>item.id!==id))

      axios.patch(`/news/${id}`,{
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

    const handleDelete = (id)=>{
      setdataSource(dataSource.filter(item=>item.id!==id))

      axios.delete(`/news/${id}`).then(res=>{
        navigate(`/publish-manage/published`)
        notification.info({
          message:'tips',
          description:`新闻已删除`,
          placement:"bottomRight"
        })
      })
    }

    const handleSunset = (id)=>{
      setdataSource(dataSource.filter(item=>item.id!==id))

      axios.patch(`/news/${id}`,{
        "publishState":3,
        "publishTime":Date.now()
      }).then(res=>{
        navigate(`/publish-manage/published`)
        notification.info({
          message:'tips',
          description:`您可以到"发布管理/已下线"中查看您的新闻`,
          placement:"bottomRight"
        })
      })
    }

    return {
        dataSource,
        handleDelete,
        handlePublish,
        handleSunset
    }
}

export default usePublish