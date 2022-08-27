import React, {useEffect, useState, useRef} from 'react'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification} from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/user-manage/NewsEditor'
import { useNavigate, useParams } from 'react-router-dom'

const { Step } = Steps
const { Option } = Select

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

export default function NewsUpdate() {
  const [current, setcurrent] = useState(0)
  const [CategoryList, setCategoryList] = useState([])

  const [formInfo, setformInfo] = useState({})
  const [content, setcontent] = useState(undefined)

  const navigate = useNavigate()
  const params = useParams()

  const NewsForm = useRef(null)

  const handleNext = ()=>{
    if(current===0){
      NewsForm.current.validateFields().then(res=>{
        //console.log(res)
        setformInfo(res)
        setcurrent(current+1)
      }).catch(err=>{
        console.log(err)
      })
    }else{
      if(content==='' || content.trim()==="<p></p>"){
        message.error('内容不能为空')
      }else{
        setcurrent(current+1)
      }
      
    }
  }

  const handlePrivious = ()=>{
    setcurrent(current-1)
  }

  useEffect(()=>{
    axios.get("/categories").then(res=>{
      setCategoryList(res.data)
    })
  })

  useEffect(()=>{
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res=>{

      let {title,categoryId,content} = res.data
      
      NewsForm.current.setFieldsValue({
        title,
        categoryId
      })

      setcontent(content)
    })
  },[params.id])
  
  const handleSave = (auditState)=>{
    axios.patch(`/news/${params.id}`,{
      ...formInfo,
      "content":content,
      "auditState":auditState,
    }).then(res=>{
      navigate(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")

      notification.info({
        message: `tips`,
        description: `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
        placement:"bottomRight",
      });
    })
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={()=>{navigate(-1)}}
        title="更新新闻"
        subTitle="更新新闻县"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类." />
        <Step title="新闻内容" subTitle="Left 00:00:08" description="新闻主体内容." />
        <Step title="新闻提交" description="保存草稿或提交审核." />
      </Steps>

      <div style={{marginTop:"50px"}}>
        <div className={current===0?'':style.active}>
          <Form 
            {...layout} 
            name="basic"
            ref={NewsForm}  
          >
            <Form.Item
              name="title"
              label="新闻标题"
              rules={[
                {
                  required: true,
                  message:"show me your name guys"
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="categoryId"
              label="新闻分类"
              rules={[
                {
                  required: true,
                  message:"show me your name guys"
                },
              ]}
            > 
              <Select>
                {
                  CategoryList.map(item=>
                    <Option value={item.id} key={item.id}>{item.title}</Option>)
                }
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className={current===1?'':style.active}>
          <NewsEditor getContent={(value)=>{
            //子传父使用回调函数
            setcontent(value)
            console.log(value)
          }} content={content}></NewsEditor>
        </div>
        <div className={current===2?'':style.active}>333</div>
      </div>

      <div style={{marginTop:'50px', textAlign:'center'}}>
        {
          current===2 && <span>
            <Button type='primary' onClick={()=>handleSave(0)}>保存草稿箱</Button>
            <Button onClick={()=>handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current<2 && <Button type='primary' onClick={handleNext}>next</Button>
        }
        {
          current>0 && <Button onClick={handlePrivious}>previous</Button>
        }
        
        
      </div>
    </div>
  )
}
