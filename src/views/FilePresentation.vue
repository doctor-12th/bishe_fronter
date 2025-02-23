<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useFileStore } from '@/stores/files'
import { DocumentCopy, InfoFilled } from '@element-plus/icons-vue'

const fileStore = useFileStore()
const uploadRef = ref()
const fileList = ref(fileStore.files)
const selectedType = ref('all')
const searchQuery = ref('')
// 文件类型选项
const typeOptions = [
  { value: 'all', label: '所有类型' },
  { value: 'image', label: '图片' },
  { value: 'document', label: '文档' },
  { value: 'video', label: '视频' }
]
const shareDialogVisible = ref(false)
const shareLink = ref('')
const isCopying = ref(false)
// 文件选择变化时触发
const handleFileChange = (file, files) => {
  fileList.value = files;
};
const fileShare = async(row)=>{
  const link = await fileStore.fileShare(row,shareLink)
  shareDialogVisible.value = true
  shareLink.value = link
  console.log(link)

}
// // 上传前验证
// const beforeUpload = (file) => {
//   fileStore.beforeUpload(file)
// };
// 自定义上传逻辑
const fileUpload = async (options) => {
  // console.log(options)
  fileStore.fileUpload(options)
};
const getShareFile = ()=>{
  fileStore.getShareFile()
}

const copyShareLink = async () => {
  try {
    isCopying.value = true
    await navigator.clipboard.writeText(shareLink.value)
    ElMessage.success('链接已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动选择复制',err)
  } finally {
    isCopying.value = false
  }
}
// 超出文件数量限制
// const handleExceed = () => {
//   ElMessage.warning('最多上传1个文件');
// };
// 触发筛选
const handleFilter = () => {
  fileStore.applyFilters({
    search: searchQuery.value,
    type: selectedType.value
  })
}
onMounted(() => {
  // console.log(fileStore.files.length)
  if (!fileStore.files.length) {
    fileStore.fetchFiles()
  }

})
</script>

<template>
  <div class="file-manager">
    <div class="toolbar">
      <el-select
      v-model="selectedType"
      placeholder="文件类型"
      @change="handleFilter"
      style="width: 120px; margin-right: 12px;"
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="searchQuery" placeholder="搜索文件" @change="fileStore.searchFiles(searchQuery)" />

      <el-upload
        ref="uploadRef"
        :http-request="fileUpload"
        :auto-upload="false"
        :on-change= "handleFileChange"
      >
        <el-button type="primary">选择文件</el-button>

      </el-upload>
      <el-button type="success" @click="uploadRef.submit()">上传文件</el-button>
      <el-button type="primary" @click="getShareFile">分享</el-button>
    </div>

    <el-table :data="fileStore.files" style="width: 100%">
      <el-table-column prop="filename" label="文件名" />
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column prop="fileType" label="类型" />
      <el-table-column label="操作" width="180">
        <template #default="{row}">
          <el-button @click="fileStore.downloadFile(row)">下载</el-button>
          <el-button type="danger">删除</el-button>
          <el-button type="danger" @click="fileShare(row)">分享</el-button>
        </template>
      </el-table-column>
    </el-table>
      <!-- 分享链接对话框 -->
  <el-dialog
    v-model="shareDialogVisible"
    title="文件分享"
    width="30%"
    :close-on-click-modal="false"
  >
    <div class="share-content">
      <el-input
        v-model="shareLink"
        placeholder="正在生成链接..."
        :readonly="true"
        class="share-input"
      >
        <template #append>
          <el-button
            type="primary"
            :icon="DocumentCopy"
            @click="copyShareLink"
            :loading="isCopying"
          >
            复制链接
          </el-button>
        </template>
      </el-input>

      <div class="share-tips">
        <el-icon><InfoFilled /></el-icon>
        <span>该链接7天后失效,最多支持10次下载</span>
      </div>
    </div>
  </el-dialog>
    <el-pagination
      :current-page="fileStore.pagination.current"
      :page-size="fileStore.pagination.pageSize"
      :total="fileStore.pagination.total"
      @current-change="fileStore.fetchFiles"
    />
  </div>
</template>
<style scoped>
/* 全局布局 */
.file-manager {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 工具栏样式 */
.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 选择器样式 */
.el-select {
  width: 160px;
}

.el-input {
  flex: 1;
}

.el-button {
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* 表格样式 */
.el-table {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.el-table :deep(th) {
  background-color: #f8fafc;
  color: #333;
  font-weight: 600;
}

.el-table :deep(td) {
  border-bottom: 1px solid #e4e7ed;
}

/* 操作按钮样式 */
.el-button--danger {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.el-button--danger:hover {
  background-color: #e65c5c;
  border-color: #e65c5c;
}

/* 分页样式 */
.el-pagination {
  margin-top: 24px;
  text-align: right;
}

/* 分享对话框样式 */
.share-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.share-input {
  :deep(.el-input-group__append) {
    background-color: #409eff;
    color: white;
    border: none;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #3089e6;
    }
  }
}

.share-tips {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 12px;
  gap: 8px;

  .el-icon {
    font-size: 14px;
    color: #409eff;
  }
}

/* 上传按钮样式 */
.el-upload {
  display: inline-block;
}

/* 按钮统一风格 */
.el-button--primary,
.el-button--success {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3089e6;
    border-color: #3089e6;
  }
}

.el-button--success {
  background-color: #67c23a;
  border-color: #67c23a;

  &:hover {
    background-color: #5cb031;
    border-color: #5cb031;
  }
}
</style>
