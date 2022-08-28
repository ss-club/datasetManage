import React, { useEffect } from "react";
import styles from "./Picsets.module.css"
import { Pagination, Button, Input, Modal, Form,  message } from "antd"
import {  DeleteOutlined, EditOutlined} from '@ant-design/icons';
import { useState } from "react";
import request from "../assets/utils";
import { useNavigate } from 'react-router';
import getTime from "../assets/getTime";

const { Search, TextArea } = Input;


export default function Content() {
    const navigate = useNavigate()

    const [form] = Form.useForm()
    const [picSets, setPicSets] = useState([])
    const [modalType, setModalType] = useState("add")//新增或更新数据集
    const [picset, setPicset] = useState(null)
    const [total, setTotal] = useState(0)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [current, setCurrent] = useState(1);//pagination
    const [pagePicsets,setPagePicsets] = useState([])//角色列表



    useEffect(() => {
        const timer = setInterval(()=> {
            fetchList()
            
        },1500)   
            return () => {
                clearInterval(timer)
        } 
    },[])

    useEffect(() => {        
        setPagePicsets(picSets.splice((current-1)*15, current*15))
    },[current,picSets])

    const showModal = () => {
        setModalType("add")
        setIsModalVisible(true);        
      };
    
    const handleOk = () => {
        setIsModalVisible(false);
        if(modalType === "add") {
            createPicSets()
        } else {
            updateRole()
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const fetchList = () => {
        const createRole = window.localStorage.getItem("username")
        request.get(`/api/picSets/list?createRole=${createRole}`)
            .then((res) => {
                setPicSets(res.data.data)
                setTotal(res.data.data.length)
            })
            .catch((err) => {
                message.error("获取图片集列表失败")
            })
    }

   const createPicSets = () => {
        form.validateFields().then((values)=> {
            values.createRole = window.localStorage.getItem("username")
            return request.post("/api/picSets/add", values)               
        })
        .then((res)=> {
            if(res.data.status === 0) {
                message.success("创建数据集成功")
            } else {
                message.error(res.data.data)
            } 
            form.resetFields()
        })
        .catch((err) => {
            console.log(err);
            message.error("创建数据集出错,请重试")
        })
   }

   const deletePicSet = (_id) => {
        request.post("/api/picSets/delete",{_id})
        .then((res) => {
            if(res.status === 0)
            message.success("删除成功")
        })
        .catch((err) => {
            console.log(err);
            message.err("删除错误,请重试")
        })
   }

   const updateRole = () => {
        form.validateFields().then((values)=> {
            picset.picsetName = values.picsetName
            picset.notes = values.notes
            request.post("/api/picSets/update",picset)
            .then((res) => {
                if(res.data.status === 0) {
                    message.success("更新成功")
                    form.resetFields()
                    setIsModalVisible(false)
                } 
            }).catch((err) => {
                message.error("更新错误,请重试")
                console.log(err);
            })               
        })
        
    }
   const updateClick = (e) => {
        setIsModalVisible(true);
        setModalType("update")
        setPicset(e)
        form.setFieldsValue({
            picsetName: e.picsetName,
            notes: e.notes,
        })        
    }

    const goPic = (picSet) => {
        console.log(picSet);
        navigate("/picSets/pictures",{state: picSet})
    }

    const onChange = (page) => {        
        setCurrent(page);
    };
    return (
        <>
        
        <div className={styles.newSet}>
            <Button onClick={()=> {showModal()}} className={styles.button}>+ 新建数据集</Button>
            {/* <Search
            className={styles.search}
            placeholder="输入数据集名称"
            // onSearch={onSearch}
            style={{
                width: 300
            }}
            />
             */}
        </div>
        <Modal title={modalType === "update" ? "更新数据集" : "新建数据集"} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Form
                form={form}
                labelCol={{
                span: 4,
                }}
                wrapperCol={{
                span: 14,
                }}
                layout="horizontal"
            >
                <Form.Item label="输入名称" name="picsetName">
                    <Input />
                </Form.Item>
                <Form.Item label="备注" name="notes">
                    <TextArea rows={2} />                    
                </Form.Item>
                {/* <Form.Item label="上传图片" valuePropName="fileList">
                    <Upload action="/upload.do" listType="picture-card">
                        <div>
                        <PlusOutlined />
                        <div
                            style={{
                            marginTop: 8,
                            }}
                        >
                            Upload
                        </div>
                        </div>
                    </Upload>
                </Form.Item> */}
            </Form>
        </Modal>
        <div className={styles.picSetsContaier}>
            {
                pagePicsets.map((picSet) => {
                    return (
                        <div className={styles.picSetContainer}  key={picSet.picsetName}>
                            <div className={styles.picBackground} onClick={() => goPic(picSet)} />
                            <div className={styles.picAssetInfo}>
                                <div className={styles.nameEditor}>
                                <div className={styles.setName} onClick={() => goPic(picSet)}>{picSet.picsetName}</div>
                                <div onClick={()=> {
                                    updateClick(picSet)
                                    }} 
                                    className={styles.editorRole}>
                                    <EditOutlined />
                                </div>
                                </div>
                                <div className={styles.otherInfo}>{getTime(picSet.createdOn)}</div>
                                <div className={styles.otherInfo}>{picSet.notes}</div>
                            </div>
                            <div className={styles.delete}>
                                <div  onClick={() => {
                                    deletePicSet(picSet._id)                                    
                                    }}
                                    className={styles.editorRole}>
                                    <DeleteOutlined />
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            
        </div>
        <div className={styles.pagination}>
            <Pagination current={current} onChange={onChange} total={total} defaultPageSize={15} defaultCurrent={1} />            
        </div>
        </>
    )
}