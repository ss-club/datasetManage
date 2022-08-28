import {  Button, Input, Pagination, Modal, Form, Select, message } from "antd"
import {  DeleteOutlined, EditOutlined} from '@ant-design/icons';
import styles from "./Roles.module.css"
import { useEffect, useState } from "react";
import request from "../assets/utils";
import getTime from "../assets/getTime";
const { Search, TextArea } = Input;


export default function Roles() {
    const [isModalVisible, setIsModalVisible] = useState(false);//增加或更新用户modal
    const [modalType, setModalType] = useState("add")//新增或更新角色
    const [role, setRole] = useState(null)
    const [roles,setRoles] = useState([])//角色列表
    const [pageRoles,setPageRoles] = useState([])//角色列表
    const [current, setCurrent] = useState(1);//pagination
    const [form] = Form.useForm()
    const [clickOk, setClickOk] = useState(true)


    //获取所有user
    useEffect(() => {      
        
        const timer = setInterval(()=> {
            const createRole = window.localStorage.getItem("username")
            if(createRole) {
                request.get(`/api/roles/list?createRole=${createRole}`)
                .then((res) => {
                    setRoles(res.data.data)
                    console.log(res.data.data.length);
                })
            }
        },1500)   
        return () => {
            clearInterval(timer)
        }     
    },[])

    useEffect(() => {        
        setPageRoles(roles.splice((current-1)*15, current*15))
    },[current,roles])

    const showModal = () => {
        setModalType("add")
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if(modalType === "add") {
            addRole()
        } else if(modalType === "update") {
            console.log("update");
            updateRole()
        }
        const cilck = clickOk

        setClickOk(!cilck)
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onChange = (page) => {        
        setCurrent(page);
    };
    //新增角色
    const addRole = () => {
        form.validateFields().then((values)=> {
            values.createRole = window.localStorage.getItem("username")
            console.log(values);
            return request.post("/api/roles/add", values)               
        })
        .then((res)=> {
            if(res.data.status === 0) {
                message.success("创建用户成功")
                console.log(res.data);
            } else {
                message.error(res.data.data)
            } 
            form.resetFields()

        })
        .catch((err) => {
            console.log(err);
            message.error("创建角色出错")
        })
    }

    const deleteRole = (e) => {
        console.log(e._id);
        request.post("/api/roles/delete",{_id: e._id})
            .then((res) => {
                if(res.status === 0)
                message.success("删除成功")
            })
            .catch((err) => {
                message.err("删除错误,请重试")
            })
    }

    const updateRole = () => {
        form.validateFields().then((values)=> {
            role.username = values.username
            role.notes = values.notes
            role.role = values.role
            console.log(role);
            // return request.post("/api/roles/add", values)
            request.post("/api/roles/update",role)
            .then((res) => {
                console.log(res);
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
    const updataClick = (e) => {
        setIsModalVisible(true);
        setModalType("update")
        setRole(e)
        form.setFieldsValue({
            username: e.username,
            role: e.role,
            notes: e.notes,
        })        
    }
      
    return (
        <>
                
        <div className={styles.newSet}>
            <Button onClick={()=>{showModal()}} className={styles.button}>+ 新建角色</Button>
            <Search
            placeholder="请输入角色名"
            // onSearch={onSearch}
            style={{
                width: 300,
            }}
            />
        </div>
        <Modal title={modalType === "add" ? "新建角色" : "更新角色"} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
                <Form.Item label="输入名称" name="username">
                    <Input />
                </Form.Item>
                <Form.Item label="选择角色" name="role">
                {   
                    // 根据用户判断可创建的角色
                    window.localStorage.getItem("role") === "admin" || "supervisor"
                    ?
                    <Select>
                        <Select.Option value="supervisor">主管</Select.Option>
                        <Select.Option value="marker">标记员</Select.Option>
                    </Select>  
                    :
                    <Select>
                        <Select.Option value="marker">标记员</Select.Option>
                    </Select> 
                }
                                            
                </Form.Item>
                <Form.Item label="备注" name="notes">
                    <TextArea rows={2} />                    
                </Form.Item>                
            </Form>
        </Modal>
        
        <div className={styles.picSetsContaier}>
            {roles ? 
                pageRoles.map((role) => {
                    return (
                        <div  className={styles.picSetContainer} key={role.username}>
                            <div className={styles.picBackground}>
                            </div>
                            <div className={styles.picAssetInfo}>
                                <div className={styles.nameEditor}>
                                    <div className={styles.setName}>{role.username}</div>
                                    <div onClick={() => {
                                        updataClick(role)
                                    }}
                                    className={styles.editorRole}>
                                        <EditOutlined />
                                    </div>
                                </div>
                                <div className={styles.otherInfo}>{role.role}</div>
                                <div className={styles.otherInfo}>{getTime(role.createdOn)}</div>
                                <div className={styles.otherInfo}>{role.notes}</div>
                            </div>
                            <div className={styles.delete}>
                                <div  onClick={() => {
                                    deleteRole(role)
                                }}
                                className={styles.editorRole}>
                                    <DeleteOutlined />
                                </div>
                            </div>
                        </div>
                    )
                })
            : null
            }           
        </div>
        {   
            roles.length ? 
            <div className={styles.pagination} >
                <Pagination current={current} onChange={onChange} total={roles.length} defaultPageSize={15} defaultCurrent={1} />            
            </div>
            : null
        }
    </>    
    )
}