<template>
  <div class="department-management">
    <!-- 部门文件管理 -->
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>部门文件管理</span>
          <el-button type="primary" @click="showUploadDialog">上传部门文件</el-button>
        </div>
      </template>

      <!-- 文件筛选工具栏 -->
      <div class="toolbar">
        <el-select v-model="filterType" placeholder="文件类型" clearable>
          <el-option
            v-for="item in fileTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />

        <el-input
          v-model="searchKeyword"
          placeholder="搜索文件名称"
          clearable
          style="width: 300px"
        />
      </div>

      <!-- 文件列表 -->
      <el-table
        :data="filteredFiles"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="fileName" label="文件名称" sortable>
          <template #default="{row}">
            <div class="file-info">
              <el-icon :class="`file-type-${row.type}`" class="file-icon">
                <component :is="getFileIcon(row.type)" />
              </el-icon>
              <span class="file-name">{{ row.fileName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="size" label="大小" width="120" sortable>
          <template #default="{row}">{{ formatSize(row.size) }}</template>
        </el-table-column>

        <el-table-column prop="owner" label="上传人" width="120" />

        <el-table-column prop="permission" label="权限" width="180">
          <template #default="{row}">
            <el-tag
              :type="permissionTagType(row.permission)"
              effect="plain"
            >
              {{ permissionMap[row.permission] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200">
          <template #default="{row}">
            <el-button link type="primary" @click="showPermissionDialog(row)">
              权限设置
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="pagination"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>

    <!-- 权限审批面板 -->
    <el-card class="approval-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>待审批请求 ({{ pendingRequests.length }})</span>
          <el-button type="text" @click="refreshRequests">刷新列表</el-button>
        </div>
      </template>

      <el-table :data="pendingRequests" height="300">
        <el-table-column prop="applicant" label="申请人" width="120" />
        <el-table-column prop="fileName" label="文件名称" />
        <!-- <el-table-column prop="requestType" label="请求类型" width="120">
          <template #default="{row}">
            {{ requestTypeMap[row.requestType] }}
          </template> -->
        <!-- </el-table-column> -->
        <el-table-column prop="requestTime" label="申请时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="{row}">
            <el-button size="small" type="success" @click="approveRequest(row)">
              批准
            </el-button>
            <el-button size="small" type="danger" @click="rejectRequest(row)">
              驳回
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限设置对话框 -->
    <el-dialog v-model="permissionDialog.visible" title="权限设置">
      <el-form label-width="80px">
        <el-form-item label="权限级别">
          <el-select v-model="permissionDialog.selected">
            <el-option
              v-for="item in permissionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="生效范围">
          <el-checkbox-group v-model="permissionDialog.scopes">
            <el-checkbox label="部门成员" />
            <el-checkbox label="指定成员" />
            <el-checkbox label="关联部门" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="permissionDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="confirmPermission">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref} from 'vue'
import { Document, Folder, Picture, VideoCamera } from '@element-plus/icons-vue'

// 权限类型映射
const permissionMap = {
  read: '只读',
  edit: '可编辑',
  manage: '可管理'
}

// 文件类型图标映射
const getFileIcon = (type) => {
  const iconMap = {
    doc: Document,
    folder: Folder,
    image: Picture,
    video: VideoCamera
  }
  return iconMap[type] || Document
}

// 权限标签样式
const permissionTagType = (permission) => {
  const typeMap = {
    read: 'info',
    edit: 'warning',
    manage: 'success'
  }
  return typeMap[permission] || 'info'
}

// 分页配置
const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

// 文件数据（示例）
// const departmentFiles = ref([
//   {
//     id: 1,
//     fileName: 'Q3财务报告.pdf',
//     type: 'doc',
//     size: 2457600,
//     owner: '张三',
//     permission: 'read',
//     uploadTime: '2023-08-15'
//   },
//   // 更多示例数据...
// ])

// 待审批请求数据
const pendingRequests = ref([
  {
    id: 1001,
    applicant: '李四',
    fileName: '产品设计规范.docx',
    requestType: 'permission',
    requestTime: '2023-08-20 14:30'
  },
  // 更多示例数据...
])

// 对话框状态
const permissionDialog = ref({
  visible: false,
  currentFile: null,
  selected: 'read',
  scopes: []
})

// 权限设置操作
const showPermissionDialog = (file) => {
  permissionDialog.value = {
    visible: true,
    currentFile: file,
    selected: file.permission,
    scopes: []
  }
}

// const confirmPermission = async () => {
//   // 调用API更新权限
//   try {
//     await api.updatePermission({
//       fileId: permissionDialog.value.currentFile.id,
//       permission: permissionDialog.value.selected,
//       scopes: permissionDialog.value.scopes
//     })
//     ElMessage.success('权限更新成功')
//     permissionDialog.value.visible = false
//   } catch (error) {
//     ElMessage.error('权限更新失败')
//   }
// }

// 文件大小格式化
const formatSize = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}
</script>

<style scoped>
.department-management {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.box-card {
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.file-info {
  display: flex;
  align-items: center;
}

.file-icon {
  margin-right: 8px;
  font-size: 20px;
}

.file-type-doc { color: #409eff; }
.file-type-folder { color: #e6a23c; }
.file-type-image { color: #f56c6c; }
.file-type-video { color: #67c23a; }

.approval-card {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.el-table {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f8fafc;
}

:deep(.el-table__header th) {
  font-weight: 600;
  color: #606266;
}
</style>
