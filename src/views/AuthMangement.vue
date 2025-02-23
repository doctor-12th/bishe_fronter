<template>
  <el-card class="file-list-card">
    <h2>文件列表</h2>
    <el-table :data="fileStore.departfiles" style="width: 100%">
      <el-table-column prop="id" label="文件ID" width="120"></el-table-column>
      <el-table-column prop="filename" label="文件名" width="200"></el-table-column>
      <el-table-column prop="permission" label="当前权限" width="150">
        <template #default="scope">
          <el-tag :type="getPermissionTagType(scope.row.permission)">
            {{ scope.row.permission }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-select
            v-model="scope.row.newPermission"
            placeholder="修改权限"
            @change="updatePermission(scope.row)"
          >
            <el-option label="私有" value="private_"></el-option>
            <el-option label="部门内公开" value="department"></el-option>
            <el-option label="完全公开" value="public_"></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useFileStore } from '@/stores/files'
const fileStore = useFileStore()

// 修改文件权限
const updatePermission = async (file) => {
  console.log(file.newPermission)
  var data = {
    'permission':file.newPermission
  }
  try {
    const response = await axios.post(
      `file/${file.id}/permission`,
      data,
      {
        headers: {
          'token': localStorage.getItem('token') ,
          'Content-Type': 'multipart/form-data',
        }

      }
    );
    console.log(response)
    fileStore.fetchDepartFiles()
  } catch (error) {
    ElMessage.error('权限修改失败,请检查网络或文件ID是否正确',error);
  }
};
const getPermissionTagType = (permission) => {
  switch (permission) {
    case 'private_':
      return 'danger';
    case 'department':
      return 'warning';
    case 'public_':
      return 'success';
    default:
      return 'info';
  }
};

onMounted(() => {
  fileStore.fetchDepartFiles()
});
</script>

<style scoped>
.file-list-card {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
}
</style>
