import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PlusOutlined,
  FileTextOutlined,
  DollarOutlined,
  PaperClipOutlined,
  UserOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BankOutlined,
  FilterOutlined,
  CloseOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  SendOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Tabs, Card, Button, Tag, Select, Input, Badge, Modal, Form, InputNumber, message } from 'antd';
import { FinanceCenterCard } from '../components/Finance/FinanceCenterCard';
import { AddBudgetModal } from '../components/Finance/AddBudgetModal';
import { getFinancialCenters, updateCenterBudget, replaceCenterBudget } from '../data/financialCentersStorage';
import type { CenterFinancialData, CenterBudget } from '../data/mockFinancialCenters';

interface CenterRequest {
  id: string;
  centerId: string;
  centerName: string;
  item: string;
  amount: number;
  attachment?: string;
  applicant: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

const FinancePage: React.FC = () => {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState<string>('budgets');
  const [financialCenters, setFinancialCenters] = useState<CenterFinancialData[]>([]);
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<CenterFinancialData | null>(null);
  
  // Center Requests State
  const [requests, setRequests] = useState<CenterRequest[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CenterRequest | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [rejectForm] = Form.useForm();
  const [centerFilter, setCenterFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchValue, setSearchValue] = useState('');
  const [centerStatusFilters, setCenterStatusFilters] = useState<Record<string, string>>({});

  // Load financial centers from localStorage on mount
  useEffect(() => {
    const loadedCenters = getFinancialCenters();
    setFinancialCenters(loadedCenters);
    
    // Load or generate center requests
    const stored = localStorage.getItem('finance_center_requests');
    if (stored) {
      const parsedRequests = JSON.parse(stored);
      if (parsedRequests.length > 0) {
        setRequests(parsedRequests);
        return;
      }
    }
    
    // Generate mock requests
    const mockRequests: CenterRequest[] = [];
    const items = ['معدات مكتبية', 'صيانة', 'مواد استهلاكية', 'أجهزة إلكترونية', 'أثاث', 'نقل', 'أخرى'];
    const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'approved', 'rejected'];
    const reasons = [
      'احتياج عاجل للمركز',
      'استبدال معدات قديمة',
      'توسعة في الخدمات',
      'صيانة دورية',
      'تحسين الخدمة',
    ];
    
    const rejectionReasons = [
      'المبلغ المطلوب يتجاوز الميزانية المتاحة',
      'البند غير مطلوب في الوقت الحالي',
      'المستندات المرفقة غير كافية',
      'الطلب يحتاج إلى مراجعة إضافية',
      'لا يتوافق مع السياسات المالية',
    ];
    
    loadedCenters.forEach((center) => {
      const numRequests = 3 + Math.floor(Math.random() * 4);
      for (let i = 0; i < numRequests; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const item = items[Math.floor(Math.random() * items.length)];
        const amount = Math.floor(Math.random() * 50000) + 1000;
        const hasAttachment = Math.random() > 0.5;
        
        mockRequests.push({
          id: `REQ-${center.centerId}-${i}-${Date.now()}`,
          centerId: center.centerId,
          centerName: center.centerName,
          item,
          amount,
          attachment: hasAttachment ? `طلب_${center.centerId}_${i}.pdf` : undefined,
          applicant: `موظف ${i + 1}`,
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          status,
          rejectionReason: status === 'rejected' 
            ? rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)]
            : undefined,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    });
    
    localStorage.setItem('finance_center_requests', JSON.stringify(mockRequests));
    setRequests(mockRequests);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isAddBudgetModalOpen) {
        setIsAddBudgetModalOpen(false);
      }
    };

    if (isAddBudgetModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isAddBudgetModalOpen]);

  const handleAddBudget = (centerId: string, budget: CenterBudget) => {
    if (editingCenter && editingCenter.centerId === centerId) {
      // وضع التعديل - استبدال البيانات الحالية
      replaceCenterBudget(centerId, budget);
    } else {
      // وضع الإضافة - إضافة إلى البيانات الموجودة
      updateCenterBudget(centerId, budget);
    }
    
    // Reload centers from localStorage to reflect changes
    const updatedCenters = getFinancialCenters();
    setFinancialCenters(updatedCenters);
    
    // إغلاق المودال وإعادة تعيين حالة التعديل
    setIsAddBudgetModalOpen(false);
    setEditingCenter(null);
  };

  const handleEditCenter = (center: CenterFinancialData) => {
    setEditingCenter(center);
    setIsAddBudgetModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddBudgetModalOpen(false);
    setEditingCenter(null);
  };

  // Center Requests Functions
  const saveRequests = (requestsData: CenterRequest[]) => {
    localStorage.setItem('finance_center_requests', JSON.stringify(requestsData));
    setRequests(requestsData);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesCenter = centerFilter === 'all' || req.centerId === centerFilter;
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      const matchesSearch = searchValue === '' || 
        req.item.toLowerCase().includes(searchValue.toLowerCase()) ||
        req.applicant.toLowerCase().includes(searchValue.toLowerCase()) ||
        req.centerName.toLowerCase().includes(searchValue.toLowerCase());
      
      return matchesCenter && matchesStatus && matchesSearch;
    });
  }, [requests, centerFilter, statusFilter, searchValue]);

  const groupedByCenter = useMemo(() => {
    const groups: Record<string, CenterRequest[]> = {};
    filteredRequests.forEach(req => {
      if (!groups[req.centerId]) {
        groups[req.centerId] = [];
      }
      groups[req.centerId].push(req);
    });
    return groups;
  }, [filteredRequests]);

  const getFilteredRequestsForCenter = (centerId: string, requests: CenterRequest[]) => {
    const centerFilter = centerStatusFilters[centerId] || 'all';
    if (centerFilter === 'all') return requests;
    return requests.filter(req => req.status === centerFilter);
  };

  const handleCenterStatusFilterChange = (centerId: string, status: string) => {
    setCenterStatusFilters(prev => ({
      ...prev,
      [centerId]: status,
    }));
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#faad14',
      approved: '#52c41a',
      rejected: '#ff4d4f',
    };
    return colors[status] || '#d9d9d9';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'معلق',
      approved: 'مقبول',
      rejected: 'مرفوض',
    };
    return labels[status] || status;
  };

  const handleApprove = (requestId: string) => {
    const updatedRequests = requests.map(r => 
      r.id === requestId ? { ...r, status: 'approved' as const } : r
    );
    saveRequests(updatedRequests);
    message.success('تم قبول الطلب بنجاح');
  };

  const handleRejectClick = (requestId: string) => {
    setRejectingRequestId(requestId);
    setIsRejectModalOpen(true);
    rejectForm.resetFields();
  };

  const handleReject = (values: { rejectionReason: string }) => {
    if (rejectingRequestId) {
      const updatedRequests = requests.map(r => 
        r.id === rejectingRequestId 
          ? { ...r, status: 'rejected' as const, rejectionReason: values.rejectionReason } 
          : r
      );
      saveRequests(updatedRequests);
      setIsRejectModalOpen(false);
      setRejectingRequestId(null);
      rejectForm.resetFields();
      message.error('تم رفض الطلب');
    }
  };

  const handleResubmit = (requestId: string) => {
    const updatedRequests = requests.map(r => 
      r.id === requestId 
        ? { ...r, status: 'pending' as const, rejectionReason: undefined } 
        : r
    );
    saveRequests(updatedRequests);
    message.success('تم إعادة إرسال الطلب');
  };

  const handleEditRequest = (request: CenterRequest) => {
    setSelectedRequest(request);
    form.setFieldsValue({
      item: request.item,
      amount: request.amount,
      applicant: request.applicant,
      reason: request.reason,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (values: any) => {
    if (selectedRequest) {
      const updatedRequests = requests.map(r => 
        r.id === selectedRequest.id 
          ? { 
              ...r, 
              ...values,
              status: 'pending' as const, // إعادة تعيين الحالة إلى معلق بعد التعديل
              rejectionReason: undefined, // حذف سبب الرفض عند التعديل
            }
          : r
      );
      saveRequests(updatedRequests);
      setIsEditModalOpen(false);
      setSelectedRequest(null);
      form.resetFields();
      message.success('تم تعديل الطلب وإعادة إرساله بنجاح');
    }
  };

  const handleViewAttachment = (attachment: string) => {
    message.info(`فتح الملف: ${attachment}`);
  };

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      totalAmount: requests.reduce((sum, r) => sum + r.amount, 0),
    };
  }, [requests]);

  return (
    <>
      <section className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-x-hidden">
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('finance.title')}</h1>
              <p className="text-sm text-gray-600 mt-1">{t('finance.subtitle')}</p>
            </div>
            {activeTab === 'budgets' && (
              <button
                onClick={() => {
                  setEditingCenter(null);
                  setIsAddBudgetModalOpen(true);
                }}
                className="px-6 py-3 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center justify-center gap-2"
              >
                <PlusOutlined />
                <span>{t('finance.addBudgetButton')}</span>
              </button>
            )}
          </div>

          {/* Tabs */}
          <Card className="bg-white rounded-xl shadow-md border border-gray-100 p-0 overflow-hidden">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="finance-tabs"
              style={{
                padding: '0 16px',
              }}
              items={[
                {
                  key: 'budgets',
                  label: (
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200">
                      <DollarOutlined className="text-base" />
                      <span className="font-semibold text-sm">الميزانيات</span>
                    </span>
                  ),
                children: (
                  <div className="space-y-4">
                    {/* Centers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {financialCenters.map(center => (
                        <FinanceCenterCard 
                          key={center.centerId} 
                          financialData={center}
                          onEdit={handleEditCenter}
                        />
                      ))}
                    </div>

                    {/* Empty State */}
                    {financialCenters.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <PlusOutlined className="text-3xl text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">{t('finance.noCenters')}</p>
                      </div>
                    )}
                  </div>
                ),
              },
                {
                  key: 'requests',
                  label: (
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200">
                      <FileTextOutlined className="text-base" />
                      <span className="font-semibold text-sm">{t('finance.requests.title') || 'استقبال طلبات المراكز'}</span>
                    </span>
                  ),
                children: (
                  <div className="space-y-3">
                    {/* Filter Button */}
                    <div className="flex justify-end">
                      <Button
                        type={isFilterOpen ? 'primary' : 'default'}
                        size="large"
                        icon={<FilterOutlined />}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="rounded-xl"
                      >
                        {t('hr.filters.status')}
                      </Button>
                    </div>

                    {/* Filter Card - Collapsible */}
                    {isFilterOpen && (
                      <Card className="bg-white rounded-xl shadow-md border border-gray-100 p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FilterOutlined className="text-mainColor" />
                            <span className="font-semibold text-sm text-gray-900">{t('hr.filters.status')}</span>
                          </div>
                          <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={() => setIsFilterOpen(false)}
                            className="p-0"
                            size="small"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Select
                            size="large"
                            value={centerFilter}
                            onChange={setCenterFilter}
                            className="min-w-[150px] rounded-xl"
                            placeholder="المركز"
                          >
                            <Select.Option value="all">جميع المراكز</Select.Option>
                            {financialCenters.map(center => (
                              <Select.Option key={center.centerId} value={center.centerId}>
                                {center.centerName}
                              </Select.Option>
                            ))}
                          </Select>
                          <Select
                            size="large"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            className="min-w-[150px] rounded-xl"
                            placeholder="الحالة"
                          >
                            <Select.Option value="all">جميع الحالات</Select.Option>
                            <Select.Option value="pending">معلق</Select.Option>
                            <Select.Option value="approved">مقبول</Select.Option>
                            <Select.Option value="rejected">مرفوض</Select.Option>
                          </Select>
                          <Input
                            size="large"
                            placeholder={t('hr.searchPlaceholder')}
                            prefix={<FileTextOutlined className="text-gray-400" />}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            allowClear
                            className="flex-1 min-w-[180px] rounded-xl"
                          />
                        </div>
                      </Card>
                    )}

                    {/* Summary Statistics Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-mainColor-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-full bg-mainColor/10 flex items-center justify-center">
                            <FileTextOutlined className="text-mainColor text-xs" />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                            إجمالي الطلبات
                          </h4>
                          <p className="text-lg font-bold text-mainColor">{stats.total}</p>
                        </div>
                      </Card>
                      <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <ClockCircleOutlined className="text-orange-600 text-xs" />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                            معلق
                          </h4>
                          <p className="text-lg font-bold text-orange-600">{stats.pending}</p>
                        </div>
                      </Card>
                      <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircleOutlined className="text-green-600 text-xs" />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                            مقبول
                          </h4>
                          <p className="text-lg font-bold text-green-600">{stats.approved}</p>
                        </div>
                      </Card>
                      <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <CloseCircleOutlined className="text-red-600 text-xs" />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                            مرفوض
                          </h4>
                          <p className="text-lg font-bold text-red-600">{stats.rejected}</p>
                        </div>
                      </Card>
                      <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-mainColor/30 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-full bg-mainColor/10 flex items-center justify-center">
                            <DollarOutlined className="text-mainColor text-xs" />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                            إجمالي المبلغ
                          </h4>
                          <p className="text-base font-bold text-mainColor">
                            {stats.totalAmount.toLocaleString()} ر.س
                          </p>
                        </div>
                      </Card>
                    </div>

                    {/* Centers with Requests - Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(groupedByCenter).map(([centerId, centerRequests]) => {
                        const center = financialCenters.find(c => c.centerId === centerId);
                        
                        return (
                          <Card
                            key={centerId}
                            className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                            bodyStyle={{ padding: '10px' }}
                          >
                            {/* Center Header - Compact with Filter */}
                            <div className="bg-gradient-to-r from-mainColor/10 to-primary/10 border-b border-gray-200 p-2 mb-2">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                  <div className="w-6 h-6 bg-mainColor/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <BankOutlined className="text-mainColor text-xs" />
                                  </div>
                                  <h3 className="text-sm font-bold text-gray-900 truncate">{center?.centerName || centerId}</h3>
                                </div>
                              </div>
                              {/* Center Status Filter */}
                              <div className="flex items-center gap-1">
                                <Button
                                  type={centerStatusFilters[centerId] === 'all' || !centerStatusFilters[centerId] ? 'primary' : 'default'}
                                  size="small"
                                  onClick={() => handleCenterStatusFilterChange(centerId, 'all')}
                                  className="text-[10px] h-6 px-2 rounded-lg"
                                >
                                  الكل
                                </Button>
                                <Button
                                  type={centerStatusFilters[centerId] === 'pending' ? 'primary' : 'default'}
                                  size="small"
                                  onClick={() => handleCenterStatusFilterChange(centerId, 'pending')}
                                  className="text-[10px] h-6 px-2 rounded-lg"
                                >
                                  معلق
                                </Button>
                                <Button
                                  type={centerStatusFilters[centerId] === 'approved' ? 'primary' : 'default'}
                                  size="small"
                                  onClick={() => handleCenterStatusFilterChange(centerId, 'approved')}
                                  className="text-[10px] h-6 px-2 rounded-lg"
                                >
                                  مقبول
                                </Button>
                                <Button
                                  type={centerStatusFilters[centerId] === 'rejected' ? 'primary' : 'default'}
                                  size="small"
                                  onClick={() => handleCenterStatusFilterChange(centerId, 'rejected')}
                                  className="text-[10px] h-6 px-2 rounded-lg"
                                >
                                  مرفوض
                                </Button>
                              </div>
                            </div>

                            {/* Requests Grid - Compact */}
                            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                              {getFilteredRequestsForCenter(centerId, centerRequests).map((request) => (
                                <Card
                                  key={request.id}
                                  className="bg-gray-50 rounded-lg border border-gray-200 hover:border-mainColor/30 hover:shadow-sm transition-all duration-200"
                                  bodyStyle={{ padding: '10px' }}
                                >
                                  {/* Request Header */}
                                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <FileTextOutlined className="text-mainColor text-sm flex-shrink-0" />
                                      <span className="text-sm font-semibold text-gray-700 truncate" title={request.item}>
                                        {request.item}
                                      </span>
                                    </div>
                                    <Badge
                                      color={getStatusBadgeColor(request.status)}
                                      text={getStatusLabel(request.status)}
                                      className="text-xs"
                                    />
                                  </div>

                                  {/* Request Details - Balanced */}
                                  <div className="space-y-1.5 mb-2">
                                    <div className="flex items-center gap-1.5 text-xs">
                                      <DollarOutlined className="text-green-600 text-xs flex-shrink-0" />
                                      <span className="text-gray-700 font-medium">
                                        {request.amount.toLocaleString()} ر.س
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs">
                                      <UserOutlined className="text-mainColor text-xs flex-shrink-0" />
                                      <span className="text-gray-600 truncate" title={request.applicant}>
                                        {request.applicant}
                                      </span>
                                    </div>
                                    {request.attachment && (
                                      <div className="flex items-center gap-1.5 text-xs">
                                        <PaperClipOutlined className="text-mainColor text-xs flex-shrink-0" />
                                        <button
                                          onClick={() => handleViewAttachment(request.attachment!)}
                                          className="text-mainColor hover:text-primary hover:underline flex items-center gap-1"
                                          title={request.attachment}
                                        >
                                          <span className="text-xs">ملف مرفق</span>
                                          <EyeOutlined className="text-xs flex-shrink-0" />
                                        </button>
                                      </div>
                                    )}
                                    {request.status === 'rejected' && request.rejectionReason && (
                                      <div className="flex items-start gap-1.5 text-xs bg-red-50 p-2 rounded border border-red-200">
                                        <ExclamationCircleOutlined className="text-red-600 text-xs flex-shrink-0 mt-0.5" />
                                        <span className="text-red-700 line-clamp-2" title={request.rejectionReason}>
                                          {request.rejectionReason}
                                        </span>
                                      </div>
                                    )}
                                    <div className="text-xs text-gray-500 line-clamp-2" title={request.reason}>
                                      {request.reason}
                                    </div>
                                  </div>

                                  {/* Actions - Original Style */}
                                  <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-gray-200">
                                    {request.status === 'pending' && (
                                      <>
                                        <Button
                                          type="text"
                                          size="small"
                                          icon={<CheckCircleOutlined />}
                                          onClick={() => handleApprove(request.id)}
                                          className="text-green-600 hover:text-green-700 hover:bg-green-50 px-2 h-7 flex items-center justify-center gap-1 text-xs transition-all duration-200"
                                        >
                                          قبول
                                        </Button>
                                        <Button
                                          type="text"
                                          size="small"
                                          icon={<CloseCircleOutlined />}
                                          onClick={() => handleRejectClick(request.id)}
                                          className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 h-7 flex items-center justify-center gap-1 text-xs transition-all duration-200"
                                        >
                                          رفض
                                        </Button>
                                        <Button
                                          type="text"
                                          size="small"
                                          icon={<EditOutlined />}
                                          onClick={() => handleEditRequest(request)}
                                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 h-7 flex items-center justify-center gap-1 text-xs transition-all duration-200 font-medium"
                                        >
                                          تعديل
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ),
              },
              ]}
            />
          </Card>
        </div>
      </section>

      {/* Add/Edit Budget Modal */}
      <AddBudgetModal
        isOpen={isAddBudgetModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddBudget}
        initialData={editingCenter || undefined}
        isEditMode={!!editingCenter}
      />

      {/* Edit Request Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EditOutlined className="text-mainColor" />
            <span className="font-bold text-lg">تعديل الطلب</span>
          </div>
        }
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedRequest(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
        className="rounded-2xl"
        okButtonProps={{ className: 'rounded-xl' }}
        cancelButtonProps={{ className: 'rounded-xl' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveEdit}
          className="mt-4"
        >
          <Form.Item
            name="item"
            label={<span className="font-semibold">البند</span>}
            rules={[{ required: true, message: 'يرجى إدخال البند' }]}
          >
            <Input size="large" className="rounded-xl" />
          </Form.Item>
          <Form.Item
            name="amount"
            label={<span className="font-semibold">المبلغ المطلوب</span>}
            rules={[{ required: true, message: 'يرجى إدخال المبلغ' }]}
          >
            <InputNumber
              size="large"
              className="w-full rounded-xl"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="applicant"
            label={<span className="font-semibold">مقدم الطلب</span>}
            rules={[{ required: true, message: 'يرجى إدخال مقدم الطلب' }]}
          >
            <Input size="large" className="rounded-xl" />
          </Form.Item>
          <Form.Item
            name="reason"
            label={<span className="font-semibold">السبب</span>}
            rules={[{ required: true, message: 'يرجى إدخال السبب' }]}
          >
            <Input.TextArea rows={3} className="rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Reject Request Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CloseCircleOutlined className="text-red-600" />
            <span className="font-bold text-lg">رفض الطلب</span>
          </div>
        }
        open={isRejectModalOpen}
        onCancel={() => {
          setIsRejectModalOpen(false);
          setRejectingRequestId(null);
          rejectForm.resetFields();
        }}
        onOk={() => rejectForm.submit()}
        width={500}
        className="rounded-2xl"
        okButtonProps={{ className: 'rounded-xl bg-red-600 hover:bg-red-700' }}
        cancelButtonProps={{ className: 'rounded-xl' }}
        okText="رفض الطلب"
      >
        <Form
          form={rejectForm}
          layout="vertical"
          onFinish={handleReject}
          className="mt-4"
        >
          <Form.Item
            name="rejectionReason"
            label={<span className="font-semibold">سبب الرفض</span>}
            rules={[{ required: true, message: 'يرجى إدخال سبب الرفض' }]}
          >
            <Input.TextArea 
              rows={4} 
              className="rounded-xl" 
              placeholder="أدخل سبب رفض الطلب..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FinancePage;

