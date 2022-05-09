import dayjs from "dayjs";

/*数据判空，不为空返回true*/
export const isNotEmpty = (data) => {
    return !(typeof data === 'undefined' || data === null || data === '');
};

/*处理时间*/
export const getTime = (createTime) => {
    let time = (new Date()).getTime() - (new Date(createTime)).getTime();
    if ((time / (1000 * 60 * 60)) > 24) {
        //发布时间已经超过24小时
        return dayjs(createTime).format("MM-DD");
    } else if ((time / (1000 * 60 * 60)) > 1) {
        //发布时间超出1小时
        return Math.floor(time / (1000 * 60 * 60)) + "小时前";
    } else if ((time / (1000 * 60)) > 1) {
        //发布时间超出1分钟
        return Math.floor(time / (1000 * 60)) + "分钟前";
    }
    return "刚刚";
};

/*获取分区*/
export const getPartitionName = (partitionId) => {
    if (partitionId === 1) {
        return "酒馆";
    } else if (partitionId === 2) {
        return "攻略";
    } else if (partitionId === 3) {
        return "官方";
    }
    return "";
};