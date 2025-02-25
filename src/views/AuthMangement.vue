<template>
  <el-card class="file-list-card">
    <h2>文件列表</h2>
    <el-table :data="paginatedFiles" style="width: 100%">
      <el-table-column prop="id" label="文件ID" width="120"></el-table-column>
      <el-table-column prop="filename" label="文件名" width="400"></el-table-column>
      <el-table-column prop="permission" label="当前权限" width="300" >
        <template #default="scope">
          <el-tag :type="getPermissionTagType(scope.row.permission)">
            {{ formatPermission(scope.row.permission) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope" >
          <el-select
          style="width:100px"
            v-model="scope.row.newPermission"
            placeholder="修改权限"
            @change="updatePermission(scope.row)"
          >
            <el-option label="私有" value="private_" size="small"></el-option>
            <el-option label="部门内公开" value="department" size="small"></el-option>
            <el-option label="完全公开" value="public_" size="small"></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="filePage.currentPage"
        v-model:page-size="filePage.pageSize"
        :total="fileStore.departfiles.length"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleFilePageSizeChange"
        @current-change="handleFilePageChange"
      />
  </el-card>
</template>

<script setup>
import { onMounted,ref,computed } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useFileStore } from '@/stores/files'
const fileStore = useFileStore()
const filePage = ref({ currentPage: 1, pageSize: 10 });
const paginatedFiles = computed(() => {
  const start = (filePage.value.currentPage - 1) * filePage.value.pageSize;
  const end = start + filePage.value.pageSize;
  return fileStore.departfiles.slice(start, end);
});
const handleFilePageChange = (page) => {
  filePage.value.currentPage = page;
};

const handleFilePageSizeChange = (size) => {
  filePage.value.pageSize = size;
};
// 修改文件权限
const updatePermission = async (file) => {
  // console.log(file.newPermission)
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
const formatPermission = (row)=> {
  // console.log(row.permission)
  switch (row) {
    case 'private_':
      return '私有';
    case 'department':
      return '部门内可见';
    case 'public_':
      return '完全公开';
    default:
      return 'info';
  }
}
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
  /* max-width: 800px; */
  width:100%;
  /* margin: 50px auto; */
  /* padding: 20px; */
}
</style>
