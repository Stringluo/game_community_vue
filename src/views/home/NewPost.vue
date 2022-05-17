<template>
  <div class="gc-new-post">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h4>发布帖子</h4>
      </div>
      <el-form ref="form" :model="post" label-width="15%">
        <el-form-item label="标题:">
          <el-input v-model="post.postTitle"
                    placeholder="标题（必填）"
                    maxlength="30"
                    show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <div id="toolbar-container"></div>
          <div id="editor-container"></div>
        </el-form-item>
        <el-form-item label="发布板块">
          <el-radio-group v-model="post.partitionId">
            <el-radio :label="1">酒馆</el-radio>
            <el-radio :label="2">攻略</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="release" style="width: 20%;margin-left: 40%">发布</el-button>
    </el-card>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css';
import {createEditor, createToolbar, SlateTransforms} from '@wangeditor/editor';
import $ from "jquery";
import {editPost, getPost, releasePost} from "@/api";

let editor;

export default {
  name: "NewPost",
  props: ["editPostId"],
  components: {},
  data() {
    return {
      editPost:Object,
      post: {
        postTitle: '',
        postArticle: '',
        postAbbreviation: '',
        partitionId: null,
        imgUrls: [],
      },
      releaseFlag: false,
    }
  },
  beforeDestroy() {
    if (!this.releaseFlag) {
      this.post.imgUrls.forEach((imgUrl) => {
        imgUrl.flag = false;
      });
      this.axios.post("posts/deleteOtherImg", this.post.imgUrls)
    }
  },
  methods: {
    async initEditPost(editPostId){
      let result = await getPost(editPostId);
      if(result.flag){
        this.post.postTitle = result.data.postTitle;
        this.post.partitionId = result.data.partitionId;
        editor.dangerouslyInsertHtml(result.data.postArticle);
      }
    },
    release(){
      if(this.editPostId){
        //编辑帖子
        this.editorPost();
      }else {
        //发布新的帖子
        this.releasePost();
      }
    },
    async editorPost() {
      let postArticle = editor.getHtml();
      this.post.postId = this.editPostId;
      this.post.postArticle = postArticle;
      this.post.postAbbreviation = editor.getText().replace(/\s+/g, "").substring(0, 200);
      this.post.imgUrls.forEach((imgUrl) => {
        if (!postArticle.includes(imgUrl.url)) {
          imgUrl.flag = false;
        }
      });
      let result = await editPost(this.post);
      if (result.flag) {
        this.releaseFlag = true;
        //alert("修改成功");
        await this.$router.push("/");
      }
    },
    async releasePost() {
      let postArticle = editor.getHtml();
      this.post.postArticle = postArticle;
      this.post.postAbbreviation = editor.getText().replace(/\s+/g, "").substring(0, 200);
      this.post.imgUrls.forEach((imgUrl) => {
        if (!postArticle.includes(imgUrl.url)) {
          imgUrl.flag = false;
        }
      });
      let result = await releasePost(this.post);
      if (result.flag) {
        this.releaseFlag = true;
        //alert("发布成功");
        await this.$router.push("/");
      }
    },
    initEditor() {
      let toolEle = $("#toolbar-container");
      let editorEle = $("#editor-container");
      let top = toolEle.offset().top;
      let left = toolEle.offset().left;
      let width = toolEle.width();
      let height = toolEle.height();
      window.onscroll = function () {
        if ($(window).scrollTop() > (top - 60)) {
          //让工具栏固定定位.
          toolEle.css({
            position: 'fixed',
            top: 60,
            left: left,
            width: width
          });
          //设置编辑框的margin-top的值为工具栏的高度.
          editorEle.css({
            marginTop: height + 60
          });
        } else {
          //让工具栏定位还原.
          toolEle.css({
            position: 'static',
            top: 0,
            left: 0
          });
          //设置编辑框的margin-top的值为原来的值.
          editorEle.css({
            marginTop: 10
          });
        }
      }
      let _this = this;
      let BASEURL = this.$store.state.BASEURL;
      const editorConfig = {MENU_CONF: {}}
      editorConfig.placeholder = '请尽情发挥吧...';
      editorConfig.maxLength = 30000;
      editorConfig.MENU_CONF['uploadImage'] = {
        // 自定义插入图片
        customInsert(res, insertFn) {
          // 从 res 中找到 url alt href ，然后插图图片
          insertFn(BASEURL + res.data.url, res.data.alt, res.data.href);
          let imgUrl = {
            "url": res.data.url,
            "flag": true,
          };
          _this.post.imgUrls.push(imgUrl);
        },
        server: 'http://localhost:80/posts/uploadImg',
        // form-data fieldName ，默认值 'wangeditor-uploaded-image'
        fieldName: 'file',

        // 单个文件的最大体积限制，默认为 2M
        maxFileSize: 2 * 1024 * 1024, // 2M

        // 最多可上传几个文件，默认为 100
        maxNumberOfFiles: 10,

        // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        allowedFileTypes: ['image/*'],

        // 将 meta 拼接到 url 参数中，默认 false
        metaWithUrl: false,

        // 跨域是否传递 cookie ，默认为 false
        withCredentials: true,

        // 超时时间，默认为 10 秒
        timeout: 5 * 1000, // 5 秒

      };
      editor = createEditor({
        selector: '#editor-container',
        config: editorConfig,
        mode: 'simple',
      });

      const toolbarConfig = {
        toolbarKeys: [
          'uploadImage', 'divider', 'insertLink', 'bold', 'italic',
          'header1', 'header2', 'color',
          'justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify',
          '|', 'undo', 'redo'
        ]
      };
      const toolbar = createToolbar({
        editor,
        selector: '#toolbar-container',
        config: toolbarConfig,
      });
    }
  },
  async mounted() {
    this.initEditor();
    await this.initEditPost(this.editPostId);
  }
}
</script>

<style scoped>
/*编辑器工具栏部分*/
#toolbar-container {
  border: #DCDFE6 1px solid;
  z-index: 1000;
}

/*编辑器内容部分*/
#editor-container {
  min-height: 400px;
  border: #DCDFE6 1px solid;
}
</style>