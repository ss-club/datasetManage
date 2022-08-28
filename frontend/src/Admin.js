import {  Outlet, useNavigate } from "react-router-dom"

import LeftNav from './component/LeftNav.js'
import styles from "./Admin.module.css"
import { CaretDownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Input, Form, Drawer, Button, Modal, Checkbox, message,  } from 'antd';
import { useState,useEffect } from 'react';
import { useLocation } from "react-router-dom";
import request from "./assets/utils.js";
const { TextArea } = Input



export default function Admin() {
    const [form] = Form.useForm()
    const [form2] = Form.useForm()
    const navigate = useNavigate()
    let location = useLocation()
    const [personal, setPersonal] = useState()
    const [componentDisabled, setComponentDisabled] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [visible, setVisible] = useState(false); //drawer




    useEffect(() => {

      const token = window.localStorage.getItem("token")
      if(!token) {
        navigate("/login")
      }
      const _id = window.localStorage.getItem("_id")
      const timer = setInterval(()=> {
        if(_id) {
          request.get(`/api/roles/personal?_id=${_id}`)
          .then((res) => {
            console.log(res.data);
              setPersonal(res.data.data)
          })
          .catch((err) => {
            console.log(err);          
          })
        }
      },1500)   
      return () => {
          clearInterval(timer)
      }     
    },[])

    const menu = (
        <Menu
          items={[
            {
              key: '1',
              label: (
                <div   onClick={() => {
                  showDrawer()
                }}>
                  个人信息
                </div>
              ),
            },
            {
              key: '2',
              label: (
                <div onClick={() => {
                  navigate("/login", {replace: true})
                  window.localStorage.clear() 
                }}>
                  退出登录
                </div>
              )
            }
          ]}
        />
    );


    const showDrawer = () => {
      setVisible(true);
    };

    const onClose = () => {
      setVisible(false);
    };

    const showModal = () => {
        setIsModalVisible(true);        
      };
    
    const handleOk = () => {
        setIsModalVisible(false);
        if(componentDisabled === true) {
          form.validateFields()
            .then((values) => {              
              request.post("/api/roles/updatePersonal", {revise: "info" ,personal: personal, username: values.username, notes: values.notes})
              .then((res) => {
                if(res.status === 0) {
                  message.success("修改成功")
                  form.resetFields()
                }
              })
              .catch(() => {
                message.error("修改失败")
              })
            })
            
        } else {
          form2.validateFields()
            .then((values) => {              
              request.post("/api/roles/updatePersonal", {revise: "password", personal: personal, password1: values.password1, password2: values.password2})
              .then((res) => {
                if(res.status === 0) {                 
                  message.success("修改成功")
                  form2.resetFields()
                }
              })
              .catch(() => {
                message.error("修改失败")
              })
            })
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    
    //控制修改表单

    

    return (
        <div>
            <div className={styles.sectionContainer}>
                <div className={styles.LeftNavContainer}>
                    <LeftNav location={location}/>
                </div>
                {/* 中间部分 */}
                <div className={styles.sectionConten}>
                  <Outlet />
                </div>
                {/* //头部 */}
                <div className={styles.headerContainer}>                                
                    <div className={styles.personalInfo}>
                        <Dropdown overlay={menu}>
                            <div onClick={(e) => e.preventDefault()}>
                              <Space>
                                <div>
                                  <span>{personal ? personal.username : null} </span>
                                  <CaretDownOutlined />
                                </div>                                  
                              </Space>
                            </div>
                        </Dropdown>
                        <img src="/imgs/1.JPG" alt="" width={30} height={30}className={styles.image}></img>                        
                    </div>
                </div>
                {/* 个人信息modal */}
                <div>
                    <Modal title="修改密码" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        <Checkbox
                          checked={componentDisabled}
                          onChange={(e) => setComponentDisabled(e.target.checked)}
                        >
                            修改个人信息
                        </Checkbox>
                        <Form
                            form={form}
                            labelCol={{
                            span: 4,
                            }}
                            wrapperCol={{
                            span: 14,
                            }}
                            layout="horizontal"
                            disabled={!componentDisabled}
                        >
                            <Form.Item label="昵称" name="username">
                                <Input />
                            </Form.Item>
                            <Form.Item label="备注" name="notes">
                                <TextArea rows={4} />
                            </Form.Item>                         
                        </Form>
                        <Checkbox
                          checked={!componentDisabled}
                          onChange={(e) => setComponentDisabled(!e.target.checked)}
                        >
                            修改密码
                        </Checkbox>
                        <Form
                            form={form2}
                            labelCol={{
                            span: 4,
                            }}
                            wrapperCol={{
                            span: 14,
                            }}
                            layout="horizontal"
                            disabled={componentDisabled}
                        >
                            <Form.Item
                                name="password1"
                                label="旧密码"
                                rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                ]}                                
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="password2"
                                label="新密码"
                                rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                ]}                                
                            >
                                <Input.Password />
                            </Form.Item>                           
                        </Form>
                    </Modal>
                     
                    <Drawer title="个人信息" placement="right" onClose={onClose} visible={visible}>
                      {
                        personal ?
                        <>
                          <div className={styles.revise}>
                            <div className={styles.name}>{personal.username}</div>            
                            <Button onClick={()=> {showModal()}} className={styles.button}>修改个人信息</Button>
                          </div>
                          <div className={styles.createOn}>{personal.createdOn ? `创建于${personal.createdOn}` : null}</div>     
                          <div className={styles.notes}>备注：{personal.notes ? personal.notes : null}</div>
                        </>
                        : null
                      }
                      
                    </Drawer>
                </div>  
            </div>
        </div>
    )
}