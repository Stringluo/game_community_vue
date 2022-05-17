import {ajax} from "@/api/ajax";
import {isNotEmpty} from "@/uitls";

/**
 * shows路径下为可视数据，无需登录
 */
/*获取帖子数据*/
export const getPostList = (postPage) => {
    return ajax("shows/getPostList", postPage, "POST");
};
/*获取首页轮播图数据*/
export const getNewOfficial = () => {
    return ajax("shows/getNewOfficial");
};
/*获取帖子数据*/
export const getPostData = (postPage) => {
    if (isNotEmpty(postPage.postId)) {
        return ajax("shows/getPostData", postPage, "POST");
    }
};
/*获取帖子简要数据*/
export const getPost = (postId) => {
    return ajax("shows/getPost/" + postId);
};
/*根据用户Id获取用户信息*/
export const getUserById = (id) => {
    return ajax("shows/getUserById/" + id);
};
/*根据评论id获评论信息*/
export const getCommentById = (id) => {
    return ajax("shows/getCommentById/" + id);
};
/*获取评论列表*/
export const getCommentsByPage = (page) => {
    return ajax("shows/getCommentsByPage", page, "POST");
};

/**
 * utils路径下为一些公有工具类接口
 */
/*请求后端，重置后端session生命周期*/
export const refreshSession = () => {
    return ajax("utils/refreshSession");
};
/*请求后端session中loginUser的登陆状态*/
export const hasLoginUser = () => {
    return ajax("utils/hasLoginUser");
};

/**
 * users路径下为用户的操作
 */
/*根据密码登录*/
export const loginByPassword = (user) => {
    return ajax("users/doLoginByPassword", user, "POST");
};
/*根据验证码登录*/
export const loginByVCode = (user) => {
    return ajax("users/doLoginByCode", user, "POST");
};
/*type为请求验证码的方式，分为登录和注册（login/register）*/
export const getVCode = (userMail, type) => {
    return ajax("users/getCode/" + userMail + "/" + type);
};
/*注册用户*/
export const registerUser = (user) => {
    return ajax("users/register", user, "POST");
};
/*验证验证码操作*/
export const verifyCode = (user) => {
    return ajax("users/verifyCode", user, "POST");
};
/*使用cookie登录*/
export const loginByCookie = () => {
    return ajax("users/doLoginByCookie");
};

/**
 * 需要登录权限的后端操作
 */
/*修改密码*/
export const changePassword = (user) => {
    return ajax("loginUsers/changePassword", user, "POST");
};
/*退出登录*/
export const logoutUser = () => {
    return ajax("loginUsers/logoutUser");
};
/*后端删除图片*/
export const clearImg = (img) => {
    return ajax("loginUsers/clearAvatar", img, "POST");
};
/*修改用户信息*/
export const editUser = (user) => {
    return ajax("loginUsers/editUser", user, "POST");
};
/*注销session操作*/
export const destroySession = () => {
    return ajax("loginUsers/destroySession");
};
/*关注用户*/
export const focusUser = (focusUserId) => {
    return ajax("loginUsers/focusUser/" + focusUserId);
};
/*取消关注用户*/
export const cancelFocusUser = (focusUserId) => {
    return ajax("loginUsers/cancelFocusUser/" + focusUserId);
};

/**
 * 对帖子数据进行操作（需要用户登录）
 */
/*发布帖子*/
export const releasePost = (post) => {
    return ajax("posts/releasePost", post, "POST");
};
/*修改帖子*/
export const editPost = (post) => {
    return ajax("posts/editPost", post, "POST");
};
/*删除帖子*/
export const deletePost = (postId) => {
    return ajax("posts/deletePost/" + postId, null, "DELETE");
}

/**
 * 对评论数据进行操作（需要用户登录）
 */
/*发表评论*/
export const commentPost = (comment) => {
    return ajax("comments/commentPost", comment, "POST");
};
/*评论帖子*/
export const commentComment = (comment) => {
    return ajax("comments/commentComment", comment, "POST");
}

/**
 * 用户对帖子以及评论进行的操作
 */
/*点赞帖子*/
export const likePost = (action) => {
    return ajax("actions/likePost", action, "POST");
};
/*取消点赞帖子*/
export const cancelLikePost = (action) => {
    return ajax("actions/cancelLikePost", action, "POST");
};
/*收藏帖子*/
export const collectionPost = (action) => {
    return ajax("actions/collectionPost", action, "POST");
};
/*取消收藏帖子*/
export const cancelCollectionPost = (action) => {
    return ajax("actions/cancelCollectionPost", action, "POST");
};
/*点赞评论*/
export const likeComment = (action) => {
    return ajax("actions/likeComment", action, "POST");
};
/*取消点赞评论*/
export const cancelLikeComment = (action) => {
    return ajax("actions/cancelLikeComment", action, "POST");
};