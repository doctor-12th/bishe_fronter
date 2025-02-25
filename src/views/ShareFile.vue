<script setup>
import { ref, onMounted,computed } from 'vue'
// import { ElMessage} from 'element-plus'
import { useFileStore } from '@/stores/files'




const fileStore = useFileStore()
const filePage = ref({ currentPage: 1, pageSize: 10 });
const paginatedShareFiles = computed(() => {
  const start = (filePage.value.currentPage - 1) * filePage.value.pageSize;
  const end = start + filePage.value.pageSize;
  return fileStore.selectsharefiles.slice(start, end);
});
// 分页事件处理
const handleFilePageChange = (page) => {
  filePage.value.currentPage = page;
};

const handleFilePageSizeChange = (size) => {
  filePage.value.pageSize = size;
};
const selectedType = ref('all')
const searchQuery = ref('')
// 文件类型选项
const typeOptions = [
  { value: '所有类型', label: '所有类型' },
  { value: '图片', label: '图片' },
  { value: '文档', label: '文档' },
  { value: '视频', label: '视频' }
]

// 触发筛选
const handleFilter = () => {
  fileStore.applyShareFilters({
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
  <div class="file-manager" style="padding: 3%;">
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
      <el-input v-model="searchQuery" placeholder="搜索文件" @change="fileStore.searchShareFiles(searchQuery)" />
    </div>

    <el-table :data="paginatedShareFiles" style="width: 100%">
      <el-table-column prop="fileName" label="文件名" />
      <el-table-column prop="sharePersonName" label="被分享人" />
      <el-table-column prop="permission" label="权限" />
      <el-table-column prop="shareTime" label="分享时间" />
      <el-table-column label="操作" width="180">
        <template #default="{row}">
          <el-button @click="cancelSharedFile(row)"> {{ row.isShared ? '取消分享' : '已取消' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        v-model:current-page="filePage.currentPage"
        v-model:page-size="filePage.pageSize"
        :total="fileStore.sharefiles.length"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleFilePageSizeChange"
        @current-change="handleFilePageChange"
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
