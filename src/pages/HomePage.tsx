import React, { useState } from 'react';
import { Row, Col, Typography, Space, Divider, Card, Avatar, Modal, Form, Input, DatePicker, Select, Button, message, Switch, Tabs, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  OrderedListOutlined,
  FormOutlined,
  BellOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ProjectOutlined,
  BarChartOutlined,
  MailOutlined,
  SettingOutlined,
  GlobalOutlined,
  NotificationOutlined,
  SecurityScanOutlined,
  EyeOutlined,
  SoundOutlined,
  MobileOutlined,
  DesktopOutlined,
  CloudOutlined,
  LockOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { 
  Users, 
  Home, 
  MapPin, 
  UserCheck,
  Building2,
  UsersRound,
  FileText,
  DollarSign,
  Truck,
  CreditCard,
  BarChart3,
  Settings
} from 'lucide-react';
import OverviewCard from '../components/HomePageComponent/OverviewCard';
import StatsWidget from '../components/HomePageComponent/StatsWidget';
import DashboardGrid from '../components/HomePageComponent/DashboardGrid';
import ContentCarousel from '../components/HomePageComponent/ContentCarousel';
import ActivityFeed from '../components/HomePageComponent/ActivityFeed';
import QuickActions from '../components/HomePageComponent/QuickActions';
import PendingApprovalsCard from '../components/HomePageComponent/PendingApprovalsCard';
import type { SectionSummaryProps } from '../components/HomePageComponent/SectionSummary';
import type { CarouselItem } from '../components/HomePageComponent/ContentCarousel';
import type { ActivityItem } from '../components/HomePageComponent/ActivityFeed';
import type { Approval } from '../components/HomePageComponent/PendingApprovalsCard';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [mounted] = useState(true);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [documentsModalVisible, setDocumentsModalVisible] = useState(false);
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [leaveForm] = Form.useForm();
  const [expenseForm] = Form.useForm();
  const [settingsForm] = Form.useForm();
  const { i18n } = useTranslation('common');
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  
  // Mock user data - in real app, this would come from auth context
  const currentUser = {
    name: t('homepage.dummyUser'),
    role: t('homepage.dummyRole'),
    department: t('homepage.dummyDepartment'),
    avatar: undefined,
  };

  // State for approvals
  const [approvals, setApprovals] = useState<Approval[]>([
    {
      id: '1',
      type: 'leave',
      title: t('homepage.annualLeaveRequest'),
      requester: t('homepage.dummyRequester1'),
      date: `2 ${t('homepage.hoursAgo')}`,
      days: 5,
      priority: 'high',
    },
    {
      id: '2',
      type: 'expense',
      title: t('homepage.businessTripExpenses'),
      requester: t('homepage.dummyRequester2'),
      date: `5 ${t('homepage.hoursAgo')}`,
      amount: 'SAR 3,450',
      priority: 'medium',
    },
    {
      id: '3',
      type: 'leave',
      title: t('homepage.sickLeaveRequest'),
      requester: t('homepage.dummyRequester3'),
      date: `1 ${t('homepage.dayAgo')}`,
      days: 2,
      priority: 'high',
    },
    {
      id: '4',
      type: 'request',
      title: t('homepage.equipmentRequest'),
      requester: t('homepage.dummyRequester4'),
      date: `2 ${t('homepage.daysAgo')}`,
      priority: 'low',
    },
    {
      id: '5',
      type: 'expense',
      title: t('homepage.officeSupplies'),
      requester: t('homepage.dummyRequester5'),
      date: `2 ${t('homepage.daysAgo')}`,
      amount: 'SAR 850',
      priority: 'low',
    },
  ]);

  // Handle approval
  const handleApprove = (id: string) => {
    setApprovals((prevApprovals) =>
      prevApprovals.filter((approval) => approval.id !== id)
    );
    // In real app, you would call an API here
    console.log('Approved:', id);
  };

  // Handle rejection
  const handleReject = (id: string) => {
    setApprovals((prevApprovals) =>
      prevApprovals.filter((approval) => approval.id !== id)
    );
    // In real app, you would call an API here
    console.log('Rejected:', id);
  };

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('homepage.goodMorning');
    if (hour < 18) return t('homepage.goodAfternoon');
    return t('homepage.goodEvening');
  };

  // Overview cards data - Employee/Admin focused
  const overviewCards = [
    {
      title: t('homepage.myTasks'),
      value: '12',
      icon: <CheckCircleOutlined />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: { value: 8.2, isPositive: true },
    },
    {
      title: t('homepage.pendingApprovals'),
      value: '8',
      icon: <FileTextOutlined />,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      trend: { value: 3.5, isPositive: false },
    },
    {
      title: t('homepage.totalEmployees'),
      value: '2,458',
      icon: <UserOutlined />,
      bgColor: 'bg-green-50',
      iconColor: 'text-success',
      trend: { value: 12.5, isPositive: true },
    },
    {
      title: t('homepage.activeProjects'),
      value: '24',
      icon: <ProjectOutlined />,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: { value: 5.3, isPositive: true },
    },
    {
      title: t('homepage.leaveRequests'),
      value: '15',
      icon: <CalendarOutlined />,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      trend: { value: 2.1, isPositive: true },
    },
    {
      title: t('homepage.totalDepartments'),
      value: '18',
      icon: <TeamOutlined />,
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      trend: { value: 0, isPositive: true },
    },
  ];

  // Quick stats for header
  const quickStats = [
    {
      title: t('homepage.todayAttendance'),
      value: '98.5%',
      icon: <ClockCircleOutlined />,
      color: 'text-blue-600',
    },
    {
      title: t('homepage.monthlyExpenses'),
      value: 'SAR 245K',
      icon: <DollarOutlined />,
      color: 'text-green-600',
    },
    {
      title: t('homepage.performance'),
      value: '94%',
      icon: <BarChartOutlined />,
      color: 'text-purple-600',
    },
    {
      title: t('homepage.unreadMessages'),
      value: '23',
      icon: <MailOutlined />,
      color: 'text-orange-600',
    },
  ];

  // My Tasks
  const myTasks: Task[] = [
    {
      id: '1',
      title: t('homepage.reviewFinancialReport'),
      description: t('homepage.completeReviewFeedback'),
      priority: 'high',
      status: 'in-progress',
      dueDate: t('homepage.today'),
      progress: 65,
    },
    {
      id: '2',
      title: t('homepage.approveLeaveRequests'),
      description: `5 ${t('homepage.pendingLeaveRequests')}`,
      priority: 'high',
      status: 'pending',
      dueDate: t('homepage.tomorrow'),
    },
    {
      id: '3',
      title: t('homepage.updateEmployeeHandbook'),
      description: t('homepage.addNewPolicies'),
      priority: 'medium',
      status: 'in-progress',
      dueDate: 'Dec 25',
      progress: 40,
    },
    {
      id: '4',
      title: t('homepage.teamMeetingPreparation'),
      description: t('homepage.prepareAgenda'),
      priority: 'medium',
      status: 'pending',
      dueDate: 'Dec 24',
    },
    {
      id: '5',
      title: t('homepage.completeTrainingModule'),
      description: t('homepage.finishComplianceTraining'),
      priority: 'low',
      status: 'completed',
      dueDate: 'Dec 20',
    },
    {
      id: '6',
      title: t('homepage.submitExpenseReport'),
      description: t('homepage.monthlyExpenseSubmission'),
      priority: 'medium',
      status: 'pending',
      dueDate: 'Dec 28',
    },
  ];


  // Company Announcements
  const announcements: Announcement[] = [
    {
      id: '1',
      title: `${t('homepage.holidaySchedule')} - ${t('homepage.newYear')}`,
      message: t('homepage.officeClosed'),
      type: 'info',
      author: t('homepage.hrDepartment'),
      date: `2 ${t('homepage.hoursAgo')}`,
      isNew: true,
    },
    {
      id: '2',
      title: t('homepage.newHealthInsurance'),
      message: t('homepage.updatedCoverage'),
      type: 'success',
      author: t('homepage.benefitsTeam'),
      date: `1 ${t('homepage.dayAgo')}`,
      isNew: true,
    },
    {
      id: '3',
      title: t('homepage.systemMaintenance'),
      message: t('homepage.scheduledMaintenance'),
      type: 'warning',
      author: t('homepage.itDepartment'),
      date: `2 ${t('homepage.daysAgo')}`,
    },
    {
      id: '4',
      title: t('homepage.annualPerformanceReviews'),
      message: t('homepage.reviewPeriodStarts'),
      type: 'info',
      author: t('homepage.hrDepartment'),
      date: `3 ${t('homepage.daysAgo')}`,
    },
    {
      id: '5',
      title: t('homepage.securityPolicyUpdate'),
      message: t('homepage.securityTrainingRequired'),
      type: 'urgent',
      author: t('homepage.securityTeam'),
      date: `4 ${t('homepage.daysAgo')}`,
    },
  ];

  // Recent activities
  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'approval',
      title: t('homepage.leaveRequestApproved'),
      description: t('homepage.leaveRequestApprovedDesc'),
      time: '30 minutes ago',
      user: t('homepage.dummyRole'),
    },
    {
      id: '2',
      type: 'document',
      title: t('homepage.newDocumentShared'),
      description: t('homepage.documentSharedDesc'),
      time: `2 ${t('homepage.hoursAgo')}`,
      user: t('homepage.financeDepartment'),
    },
    {
      id: '3',
      type: 'notification',
      title: t('homepage.meetingReminder'),
      description: t('homepage.meetingReminderDesc'),
      time: `3 ${t('homepage.hoursAgo')}`,
      user: 'Calendar',
    },
    {
      id: '4',
      type: 'approval',
      title: t('homepage.expenseReportSubmitted'),
      description: t('homepage.expenseReportPending'),
      time: `5 ${t('homepage.hoursAgo')}`,
      user: t('homepage.dummyUser'),
    },
    {
      id: '5',
      type: 'user',
      title: t('homepage.newTeamMember'),
      description: t('homepage.teamMemberJoined'),
      time: `1 ${t('homepage.dayAgo')}`,
      user: t('homepage.hrDepartment'),
    },
    {
      id: '6',
      type: 'document',
      title: t('homepage.policyUpdated'),
      description: t('homepage.handbookUpdated'),
      time: `2 ${t('homepage.daysAgo')}`,
      user: t('homepage.hrDepartment'),
    },
  ];

  // Handle Leave Request
  const handleRequestLeave = () => {
    setLeaveModalVisible(true);
  };

  const handleLeaveSubmit = async (values: any) => {
    try {
      // In a real app, this would make an API call
      console.log('Leave request submitted:', values);
      message.success(t('homepage.leaveRequestSubmitted'));
      setLeaveModalVisible(false);
      leaveForm.resetFields();
    } catch (error) {
      message.error(t('homepage.submissionError'));
    }
  };

  // Handle Expense Submission
  const handleSubmitExpense = () => {
    setExpenseModalVisible(true);
  };

  const handleExpenseSubmit = async (values: any) => {
    try {
      // In a real app, this would make an API call
      console.log('Expense submitted:', values);
      message.success(t('homepage.expenseSubmitted'));
      setExpenseModalVisible(false);
      expenseForm.resetFields();
    } catch (error) {
      message.error(t('homepage.submissionError'));
    }
  };

  // Handle View Documents
  const handleViewDocuments = () => {
    setDocumentsModalVisible(true);
  };

  // Handle View Attendance
  const handleViewAttendance = () => {
    setAttendanceModalVisible(true);
  };

  // Handle My Profile
  const handleMyProfile = () => {
    setProfileModalVisible(true);
  };

  // Handle Settings
  const handleSettings = () => {
    setSettingsModalVisible(true);
    // Initialize form with current settings
    settingsForm.setFieldsValue({
      language: i18n.language,
      emailNotifications: emailNotifications,
      smsNotifications: smsNotifications,
      pushNotifications: pushNotifications,
      soundEnabled: soundEnabled,
      darkMode: darkMode,
      autoSave: autoSave,
    });
  };

  const handleSettingsSave = () => {
    const values = settingsForm.getFieldsValue();
    // Update state
    setEmailNotifications(values.emailNotifications);
    setSmsNotifications(values.smsNotifications);
    setPushNotifications(values.pushNotifications);
    setSoundEnabled(values.soundEnabled);
    setDarkMode(values.darkMode);
    setAutoSave(values.autoSave);
    
    // Change language if needed
    if (values.language !== i18n.language) {
      i18n.changeLanguage(values.language);
    }
    
    message.success(t('homepage.settingsSaved'));
    setSettingsModalVisible(false);
  };

  // Quick Actions for Employees
  const quickActions = [
    {
      id: '1',
      label: t('homepage.requestLeave'),
      icon: <CalendarOutlined />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      action: handleRequestLeave,
    },
    {
      id: '2',
      label: t('homepage.submitExpense'),
      icon: <DollarOutlined />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      action: handleSubmitExpense,
    },
    {
      id: '3',
      label: t('homepage.viewDocuments'),
      icon: <FileTextOutlined />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      action: handleViewDocuments,
    },
    {
      id: '4',
      label: t('homepage.attendance'),
      icon: <ClockCircleOutlined />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      action: handleViewAttendance,
    },
    {
      id: '5',
      label: t('homepage.myProfile'),
      icon: <UserOutlined />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      action: handleMyProfile,
    },
    {
      id: '6',
      label: t('homepage.settings'),
      icon: <SettingOutlined />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
      action: handleSettings,
    },
  ];

  // Featured items for carousel
  const featuredItems: CarouselItem[] = [
    {
      id: '1',
      title: t('homepage.newPolicyUpdate'),
      subtitle: t('homepage.dataPrivacyPolicy'),
      description: t('homepage.policyUpdateDesc'),
      icon: <SafetyOutlined />,
      tag: { text: t('homepage.active'), color: 'success' },
      action: () => console.log('View policy'),
    },
    {
      id: '2',
      title: t('homepage.trainingWorkshop'),
      subtitle: t('homepage.trainingWorkshopGallery'),
      description: t('homepage.trainingDesc'),
      icon: <ProjectOutlined />,
      tag: { text: t('homepage.recent'), color: 'info' },
      action: () => console.log('View training'),
    },
    {
      id: '3',
      title: t('homepage.systemUpdate'),
      subtitle: 'Version 2.5',
      description: t('homepage.systemUpdateDesc'),
      icon: <BellOutlined />,
      tag: { text: t('homepage.updated'), color: 'warning' },
      action: () => console.log('View update'),
    },
    {
      id: '4',
      title: t('homepage.annualReport'),
      subtitle: '2024',
      description: t('homepage.reportDesc'),
      icon: <FileTextOutlined />,
      tag: { text: t('homepage.active'), color: 'info' },
      action: () => console.log('View report'),
    },
  ];

  // Dashboard sections data
  const dashboardSections: Omit<SectionSummaryProps, 'maxItems'>[] = [
    {
      title: t('homepage.policies'),
      icon: <SafetyOutlined />,
      items: [
        {
          id: '1',
          title: t('homepage.employeeCodeOfConduct'),
          subtitle: t('homepage.updatedByAdmin'),
          date: `2 ${t('homepage.daysAgo')}`,
          tag: { text: t('homepage.active'), color: 'success' },
        },
        {
          id: '2',
          title: t('homepage.dataPrivacyPolicy'),
          subtitle: t('homepage.updatedByHR'),
          date: `5 ${t('homepage.daysAgo')}`,
          tag: { text: t('homepage.active'), color: 'success' },
        },
        {
          id: '3',
          title: t('homepage.remoteWorkPolicy'),
          subtitle: t('homepage.updatedByAdmin'),
          date: `1 ${t('homepage.weekAgo')}`,
          tag: { text: t('homepage.draft'), color: 'warning' },
        },
        {
          id: '4',
          title: t('homepage.healthSafetyGuidelines'),
          subtitle: t('homepage.updatedBySafety'),
          date: `2 ${t('homepage.weeksAgo')}`,
          tag: { text: t('homepage.active'), color: 'success' },
        },
        {
          id: '5',
          title: t('homepage.itUsagePolicy'),
          subtitle: t('homepage.updatedByIT'),
          date: `3 ${t('homepage.weeksAgo')}`,
          tag: { text: t('homepage.active'), color: 'success' },
        },
      ],
      emptyMessage: t('homepage.noPolicies'),
      onViewAll: () => console.log('View all policies'),
    },
    {
      title: t('homepage.procedures'),
      icon: <OrderedListOutlined />,
      items: [
        {
          id: '1',
          title: t('homepage.newEmployeeOnboarding'),
          subtitle: t('homepage.hrDepartment'),
          date: `1 ${t('homepage.dayAgo')}`,
          tag: { text: t('homepage.updated'), color: 'info' },
        },
        {
          id: '2',
          title: t('homepage.expenseReimbursement'),
          subtitle: t('homepage.financeDepartment'),
          date: `3 ${t('homepage.daysAgo')}`,
          tag: { text: t('homepage.updated'), color: 'info' },
        },
        {
          id: '3',
          title: t('homepage.leaveRequestProcedure'),
          subtitle: t('homepage.hrDepartment'),
          date: `1 ${t('homepage.weekAgo')}`,
          tag: { text: t('homepage.active'), color: 'success' },
        },
        {
          id: '4',
          title: t('homepage.equipmentRequestProcess'),
          subtitle: t('homepage.itDepartment'),
          date: `2 ${t('homepage.weeksAgo')}`,
          tag: { text: t('homepage.active'), color: 'success' },
        },
        {
          id: '5',
          title: t('homepage.incidentReporting'),
          subtitle: t('homepage.safetyDepartment'),
          date: `3 ${t('homepage.weeksAgo')}`,
          tag: { text: t('homepage.active'), color: 'success' },
        },
      ],
      emptyMessage: t('homepage.noProcedures'),
      onViewAll: () => console.log('View all procedures'),
    },
    {
      title: t('homepage.forms'),
      icon: <FormOutlined />,
      items: [
        {
          id: '1',
          title: t('homepage.leaveRequestForm'),
          subtitle: `45 ${t('homepage.pendingSubmissions')}`,
          date: t('homepage.updatedToday'),
          tag: { text: t('homepage.active'), color: 'success' },
        },
        {
          id: '2',
          title: t('homepage.expenseReportForm'),
          subtitle: `23 ${t('homepage.pendingSubmissions')}`,
          date: `${t('homepage.updated')} 2 ${t('homepage.daysAgo')}`,
          tag: { text: t('homepage.active'), color: 'success' },
        },
        {
          id: '3',
          title: t('homepage.equipmentRequestForm'),
          subtitle: `12 ${t('homepage.pendingSubmissions')}`,
          date: `${t('homepage.updated')} 3 ${t('homepage.daysAgo')}`,
          tag: { text: t('homepage.active'), color: 'success' },
        },
        {
          id: '4',
          title: t('homepage.trainingRequestForm'),
          subtitle: `8 ${t('homepage.pendingSubmissions')}`,
          date: `${t('homepage.updated')} 1 ${t('homepage.weekAgo')}`,
          tag: { text: t('homepage.active'), color: 'success' },
        },
        {
          id: '5',
          title: t('homepage.feedbackForm'),
          subtitle: `156 ${t('homepage.responses')}`,
          date: `${t('homepage.updated')} 2 ${t('homepage.weeksAgo')}`,
          tag: { text: t('homepage.active'), color: 'success' },
        },
      ],
      emptyMessage: t('homepage.noForms'),
      onViewAll: () => console.log('View all forms'),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-x-hidden">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Welcome Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Avatar
                size={50}
                icon={<UserOutlined />}
                className="bg-mainColor text-white"
                style={{ fontSize: '20px' }}
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  {getGreeting()} {currentUser.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-mainColor text-white rounded font-semibold">
                    {currentUser.role}
                  </span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-xs text-gray-600">{currentUser.department}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Modern Compact Design */}
        <div className="flex items-center justify-end">
          <Dropdown
            menu={{
              items: quickActions.map((action) => ({
                key: action.id,
                label: (
                  <div className={`flex items-center gap-2 ${action.color}`}>
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </div>
                ),
                onClick: action.action,
              })),
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="bg-mainColor hover:bg-primaryColor border-0 shadow-sm"
            >
              {t('homepage.quickActions')}
            </Button>
          </Dropdown>
        </div>

        {/* Department Overview Cards */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
            <Title level={3} className="!mb-0 !text-gray-800 !text-base sm:!text-lg md:!text-xl lg:!text-2xl font-semibold">
              {t('homepage.departmentOverview')}
            </Title>
          </div>
          <Row gutter={[16, 16]} className="sm:!mx-0">
            {/* Employees/HR Overview Card */}
            <Col xs={24} sm={12} lg={6}>
              <div 
                className="bg-white rounded-xl shadow-md p-6 border border-success/20 hover:shadow-lg hover:shadow-success/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
                onClick={() => navigate('/hr')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-success/20 to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-lg bg-success/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                  <UserCheck className="w-7 h-7 text-success" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{t('homepage.departmentCards.employees.title')}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.employees.totalEmployees')}</span>
                    <span className="text-xl font-bold text-success">2,458</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.employees.attendanceRate')}</span>
                    <span className="text-xl font-bold text-success">98.5%</span>
                  </div>
                </div>
                <div className="mt-3 w-12 h-0.5 bg-success rounded-full flex-shrink-0"></div>
              </div>
            </Col>

            {/* Finance Overview Card */}
            <Col xs={24} sm={12} lg={6}>
              <div 
                className="bg-white rounded-xl shadow-md p-6 border border-green-200 hover:shadow-lg hover:shadow-green-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
                onClick={() => navigate('/finance')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                  <DollarSign className="w-7 h-7 text-green-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{t('homepage.departmentCards.finance.title')}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.finance.totalBudget')}</span>
                    <span className="text-xl font-bold text-green-600">45.2M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.finance.expenses')}</span>
                    <span className="text-xl font-bold text-green-600">32.8M</span>
                  </div>
                </div>
                <div className="mt-3 w-12 h-0.5 bg-green-600 rounded-full flex-shrink-0"></div>
              </div>
            </Col>

            {/* Service Centers Overview Card */}
            <Col xs={24} sm={12} lg={6}>
              <div 
                className="bg-white rounded-xl shadow-md p-6 border border-blue-200 hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
                onClick={() => navigate('/service-centers')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                  <Building2 className="w-7 h-7 text-blue-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{t('homepage.departmentCards.serviceCenters.title')}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.serviceCenters.totalCenters')}</span>
                    <span className="text-xl font-bold text-blue-600">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.serviceCenters.activeCenters')}</span>
                    <span className="text-xl font-bold text-blue-600">142</span>
                  </div>
                </div>
                <div className="mt-3 w-12 h-0.5 bg-blue-600 rounded-full flex-shrink-0"></div>
              </div>
            </Col>

            {/* Organizers Overview Card */}
            <Col xs={24} sm={12} lg={6}>
              <div 
                className="bg-white rounded-xl shadow-md p-6 border border-purple-200 hover:shadow-lg hover:shadow-purple-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
                onClick={() => navigate('/organizers')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-lg bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                  <UsersRound className="w-7 h-7 text-purple-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{t('homepage.departmentCards.organizers.title')}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.organizers.totalOrganizers')}</span>
                    <span className="text-xl font-bold text-purple-600">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.organizers.activeCampaigns')}</span>
                    <span className="text-xl font-bold text-purple-600">48</span>
                  </div>
                </div>
                <div className="mt-3 w-12 h-0.5 bg-purple-600 rounded-full flex-shrink-0"></div>
              </div>
            </Col>

            {/* Reception Overview Card */}
            <Col xs={24} sm={12} lg={6}>
              <div 
                className="bg-white rounded-xl shadow-md p-6 border border-cyan-200 hover:shadow-lg hover:shadow-cyan-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
                onClick={() => navigate('/reception')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-100 to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-lg bg-cyan-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                  <Users className="w-7 h-7 text-cyan-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{t('homepage.departmentCards.reception.title')}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.reception.totalArrivals')}</span>
                    <span className="text-xl font-bold text-cyan-600">2,456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.reception.expectedToday')}</span>
                    <span className="text-xl font-bold text-cyan-600">1,234</span>
                  </div>
                </div>
                <div className="mt-3 w-12 h-0.5 bg-cyan-600 rounded-full flex-shrink-0"></div>
              </div>
            </Col>

            {/* Passport Overview Card */}
            <Col xs={24} sm={12} lg={6}>
              <div 
                className="bg-white rounded-xl shadow-md p-6 border border-teal-200 hover:shadow-lg hover:shadow-teal-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
                onClick={() => navigate('/passport')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-100 to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-lg bg-teal-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                  <CreditCard className="w-7 h-7 text-teal-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{t('homepage.departmentCards.passport.title')}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.passport.totalPilgrims')}</span>
                    <span className="text-xl font-bold text-teal-600">12,456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.passport.verifiedServices')}</span>
                    <span className="text-xl font-bold text-teal-600">11,234</span>
                  </div>
                </div>
                <div className="mt-3 w-12 h-0.5 bg-teal-600 rounded-full flex-shrink-0"></div>
              </div>
            </Col>

            {/* Housing Overview Card */}
            <Col xs={24} sm={12} lg={6}>
              <div 
                className="bg-white rounded-xl shadow-md p-6 border border-primary/20 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
                onClick={() => navigate('/housing')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                  <Home className="w-7 h-7 text-primary" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{t('homepage.departmentCards.housing.title')}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.housing.hotelOccupancy')}</span>
                    <span className="text-xl font-bold text-primary">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.housing.availableRooms')}</span>
                    <span className="text-xl font-bold text-primary">1,245</span>
                  </div>
                </div>
                <div className="mt-3 w-12 h-0.5 bg-primary rounded-full flex-shrink-0"></div>
              </div>
            </Col>

            {/* Mashair Overview Card */}
            <Col xs={24} sm={12} lg={6}>
              <div 
                className="bg-white rounded-xl shadow-md p-6 border border-amber-200 hover:shadow-lg hover:shadow-amber-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
                onClick={() => navigate('/organizers')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-100 to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-lg bg-amber-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                  <MapPin className="w-7 h-7 text-amber-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{t('homepage.departmentCards.mashair.title')}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.mashair.totalCampaigns')}</span>
                    <span className="text-xl font-bold text-amber-600">48</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.mashair.facilityReadiness')}</span>
                    <span className="text-xl font-bold text-amber-600">92%</span>
                  </div>
                </div>
                <div className="mt-3 w-12 h-0.5 bg-amber-600 rounded-full flex-shrink-0"></div>
              </div>
            </Col>

            {/* Transport Overview Card */}
            <Col xs={24} sm={12} lg={6}>
              <div 
                className="bg-white rounded-xl shadow-md p-6 border border-orange-200 hover:shadow-lg hover:shadow-orange-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
                onClick={() => navigate('/transport')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-lg bg-orange-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                  <Truck className="w-7 h-7 text-orange-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{t('homepage.departmentCards.transport.title')}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.transport.totalTrips')}</span>
                    <span className="text-xl font-bold text-orange-600">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.transport.todayTrips')}</span>
                    <span className="text-xl font-bold text-orange-600">89</span>
                  </div>
                </div>
                <div className="mt-3 w-12 h-0.5 bg-orange-600 rounded-full flex-shrink-0"></div>
              </div>
            </Col>

            {/* Public Affairs Overview Card */}
            <Col xs={24} sm={12} lg={6}>
              <div 
                className="bg-white rounded-xl shadow-md p-6 border border-indigo-200 hover:shadow-lg hover:shadow-indigo-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
                onClick={() => navigate('/public-affairs')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-100 to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                  <FileText className="w-7 h-7 text-indigo-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{t('homepage.departmentCards.publicAffairs.title')}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.publicAffairs.totalReports')}</span>
                    <span className="text-xl font-bold text-indigo-600">234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.publicAffairs.inProcess')}</span>
                    <span className="text-xl font-bold text-indigo-600">45</span>
                  </div>
                </div>
                <div className="mt-3 w-12 h-0.5 bg-indigo-600 rounded-full flex-shrink-0"></div>
              </div>
            </Col>

            {/* Reports & Analytics Overview Card */}
            <Col xs={24} sm={12} lg={6}>
              <div 
                className="bg-white rounded-xl shadow-md p-6 border border-rose-200 hover:shadow-lg hover:shadow-rose-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
                onClick={() => navigate('/hr/reports')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-100 to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-lg bg-rose-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                  <BarChart3 className="w-7 h-7 text-rose-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{t('homepage.departmentCards.reports.title')}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.reports.totalReports')}</span>
                    <span className="text-xl font-bold text-rose-600">456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.reports.monthlyReports')}</span>
                    <span className="text-xl font-bold text-rose-600">38</span>
                  </div>
                </div>
                <div className="mt-3 w-12 h-0.5 bg-rose-600 rounded-full flex-shrink-0"></div>
              </div>
            </Col>

            {/* Operations Overview Card */}
            <Col xs={24} sm={12} lg={6}>
              <div 
                className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
                onClick={() => navigate('/')}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-100 to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                  <Settings className="w-7 h-7 text-slate-600" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{t('homepage.departmentCards.operations.title')}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.operations.activeOperations')}</span>
                    <span className="text-xl font-bold text-slate-600">234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('homepage.departmentCards.operations.completionRate')}</span>
                    <span className="text-xl font-bold text-slate-600">94%</span>
                  </div>
                </div>
                <div className="mt-3 w-12 h-0.5 bg-slate-600 rounded-full flex-shrink-0"></div>
              </div>
            </Col>
          </Row>
        </div>


        {/* Main Content Grid - Approvals */}
        <Row gutter={[16, 16]} className="sm:!mx-0">
          <Col xs={24} sm={24} md={24} lg={12}>
            <PendingApprovalsCard
              approvals={approvals}
              title={t('homepage.pendingApprovals')}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <ActivityFeed
              activities={recentActivities}
              title={t('homepage.recentActivity')}
              maxItems={6}
            />
          </Col>
        </Row>

        {/* Dashboard Grid Sections */}
        <div className="mt-4 sm:mt-5 md:mt-6">
          <Title level={3} className="!mb-4 sm:!mb-5 md:!mb-6 !text-gray-800 !text-base sm:!text-lg md:!text-xl lg:!text-2xl font-semibold">
            {t('homepage.modules')}
          </Title>
          <DashboardGrid sections={dashboardSections} />
        </div>
      </div>

      {/* Leave Request Modal */}
      <Modal
        title={t('homepage.requestLeave')}
        open={leaveModalVisible}
        onCancel={() => {
          setLeaveModalVisible(false);
          leaveForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={leaveForm}
          layout="vertical"
          onFinish={handleLeaveSubmit}
        >
          <Form.Item
            name="leaveType"
            label={t('homepage.leaveType')}
            rules={[{ required: true, message: t('homepage.pleaseSelectLeaveType') }]}
          >
            <Select placeholder={t('homepage.selectLeaveType')}>
              <Select.Option value="annual">{t('homepage.annualLeave')}</Select.Option>
              <Select.Option value="sick">{t('homepage.sickLeave')}</Select.Option>
              <Select.Option value="emergency">{t('homepage.emergencyLeave')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label={t('homepage.startDate')}
            rules={[{ required: true, message: t('homepage.pleaseSelectStartDate') }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label={t('homepage.endDate')}
            rules={[{ required: true, message: t('homepage.pleaseSelectEndDate') }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="reason"
            label={t('homepage.reason') || 'Reason'}
            rules={[{ required: true, message: t('homepage.pleaseEnterReason') || 'Please enter reason' }]}
          >
            <Input.TextArea rows={4} placeholder={t('homepage.enterReason') || 'Enter reason for leave'} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('homepage.submit') || 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Expense Submission Modal */}
      <Modal
        title={t('homepage.submitExpense')}
        open={expenseModalVisible}
        onCancel={() => {
          setExpenseModalVisible(false);
          expenseForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={expenseForm}
          layout="vertical"
          onFinish={handleExpenseSubmit}
        >
          <Form.Item
            name="expenseType"
            label={t('homepage.expenseType') || 'Expense Type'}
            rules={[{ required: true, message: t('homepage.pleaseSelectExpenseType') || 'Please select expense type' }]}
          >
            <Select placeholder={t('homepage.selectExpenseType') || 'Select expense type'}>
              <Select.Option value="travel">{t('homepage.travel') || 'Travel'}</Select.Option>
              <Select.Option value="meals">{t('homepage.meals') || 'Meals'}</Select.Option>
              <Select.Option value="supplies">{t('homepage.supplies') || 'Office Supplies'}</Select.Option>
              <Select.Option value="other">{t('homepage.other') || 'Other'}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label={t('homepage.amount')}
            rules={[{ required: true, message: t('homepage.pleaseEnterAmount') || 'Please enter amount' }]}
          >
            <Input type="number" prefix="SAR" placeholder={t('homepage.enterAmount') || 'Enter amount'} />
          </Form.Item>
          <Form.Item
            name="date"
            label={t('homepage.date') || 'Date'}
            rules={[{ required: true, message: t('homepage.pleaseSelectDate') || 'Please select date' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="description"
            label={t('homepage.description') || 'Description'}
            rules={[{ required: true, message: t('homepage.pleaseEnterDescription') || 'Please enter description' }]}
          >
            <Input.TextArea rows={4} placeholder={t('homepage.enterDescription') || 'Enter expense description'} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('homepage.submit') || 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Documents Modal */}
      <Modal
        title={t('homepage.viewDocuments')}
        open={documentsModalVisible}
        onCancel={() => setDocumentsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDocumentsModalVisible(false)}>
            {t('homepage.close') || 'Close'}
          </Button>,
          <Button key="navigate" type="primary" onClick={() => {
            setDocumentsModalVisible(false);
            navigate('/hr');
          }}>
            {t('homepage.goToHR') || 'Go to HR Dashboard'}
          </Button>
        ]}
        width={700}
      >
        <div className="space-y-4">
          <Text className="text-gray-600">{t('homepage.documentsDescription') || 'Access your documents and files from the HR dashboard.'}</Text>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/hr')}>
              <FileTextOutlined className="text-3xl text-blue-500 mb-2" />
              <Text className="block">{t('homepage.employmentDocuments') || 'Employment Documents'}</Text>
            </Card>
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/hr')}>
              <FileTextOutlined className="text-3xl text-green-500 mb-2" />
              <Text className="block">{t('homepage.policies')}</Text>
            </Card>
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/hr')}>
              <FileTextOutlined className="text-3xl text-purple-500 mb-2" />
              <Text className="block">{t('homepage.forms')}</Text>
            </Card>
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/hr')}>
              <FileTextOutlined className="text-3xl text-orange-500 mb-2" />
              <Text className="block">{t('homepage.certificates') || 'Certificates'}</Text>
            </Card>
          </div>
        </div>
      </Modal>

      {/* Attendance Modal */}
      <Modal
        title={t('homepage.attendance')}
        open={attendanceModalVisible}
        onCancel={() => setAttendanceModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setAttendanceModalVisible(false)}>
            {t('homepage.close') || 'Close'}
          </Button>,
          <Button key="navigate" type="primary" onClick={() => {
            setAttendanceModalVisible(false);
            navigate('/hr');
          }}>
            {t('homepage.viewFullAttendance') || 'View Full Attendance'}
          </Button>
        ]}
        width={700}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card className="text-center">
              <Text className="text-2xl font-bold text-blue-600 block">98.5%</Text>
              <Text className="text-gray-600 text-sm">{t('homepage.todayAttendance')}</Text>
            </Card>
            <Card className="text-center">
              <Text className="text-2xl font-bold text-green-600 block">22</Text>
              <Text className="text-gray-600 text-sm">{t('homepage.daysPresent') || 'Days Present (This Month)'}</Text>
            </Card>
            <Card className="text-center">
              <Text className="text-2xl font-bold text-orange-600 block">1</Text>
              <Text className="text-gray-600 text-sm">{t('homepage.daysAbsent') || 'Days Absent (This Month)'}</Text>
            </Card>
          </div>
          <div className="mt-4">
            <Text className="text-gray-600">{t('homepage.attendanceDescription') || 'View detailed attendance records and history from the HR dashboard.'}</Text>
          </div>
        </div>
      </Modal>

      {/* Profile Modal */}
      <Modal
        title={t('homepage.myProfile')}
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setProfileModalVisible(false)}>
            {t('homepage.close') || 'Close'}
          </Button>,
          <Button key="edit" type="primary" onClick={() => {
            setProfileModalVisible(false);
            navigate('/hr');
          }}>
            {t('homepage.editProfile') || 'Edit Profile'}
          </Button>
        ]}
        width={600}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar size={64} icon={<UserOutlined />} className="bg-mainColor" />
            <div>
              <Title level={4} className="!mb-1">{currentUser.name}</Title>
              <Text className="text-gray-600">{currentUser.role} • {currentUser.department}</Text>
            </div>
          </div>
          <Divider />
          <div className="space-y-3">
            <div>
              <Text className="text-gray-500 text-sm">{t('homepage.email') || 'Email'}</Text>
              <Text className="block">{t('homepage.dummyEmail') || 'user@example.com'}</Text>
            </div>
            <div>
              <Text className="text-gray-500 text-sm">{t('homepage.phone')}</Text>
              <Text className="block">{t('homepage.dummyPhone') || '+966 50 123 4567'}</Text>
            </div>
            <div>
              <Text className="text-gray-500 text-sm">{t('homepage.employeeId') || 'Employee ID'}</Text>
              <Text className="block">EMP-001234</Text>
            </div>
            <div>
              <Text className="text-gray-500 text-sm">{t('homepage.joinDate') || 'Join Date'}</Text>
              <Text className="block">January 2023</Text>
            </div>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <SettingOutlined className="text-mainColor text-xl" />
            <span>{t('homepage.settings')}</span>
          </div>
        }
        open={settingsModalVisible}
        onCancel={() => {
          setSettingsModalVisible(false);
          settingsForm.resetFields();
        }}
        footer={[
          <Button key="close" onClick={() => {
            setSettingsModalVisible(false);
            settingsForm.resetFields();
          }}>
            {t('homepage.close') || 'Close'}
          </Button>,
          <Button key="save" type="primary" onClick={handleSettingsSave} className="bg-mainColor hover:bg-primaryColor">
            {t('homepage.save') || 'Save Changes'}
          </Button>
        ]}
        width={800}
        className="settings-modal"
      >
        <Form form={settingsForm} layout="vertical">
          <Tabs
            defaultActiveKey="general"
            items={[
              {
                key: 'general',
                label: (
                  <span className="flex items-center gap-2">
                    <SettingOutlined />
                    {t('homepage.general')}
                  </span>
                ),
                children: (
                  <div className="space-y-6 mt-4">
                    {/* Language Setting */}
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <GlobalOutlined className="text-blue-600 text-xl" />
                          </div>
                          <div className="flex-1">
                            <Title level={5} className="!mb-1 !text-gray-800">
                              {t('homepage.language')}
                            </Title>
                            <Text className="text-gray-500 text-sm">
                              {t('homepage.languageDescription')}
                            </Text>
                          </div>
                        </div>
                        <Form.Item name="language" className="!mb-0" style={{ width: 150 }}>
                          <Select size="large">
                            <Select.Option value="en">{t('homepage.languageNames.en')}</Select.Option>
                            <Select.Option value="ar">{t('homepage.languageNames.ar')}</Select.Option>
                            <Select.Option value="ur">{t('homepage.languageNames.ur')}</Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </Card>

                    {/* Auto Save Setting */}
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-green-50 rounded-lg">
                            <CloudOutlined className="text-green-600 text-xl" />
                          </div>
                          <div className="flex-1">
                            <Title level={5} className="!mb-1 !text-gray-800">
                              {t('homepage.autoSave') || 'Auto Save'}
                            </Title>
                            <Text className="text-gray-500 text-sm">
                              {t('homepage.autoSaveDescription') || 'Automatically save your work as you type'}
                            </Text>
                          </div>
                        </div>
                        <Form.Item name="autoSave" valuePropName="checked" className="!mb-0">
                          <Switch checkedChildren={t('homepage.enabled') || 'ON'} unCheckedChildren={t('homepage.disabled') || 'OFF'} />
                        </Form.Item>
                      </div>
                    </Card>

                    {/* Dark Mode Setting */}
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-purple-50 rounded-lg">
                            <EyeOutlined className="text-purple-600 text-xl" />
                          </div>
                          <div className="flex-1">
                            <Title level={5} className="!mb-1 !text-gray-800">
                              {t('homepage.darkMode') || 'Dark Mode'}
                            </Title>
                            <Text className="text-gray-500 text-sm">
                              {t('homepage.darkModeDescription') || 'Switch to dark theme for better viewing in low light'}
                            </Text>
                          </div>
                        </div>
                        <Form.Item name="darkMode" valuePropName="checked" className="!mb-0">
                          <Switch checkedChildren={t('homepage.enabled') || 'ON'} unCheckedChildren={t('homepage.disabled') || 'OFF'} />
                        </Form.Item>
                      </div>
                    </Card>
                  </div>
                ),
              },
              {
                key: 'notifications',
                label: (
                  <span className="flex items-center gap-2">
                    <BellOutlined />
                    {t('homepage.notifications') || 'Notifications'}
                  </span>
                ),
                children: (
                  <div className="space-y-6 mt-4">
                    {/* Email Notifications */}
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <MailOutlined className="text-blue-600 text-xl" />
                          </div>
                          <div className="flex-1">
                            <Title level={5} className="!mb-1 !text-gray-800">
                              {t('homepage.emailNotifications') || 'Email Notifications'}
                            </Title>
                            <Text className="text-gray-500 text-sm">
                              {t('homepage.emailNotificationsDescription') || 'Receive notifications via email'}
                            </Text>
                          </div>
                        </div>
                        <Form.Item name="emailNotifications" valuePropName="checked" className="!mb-0">
                          <Switch checkedChildren={t('homepage.enabled') || 'ON'} unCheckedChildren={t('homepage.disabled') || 'OFF'} />
                        </Form.Item>
                      </div>
                    </Card>

                    {/* SMS Notifications */}
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-green-50 rounded-lg">
                            <MobileOutlined className="text-green-600 text-xl" />
                          </div>
                          <div className="flex-1">
                            <Title level={5} className="!mb-1 !text-gray-800">
                              {t('homepage.smsNotifications') || 'SMS Notifications'}
                            </Title>
                            <Text className="text-gray-500 text-sm">
                              {t('homepage.smsNotificationsDescription') || 'Receive notifications via SMS'}
                            </Text>
                          </div>
                        </div>
                        <Form.Item name="smsNotifications" valuePropName="checked" className="!mb-0">
                          <Switch checkedChildren={t('homepage.enabled') || 'ON'} unCheckedChildren={t('homepage.disabled') || 'OFF'} />
                        </Form.Item>
                      </div>
                    </Card>

                    {/* Push Notifications */}
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <NotificationOutlined className="text-orange-600 text-xl" />
                          </div>
                          <div className="flex-1">
                            <Title level={5} className="!mb-1 !text-gray-800">
                              {t('homepage.pushNotifications') || 'Push Notifications'}
                            </Title>
                            <Text className="text-gray-500 text-sm">
                              {t('homepage.pushNotificationsDescription') || 'Receive push notifications in your browser'}
                            </Text>
                          </div>
                        </div>
                        <Form.Item name="pushNotifications" valuePropName="checked" className="!mb-0">
                          <Switch checkedChildren={t('homepage.enabled') || 'ON'} unCheckedChildren={t('homepage.disabled') || 'OFF'} />
                        </Form.Item>
                      </div>
                    </Card>

                    {/* Sound Notifications */}
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-purple-50 rounded-lg">
                            <SoundOutlined className="text-purple-600 text-xl" />
                          </div>
                          <div className="flex-1">
                            <Title level={5} className="!mb-1 !text-gray-800">
                              {t('homepage.soundNotifications') || 'Sound Notifications'}
                            </Title>
                            <Text className="text-gray-500 text-sm">
                              {t('homepage.soundNotificationsDescription') || 'Play sound when receiving notifications'}
                            </Text>
                          </div>
                        </div>
                        <Form.Item name="soundEnabled" valuePropName="checked" className="!mb-0">
                          <Switch checkedChildren={t('homepage.enabled') || 'ON'} unCheckedChildren={t('homepage.disabled') || 'OFF'} />
                        </Form.Item>
                      </div>
                    </Card>
                  </div>
                ),
              },
              {
                key: 'security',
                label: (
                  <span className="flex items-center gap-2">
                    <LockOutlined />
                    {t('homepage.security') || 'Security'}
                  </span>
                ),
                children: (
                  <div className="space-y-6 mt-4">
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-50 rounded-lg">
                          <SecurityScanOutlined className="text-red-600 text-xl" />
                        </div>
                        <div className="flex-1">
                          <Title level={5} className="!mb-1 !text-gray-800">
                            {t('homepage.twoFactorAuth') || 'Two-Factor Authentication'}
                          </Title>
                          <Text className="text-gray-500 text-sm block mb-4">
                            {t('homepage.twoFactorAuthDescription') || 'Add an extra layer of security to your account'}
                          </Text>
                          <Button type="default" className="border-mainColor text-mainColor hover:bg-mainColor hover:text-white">
                            {t('homepage.enable2FA') || 'Enable 2FA'}
                          </Button>
                        </div>
                      </div>
                    </Card>

                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <LockOutlined className="text-orange-600 text-xl" />
                        </div>
                        <div className="flex-1">
                          <Title level={5} className="!mb-1 !text-gray-800">
                            {t('homepage.changePassword') || 'Change Password'}
                          </Title>
                          <Text className="text-gray-500 text-sm block mb-4">
                            {t('homepage.changePasswordDescription') || 'Update your password regularly to keep your account secure'}
                          </Text>
                          <Button type="default" className="border-mainColor text-mainColor hover:bg-mainColor hover:text-white">
                            {t('homepage.changePassword') || 'Change Password'}
                          </Button>
                        </div>
                      </div>
                    </Card>

                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <DesktopOutlined className="text-blue-600 text-xl" />
                        </div>
                        <div className="flex-1">
                          <Title level={5} className="!mb-1 !text-gray-800">
                            {t('homepage.activeSessions') || 'Active Sessions'}
                          </Title>
                          <Text className="text-gray-500 text-sm block mb-4">
                            {t('homepage.activeSessionsDescription') || 'View and manage devices where you are currently logged in'}
                          </Text>
                          <Button type="default" className="border-mainColor text-mainColor hover:bg-mainColor hover:text-white">
                            {t('homepage.viewSessions') || 'View Sessions'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                ),
              },
            ]}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default HomePage;
