import axios from 'axios'
import {loginFilter} from "@/filter";

/**
 * 1 封装了发送ajax请求的函数
 * 2 使用axios来封装ajax请求
 * 3 使用按需导出
 */

/**
 *
 * @param url 请求的地址
 * @param data 请求的数据
 * @param type 请求的类型
 * @return Promise 返回对象
 */
export function ajax(url, data = {}, type = 'GET') {
    return new Promise(function (resolve, reject) {
        /*后端请求请求拦截验证是否登录*/
        if(!loginFilter(url)){
            return null;
        }
        url = "api/" + url;
        let promise;
        if (type === 'GET') {
            //get请求，参数是key=value的字符串
            //data是一个对象，遍历对象
            let queryStr = '';
            Object.keys(data).forEach(key => {
                queryStr += key + '=' + data[key] + '&';
            })
            //去除最后一个&符号
            if (queryStr !== '') {
                queryStr = queryStr.substring(0, queryStr.lastIndexOf('&'))
            }
            promise = axios.get(url, queryStr);

        } else if (type === 'POST') {
            promise = axios.post(url, data);
        } else if (type === 'PUT') {
            promise = axios.put(url, data);
        } else if (type === 'PATCH') {
            promise = axios.patch(url, data);
        } else if (type === 'DELETE') {
            promise = axios.delete(url, data);
        }

        //返回结果的处理
        promise.then(function (response) {
            if (!response.data.flag) {
                console.log(response.data.msg);
            }
            resolve(response.data);
        }).catch(function (err) {
            reject(err)
        })
    });
}

