// src/stores/files.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export const useFileStore = defineStore('files', {
  state: () => ({
    files: [],
    departfiles:[],
    logs:[],
    sharefiles:[],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 15
    },
    searchQuery: '',
    shareLink:''
  }),

  actions: {
    BeforeUnload(file){
      const validTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg'];
      const extension = file.name.split('.').pop().toLowerCase();
      const isSizeValid = file.size / 1024 / 1024 < 50;

      if (!validTypes.includes(extension)) {
        ElMessage.error('文件类型不支持');
        return false;
      }
      if (!isSizeValid) {
        ElMessage.error('文件大小超过50MB限制');
        return false;
      }
      return true;
    },
    fileUpload(options){
        // formData.append('userId', '123');
          console.log(options)
          axios.post('file/upload'
            , options, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'token': `${localStorage.token}`
          },
        }
      ).then(response => {
          // this.files = response.data
          console.log(response)
          ElMessage({
            message:  `${options.file.name} 上传成功`,
            type: 'success',
          })
        }).catch(error => {
          console.log(error)
          ElMessage({
            message: error || '上传失败',
            type: 'error',
          })
          });
    },
    fetchShareFiles() {
      var token = localStorage.getItem('token')
      axios.get('share/shareByUser',{
        headers: {
          'token': `${token}`,
        }}).then(response => {

            // console.log(response.data)
            this.sharefiles = response.data
            this.sharefiles = this.sharefiles.map(file => ({
              ...file,
              isShared:true

            }))
            console.log(this.sharefiles)
            ElMessage({
              message: '获取文件成功',
              type: 'success',
            })
      }).catch(error => {
        console.log(error)
      })
    },
    fetchFiles() {
      var token = localStorage.getItem('token')
      axios.get('file',{
        headers: {
          'token': `${token}`,
        }}).then(response => {
            this.files = response.data
            this.files = this.files.map(file => ({
              ...file,
              fileType: this.getFileType(file.filename), // 添加类型字段

            }))
            // console.log(response.data)
            ElMessage({
              message: '获取文件成功',
              type: 'success',
            })
      }).catch(error => {
        console.log(error)
      })
    },
    getFileType(fileName){
      const ext = fileName.split('.').pop().toLowerCase()
      const typeMap = {
        jpg: '图片',
        jpeg: '图片',
        png: '图片',
        gif: '图片',
        doc: '文档',
        docx: '文档',
        pdf: '文档',
        txt: '文档',
        xls: '文档',
        mp4: '视频',
        mov: '视频',
        // zip: 'archive',
        // rar: 'archive'
      }
      return typeMap[ext] || 'other'
    },
    searchFiles(query) {
      console.log(query)
      if (query == ''){
        this.fetchFiles()
        return
      }
      this.files = this.files.filter(file =>
        file.filename.toLowerCase().includes(query.toLowerCase())
      )
      console.log(this.files)
    },
    applyFilters(filters) {
      // 合并筛选条件
      this.filters = {
        search: filters.search,
        type: this.filters.type,
        ...filters
      }

      // 执行复合筛选
      this.filteredFiles = this.files.filter(file => {
        const matchType = this.filters.type === 'all'
          ? true
          : file.fileType === this.filters.type

        return matchType
      })

      // 更新分页总数（如果后端分页需调整）
      this.pagination.total = this.filteredFiles.length
    },
    matchType(file) {
      if (this.filters.type === 'all') return true
      return file.type === this.filters.type
    },
    downloadFile(row){
      // console.log(row.id)
      var token = localStorage.getItem("token")
      fetch(`http://10.20.228.101:8080/file/${row.id}/download`, {
        method: 'GET',
        headers: {
          'token': `${token}`,
      }}).then(async (response)=>{
        // response=response.blob()
        // console.log(response)
        // 获取文件名
        const filename = row.filename

        // 转换响应为Blob
        const blob = await response.blob()

        // 创建下载链接
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()

        // 清理资源
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }).catch((error)=>{
        console.log(error)
      })
    },
    async fileShare(row){
      var data = {
        "fileId":row.id,
        "permission":"write"
      }
      try{
        const response = await axios.post('share/generate'
          , data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': `${localStorage.token}`
            },
          }
        )
        console.log(response)
          // this.shareLink=response.data
          // console.log(this.shareLink)
        return response.data
      } catch(error){
        console.log(error)
        ElMessage({
          message: error.response.data || '获取文件失败',
          type: 'error',
        })
      }
    },
    getShareFile(){
      var token = localStorage.getItem('token')
      var data = {
        "shareCode":'test-code'
      }
      axios.post('share/use',data,{
        headers: {
          'token': `${token}`,
          'Content-Type': 'multipart/form-data'
        }}).then(response => {
            console.log(response)
            ElMessage({
              message: '获取文件成功',
              type: 'success',
            })
      }).catch(error => {
        console.log(error)
        // ElMessage({
        //   message: error.response.data || '获取文件失败',
        //   type: 'error',
        // })
      })
    },
    cancelSharedFile(row){

      var data = {
        'fileId':row.fileId,
        'targetId':row.targetId
      }
      axios.post('/share/cancel'
        , data, {
        headers: {
        'Content-Type': 'multipart/form-data',
        'token': `${localStorage.token}`
          },
        }
      ).then((response)=>{
        console.log(response)
      }).catch((error)=>{
        console.log(error)
      })
      // console.log(row,token)

    },
    async fetchDepartFiles(){
      try {
        const response = await axios.get('/admin/files', {
          headers: { Token: localStorage.getItem('token') },
          'Content-Type': 'multipart/form-data',
        });
        this.departfiles = response.data;
        // console.log(this.departfiles.length)
      } catch (error) {
        console.error('获取文件列表失败:', error.data);
      }
    },
    async fetchLogs(logFilter){
      try {
        const startTimestamp = logFilter.value.startTime ? new Date(logFilter.value.startTime).getTime() : null;
        const endTimestamp = logFilter.value.endTime ? new Date(logFilter.value.endTime).getTime() : null;
        var data = {
            'startTime': startTimestamp,
            'endTime': endTimestamp,
        }
        // console.log(data)

        const response = await axios.post('/admin/logs', data,{
          headers: {
            Token: localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data'
           },

        });
        this.logs = response.data;
        console.log(this.logs[0])
      } catch (error) {
        console.error('获取日志失败:', error);
      }
    }
  }
})

