<template>
  <div class="admin-page">
    <!-- 文件列表 -->
    <el-card class="file-list">
      <h2>文件列表</h2>
      <el-table :data="fileStore.departfiles" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="filename" label="文件名" />
        <!-- <el-table-column prop="size" label="文件大小" /> -->
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column prop="departmentId" label="部门Id" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewVersions(scope.row.id)">查看版本</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 文件版本列表 -->
    <el-card class="version-list" v-if="selectedFileId" v-show="is_show">
      <h2>文件版本列表 - 文件ID: {{ selectedFileId }}</h2>
      <el-table :data="versions" stripe>
        <el-table-column prop="version" label="版本号" width="100" />
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column prop="changes" label="变更描述" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="warning" size="small" @click="revertFile(selectedFileId, scope.row.version)">回滚</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

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
      <el-table :data="fileStore.logs" stripe>
        <el-table-column prop="id" label="日志ID" width="80" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="action" label="操作类型" width="120" />
        <el-table-column prop="details" label="具体操作" width="100" />
        <el-table-column prop="createdAt" label="时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useFileStore } from '@/stores/files'
const fileStore = useFileStore()
// 文件列表
var is_show = ref(false)
const selectedFileId = ref(null);

// 文件版本列表
const versions = ref([]);

// 系统日志
// const logs = ref([]);
const logFilter = ref({
  startTime: null,
  endTime: null,
});

// 获取文件列表
const  fetchDepartFiles= async ()=>{
  fileStore.fetchDepartFiles()
}
// 查看文件版本
const viewVersions = async (fileId) => {
  selectedFileId.value = fileId;
  try {
    const response = await axios.get(`/admin/files/${fileId}/versions`, {
      headers: { 'token': localStorage.getItem('token') },
      'Content-Type': 'multipart/form-data',
    });
    versions.value = response.data;
    is_show.value = !is_show.value
  } catch (error) {
    console.error('获取文件版本失败:', error);
  }
};

// 回滚文件版本
const revertFile = async (fileId, version) => {
    var data = {
      'fileId':fileId,
      'versionId':version,
    }
    await axios.post(
      '/admin/files/revert',
      data,
      { headers: { Token: localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data'
      } }
    ).then((response)=>{
      console.log(response)
        ElMessage({
        message: '回滚成功',
        type: 'success',
         })
      viewVersions(fileId)
    }).catch((error)=>{
      ElMessage.error(error.response?.data?.message || '回滚失败')
    })

};

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
