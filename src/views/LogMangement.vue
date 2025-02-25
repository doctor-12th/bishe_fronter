<template>
  <div class="admin-page">
    <!-- 系统日志 -->
    <el-card class="log-list">
      <h2>系统日志</h2>
      <div class="log-filter">
        <el-date-picker
          v-model="logFilter.startTime"
          type="datetime"
          placeholder="开始时间"
        />
        <el-date-picker
          v-model="logFilter.endTime"
          type="datetime"
          placeholder="结束时间"
        />
        <el-button type="primary" @click="fetchLogs">查询</el-button>
      </div>
      <el-table :data="paginatedLogs" stripe>
        <el-table-column prop="id" label="日志ID"/>
        <el-table-column prop="userId" label="用户ID"/>
        <el-table-column prop="action" label="操作类型"/>
        <el-table-column prop="details" label="具体操作"/>
        <el-table-column prop="createdAt" label="时间" />
      </el-table>
      <el-pagination
        v-model:current-page="logPage.currentPage"
        v-model:page-size="logPage.pageSize"
        :total="fileStore.logs.length"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleLogPageSizeChange"
        @current-change="handleLogPageChange"
      />
    </el-card>

  </div>
</template>

<script setup>
import { ref, onMounted ,computed} from 'vue';
import { useFileStore } from '@/stores/files'
const fileStore = useFileStore()

const logPage = ref({ currentPage: 1, pageSize: 10 });


// 系统日志
// const logs = ref([]);
const logFilter = ref({
  startTime: null,
  endTime: null,
});
const paginatedLogs = computed(() => {
  const start = (logPage.value.currentPage - 1) * logPage.value.pageSize;
  const end = start + logPage.value.pageSize;
  return fileStore.logs.slice(start, end);
});
const handleLogPageChange = (page) => {
  logPage.value.currentPage = page;
};
const handleLogPageSizeChange = (size) => {
  logPage.value.pageSize = size;
};

// 获取文件列表
const  fetchDepartFiles= async ()=>{
  fileStore.fetchDepartFiles()
}



// 获取系统日志
const  fetchLogs= async ()=>{
  fileStore.fetchLogs(logFilter)
}

// 初始化加载文件列表和日志
onMounted(() => {
  if (fileStore.logs.length == 0) {
    fetchLogs();
  }
  if(fileStore.departfiles.length == 0) {
    fetchDepartFiles();
  }
});
</script>

<style scoped>
.admin-page {
  padding: 20px;
}
.file-list,
.version-list,
.log-list {
  margin-bottom: 20px;
}
.log-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
