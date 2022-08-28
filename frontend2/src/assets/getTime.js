export default function getTime(createdTime) {
    //得到项目建立时间
    let currentTime = Date.now();
    const secondTime = currentTime / 1000 - createdTime / 1000;
    const yearTime = Math.floor(secondTime / 3153600);
    const dayTime = Math.floor((secondTime % 3153600) / 86400);
    const hourTime = Math.floor(((secondTime % 3153600) % 86400) / 3600);
    const minuteTime = Math.floor(
      (((secondTime % 3153600) % 86400) % 3600) / 60
    )

    return secondTime < 60
    ? "刚刚"
    : `${yearTime > 0 ? `${yearTime}年` : ""}${
        dayTime > 0 ? `${dayTime}天` : ""
      }${hourTime > 0 ? `${hourTime}小时` : ""}${
        minuteTime > 0 ? `${minuteTime}分钟` : ""
      }前`;
} 