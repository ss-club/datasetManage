import styles from "./LeftNav.module.css"
import { UserOutlined, DatabaseOutlined  } from '@ant-design/icons';
import { useState } from "react";
import { Link } from "react-router-dom";


export default function LeftNav() {
    const [selected, setSelected] = useState(true)
    const showModel = () => {
        const role = window.localStorage.getItem("role")
        if(role === "marker") {
            return (
                <>
                    <div className={ `${styles.items} ${styles.selected}` } >
                        <DatabaseOutlined /> <span>图片标注</span> 
                    </div>
                </>
            )
        } else {
            return (
                <>
                <Link to="/picSets">
                    <div className={selected ? `${styles.items} ${styles.selected}` : styles.items} 
                        onClick={()=> {
                            setSelected(true)
                        }}>
                        <DatabaseOutlined />  项目数据管理
                    </div>
                </Link>
                <Link to="/roles">
                    <div className={!selected ? `${styles.items} ${styles.selected}` : styles.items}
                        onClick={()=> {
                            setSelected(false)
                        }}>
                        <UserOutlined />  角色管理
                    </div>
                </Link>
            </>
            )
            
        }
    }
    
    return (
        <div className={styles.leftNavContainer}>
            <div className={styles.logo}>赛题六</div>            
            {showModel()}
        </div>
    )
}