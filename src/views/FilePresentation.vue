<script setup>
import { ref, onMounted,computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useFileStore } from '@/stores/files'
import { DocumentCopy, InfoFilled } from '@element-plus/icons-vue'

const fileStore = useFileStore()
const uploadRef = ref()
const fileList = ref(fileStore.files)
const selectedType = ref('all')
const searchQuery = ref('')
// 文件类型选项
const filePage = ref({ currentPage: 1, pageSize: 10 });
const paginatedFiles = computed(() => {
  const start = (filePage.value.currentPage - 1) * filePage.value.pageSize;
  const end = start + filePage.value.pageSize;
  // console.log(fileStore.selectfiles.slice(start, end))
  // debugger
  return fileStore.selectfiles.slice(start, end);
});
const typeOptions = [
  { value: '所有类型', label: '所有类型' },
  { value: '图片', label: '图片' },
  { value: '文档', label: '文档' },
  { value: '视频', label: '视频' }
]
// 分页事件处理
const handleFilePageChange = (page) => {
  filePage.value.currentPage = page;
};

const handleFilePageSizeChange = (size) => {
  filePage.value.pageSize = size;
};
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
const shareCodeDialogVisible = ref(false)
const shareCodeInput = ref('')

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
  fileStore.getShareFile(shareCodeInput.value)
  shareCodeDialogVisible.value = false
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
  console.log({
    search: searchQuery.value,
    type: selectedType.value
  })
  fileStore.applyFilters({
    search: searchQuery.value,
    type: selectedType.value
  })
}
onMounted(() => {
  // console.log(fileStore.files.length)
  // if (!fileStore.files.length) {
    fileStore.fetchFiles()
  // }

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
      <div style="height: 40px;width:100%;padding-left: 50px;">
        <el-input v-model="searchQuery" placeholder="搜索文件" @change="fileStore.searchFiles(searchQuery)" />
      </div>

      <el-upload style="font-size:20px;"
        ref="uploadRef"
        :http-request="fileUpload"
        :auto-upload="false"
        :on-change= "handleFileChange"
      >
      <template #trigger>
        <el-button size= "large" type="primary" style="font-size:18px;">选择文件</el-button>
      </template>


      </el-upload>
      <el-button size= "large" type="success" @click="uploadRef.submit()" style="font-size:18px;">上传文件</el-button>
      <el-button size="large" type="primary" @click="shareCodeDialogVisible = true" style="font-size:18px;">获取分享文件</el-button>
      <el-dialog
    v-model="shareCodeDialogVisible"
    title="获取分享文件"
    width="30%"
  >
    <div class="share-code-container">
      <el-input
        v-model="shareCodeInput"
        placeholder="请输入分享链接"
        clearable
      >
        <template #prepend>
          <el-icon><Link /></el-icon>
        </template>
      </el-input>

      <div class="tip-text">
        <el-icon><InfoFilled /></el-icon>
        <span>请粘贴完整的文件分享链接</span>
      </div>

      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="getShareFile"
        >
          获取文件
        </el-button>
      </div>
    </div>
  </el-dialog>
    </div>

    <el-table :data="paginatedFiles" style="width: 100%;">
      <el-table-column prop="filename" label="文件名" />
      <el-table-column prop="createdAt" label="创建时间"/>
      <el-table-column prop="departmentId" label="所属部门"/>
      <el-table-column prop="fileType" label="类型" />
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button @click="fileStore.downloadFile(row)">下载</el-button>
          <el-button type="danger" @click="fileShare(row)">分享</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="filePage.currentPage"
        v-model:page-size="filePage.pageSize"
        :total="fileStore.files.length"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleFilePageSizeChange"
        @current-change="handleFilePageChange"
      />
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
  </div>
</template>
<style scoped>
/* 全局布局 */
.file-manager {
  /* display: flex; */
  padding: 24px;
  /* background-color: #f5f7fa; */
  /* min-height: 100vh; */
  width:100%;
}
.share-code-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-text {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 12px;

  .el-icon {
    color: #409eff;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
/* 工具栏样式 */
.toolbar {
  display: flex;
  /* align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); */
  gap: 16px;
  width: 100%;
  margin-bottom: 24px;
}
:deep(.el-upload-list__item){
  width:100px
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
