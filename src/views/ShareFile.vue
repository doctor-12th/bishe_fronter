<script setup>
import { ref, onMounted } from 'vue'
// import { ElMessage} from 'element-plus'
import { useFileStore } from '@/stores/files'

const fileStore = useFileStore()
const selectedType = ref('all')
const searchQuery = ref('')
// 文件类型选项
const typeOptions = [
  { value: 'all', label: '所有类型' },
  { value: 'image', label: '图片' },
  { value: 'document', label: '文档' },
  { value: 'video', label: '视频' }
]

// 触发筛选
const handleFilter = () => {
  fileStore.applyFilters({
    search: searchQuery.value,
    type: selectedType.value
  })
}
const cancelSharedFile =(row)=>{
  fileStore.cancelSharedFile(row)
  row.isShared = false
}

onMounted(() => {
  fileStore.fetchShareFiles()
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
    </div>

    <el-table :data="fileStore.sharefiles" style="width: 100%">
      <el-table-column prop="fileName" label="文件名" />
      <el-table-column prop="sharePersonName" label="被分享人" />
      <el-table-column prop="permission" label="权限" />
      <el-table-column prop="shareTime" label="分享时间" />
      <el-table-column prop="isShared" label="分享" />
      <el-table-column label="操作" width="180">
        <template #default="{row}">
          <el-button @click="cancelSharedFile(row)"> {{ row.isShared ? '取消分享' : '已取消' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="fileStore.pagination.current"
      :page-size="fileStore.pagination.pageSize"
      :total="fileStore.pagination.total"
      @current-change="fileStore.fetchFiles"
    />
  </div>
</template>
<style scoped>
/* 添加选择器样式 */
.el-select {
  :deep(.el-input__wrapper) {
    background: #f8fafc;
    border-radius: 8px;
    box-shadow: none;
  }

  :deep(.el-input__inner) {
    font-size: 14px;
  }
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
</style>