// 测试数据生成器
// const generateMockFiles = (count = 15, startId = 1000) => {
//   const fileTypes = [
//     { type: '文档', ext: ['doc', 'docx', 'pdf', 'txt'] },
//     { type: '图片', ext: ['jpg', 'png', 'gif', 'webp'] },
//     { type: '压缩包', ext: ['zip', 'rar', '7z'] },
//     { type: '视频', ext: ['mp4', 'mov', 'avi'] }
//   ]

//   return Array.from({ length: count }, (_, i) => {
//     const type = fileTypes[i % fileTypes.length]
//     const ext = type.ext[i % type.ext.length]
//     const size = (Math.random() * 1024 * 1024 * 10 + 1024).toFixed(0) // 1KB - 10MB

//     return {
//       fileId: startId + i,
//       fileName: `${mockFileNames[i % mockFileNames.length]}_v${i+1}.${ext}`,
//       fileSize: parseInt(size),
//       uploadTime: mockDates[i % mockDates.length],
//       owner: i % 2 ? '张三' : '李四'
//     }
//   })
// }

// // 多样化文件名模板
// const mockFileNames = [
//   '年度财务报告',
//   '产品设计原型',
//   '用户调研数据',
//   '系统备份文件',
//   '项目进度计划',
//   '客户合同协议',
//   '会议纪要',
//   '测试报告',
//   '代码仓库备份',
//   '营销活动素材',
//   '数据库导出',
//   '操作手册',
//   '安全审计日志',
//   '架构设计图',
//   '培训视频录制'
// ]

// // 随机日期生成（最近30天）
// const mockDates = Array.from({ length: 15 }, () =>
//   new Date(Date.now() - Math.random() * 30 * 86400000).toISOString()
// )

// // 示例输出结构
// /*
// {
//   fileId: 1001,
//   fileName: "产品设计原型_v2.jpg",
//   fileSize: 5242880, // 5MB
//   uploadTime: "2023-07-15T08:23:15.123Z",
//   owner: "李四"
// }
// */
