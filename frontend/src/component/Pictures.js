import { Button,Pagination, Form, Modal,  message, Upload } from "antd"

import {  InboxOutlined  } from '@ant-design/icons'
import { useEffect, useState } from "react"
import styles from "./Pictures.module.css"
import request from "../assets/utils";
import { useLocation } from "react-router"
import getTime from "../assets/getTime";
const { Dragger } = Upload;


export default function Pictures() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const location = useLocation()
    const [form] = Form.useForm()


   
    useEffect(() => {
        console.log(location);
    },[location])

    const showModal = () => {
        setIsModalVisible(true);
      };
    
    const handleOk = () => {
        console.log(form.getFieldsValue());
        const file = form.getFieldValue().upload.file
        console.log(file);
        let formData = new FormData()
        formData.append("filename", file)
        console.log(formData);
        for(let [item,value] of formData.entries()) {
            console.log(item);
            console.log(value);
        }
        request.post("/api/upload",{body: formData}, {
            headers: {
            "Content-Type": "multipart/form-data",
        }})
        // request.post("/api/upload",formData,{
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     }
        // })
            .then((res) => {
                console.log(res);
                message.success("上传成功")
            })
            .catch((err) => {
                message.error("上传失败")
            })
    };

    const handleCancel = () => {
    setIsModalVisible(false);
    };

    // const props = {
    //     name: 'file',
    //     action: '/api/upload',
    //     headers: {
    //         "Content-Type": "multipart/form-data",
    //         "Authorization" : `Bearer ${window.localStorage.getItem("token")}`
    //     }
    // }
    const props = {
        name: 'file',
        action: '/api/upload',
        headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
        },
        multiple: true,
        beforeUpload: (file) => {
            return false;
          },
    }
    
    return (
        <div>
            <div className={styles.picSetName}>{location.state.picsetName}</div>
            <div className={styles.picSetInfo}>               
                <div>{getTime(location.state.createdOn)}</div>
                <div>{location.state.notes}</div>
            </div>
            <div>
                <Button onClick={()=> {showModal()}} className={styles.button}>+ 添加图片</Button>
            </div>
            
            <Modal 
                title="新建数据集" 
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                width={800} 
                height={600} 
                bodyStyle={{overflowY: "scroll",height: "400px"}}
                >
                <Form
                    form={form}
                    labelCol={{
                    span: 4,
                    }}
                    wrapperCol={{
                    span: 20,
                    }}
                    layout="horizontal"
                >               
                    <Form.Item label="上传图片"  name="upload">                
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                            band files
                            </p>
                        </Dragger>
                    </Form.Item>
                    
                </Form>
                
            </Modal>
            <div className={styles.picturesContainer}>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名明明明明那个mmmmmm</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>
                <div className={styles.picture}>
                    <img src="/imgs/1.JPG" width={180} height={150} alt="" className={styles.img}></img>
                    <div className={styles.pictureName}>图片名</div>
                </div>

            </div>
            <div className={styles.pagination}>
                <Pagination defaultCurrent={6} total={500} />
            </div>

        </div>
    )
}