import store from "@/store";
import {isNotEmpty} from "@/uitls";

export const loginFilter = (url)=> {
    let rootUrl = url.split("/")[0];
    if(rootUrl==="utils"||rootUrl==="shows"||rootUrl==="users"){
        return true;
    }
    const loginUser = store.state.loginUser;
    if(isNotEmpty(loginUser.userId)){
        return true;
    }
    store.commit("closeCommentDialog");
    store.commit("openLoginDialog");
    return false;
}