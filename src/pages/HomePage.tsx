import React, { useState } from 'react';
import { Row, Col, Typography, Space, Divider, Card, Avatar } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  OrderedListOutlined,
  PictureOutlined,
  FormOutlined,
  BellOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ProjectOutlined,
  BarChartOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import OverviewCard from '../components/ui/HomePageComponent/OverviewCard';
import StatsWidget from '../components/ui/HomePageComponent/StatsWidget';
import DashboardGrid from '../components/ui/HomePageComponent/DashboardGrid';
import ContentCarousel from '../components/ui/HomePageComponent/ContentCarousel';
import ActivityFeed from '../components/ui/HomePageComponent/ActivityFeed';
import QuickActions from '../components/ui/HomePageComponent/QuickActions';
import AnnouncementsCard from '../components/ui/HomePageComponent/AnnouncementsCard';
import MyTasksCard from '../components/ui/HomePageComponent/MyTasksCard';
import PendingApprovalsCard from '../components/ui/HomePageComponent/PendingApprovalsCard';
import type { SectionSummaryProps } from '../components/ui/HomePageComponent/SectionSummary';
import type { CarouselItem } from '../components/ui/HomePageComponent/ContentCarousel';
import type { ActivityItem } from '../components/ui/HomePageComponent/ActivityFeed';
import type { Announcement } from '../components/ui/HomePageComponent/AnnouncementsCard';
import type { Task } from '../components/ui/HomePageComponent/MyTasksCard';
import type { Approval } from '../components/ui/HomePageComponent/PendingApprovalsCard';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const { t } = useTranslation('common');
  const [mounted] = useState(true);
  
  // Mock user data - in real app, this would come from auth context
  const currentUser = {
    name: 'Ahmed Al-Saud',
    role: 'Admin',
    department: 'Operations',
    avatar: undefined,
  };

  // State for approvals
  const [approvals, setApprovals] = useState<Approval[]>([
    {
      id: '1',
      type: 'leave',
      title: 'Annual Leave Request',
      requester: 'Sarah Al-Mansouri',
      date: '2 hours ago',
      days: 5,
      priority: 'high',
    },
    {
      id: '2',
      type: 'expense',
      title: 'Business Trip Expenses',
      requester: 'Mohammed Al-Rashid',
      date: '5 hours ago',
      amount: 'SAR 3,450',
      priority: 'medium',
    },
    {
      id: '3',
      type: 'leave',
      title: 'Sick Leave Request',
      requester: 'Fatima Al-Zahra',
      date: '1 day ago',
      days: 2,
      priority: 'high',
    },
    {
      id: '4',
      type: 'request',
      title: 'Equipment Request',
      requester: 'Khalid Al-Otaibi',
      date: '2 days ago',
      priority: 'low',
    },
    {
      id: '5',
      type: 'expense',
      title: 'Office Supplies',
      requester: 'Noura Al-Shehri',
      date: '2 days ago',
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
      title: 'Review Q4 Financial Report',
      description: 'Complete review and provide feedback',
      priority: 'high',
      status: 'in-progress',
      dueDate: 'Today',
      progress: 65,
    },
    {
      id: '2',
      title: 'Approve Leave Requests',
      description: '5 pending leave requests need approval',
      priority: 'high',
      status: 'pending',
      dueDate: 'Tomorrow',
    },
    {
      id: '3',
      title: 'Update Employee Handbook',
      description: 'Add new policies section',
      priority: 'medium',
      status: 'in-progress',
      dueDate: 'Dec 25',
      progress: 40,
    },
    {
      id: '4',
      title: 'Team Meeting Preparation',
      description: 'Prepare agenda and materials',
      priority: 'medium',
      status: 'pending',
      dueDate: 'Dec 24',
    },
    {
      id: '5',
      title: 'Complete Training Module',
      description: 'Finish compliance training',
      priority: 'low',
      status: 'completed',
      dueDate: 'Dec 20',
    },
    {
      id: '6',
      title: 'Submit Expense Report',
      description: 'Monthly expense report submission',
      priority: 'medium',
      status: 'pending',
      dueDate: 'Dec 28',
    },
  ];


  // Company Announcements
  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Holiday Schedule - New Year',
      message: 'Office will be closed from Dec 31 to Jan 2 for New Year holidays. Please plan your work accordingly.',
      type: 'info',
      author: 'HR Department',
      date: '2 hours ago',
      isNew: true,
    },
    {
      id: '2',
      title: 'New Health Insurance Benefits',
      message: 'Updated health insurance coverage now includes dental and vision. Check your benefits portal for details.',
      type: 'success',
      author: 'Benefits Team',
      date: '1 day ago',
      isNew: true,
    },
    {
      id: '3',
      title: 'System Maintenance Tonight',
      message: 'Scheduled maintenance from 11 PM to 2 AM. Portal will be temporarily unavailable.',
      type: 'warning',
      author: 'IT Department',
      date: '2 days ago',
    },
    {
      id: '4',
      title: 'Annual Performance Reviews',
      message: 'Performance review period starts next week. Managers will receive review forms via email.',
      type: 'info',
      author: 'HR Department',
      date: '3 days ago',
    },
    {
      id: '5',
      title: 'Urgent: Security Policy Update',
      message: 'All employees must complete the new security training by end of week. Mandatory compliance required.',
      type: 'urgent',
      author: 'Security Team',
      date: '4 days ago',
    },
  ];

  // Recent activities
  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'approval',
      title: 'Leave request approved',
      description: 'Your leave request for Dec 25-27 has been approved',
      time: '30 minutes ago',
      user: 'Manager',
    },
    {
      id: '2',
      type: 'document',
      title: 'New document shared',
      description: 'Q4 Report shared with your team',
      time: '2 hours ago',
      user: 'Finance Team',
    },
    {
      id: '3',
      type: 'notification',
      title: 'Meeting reminder',
      description: 'Team meeting in 1 hour - Conference Room A',
      time: '3 hours ago',
      user: 'Calendar',
    },
    {
      id: '4',
      type: 'approval',
      title: 'Expense report submitted',
      description: 'Your expense report is pending approval',
      time: '5 hours ago',
      user: 'You',
    },
    {
      id: '5',
      type: 'user',
      title: 'New team member',
      description: 'Ahmed joined your department',
      time: '1 day ago',
      user: 'HR',
    },
    {
      id: '6',
      type: 'document',
      title: 'Policy updated',
      description: 'Employee handbook has been updated',
      time: '2 days ago',
      user: 'HR Department',
    },
  ];

  // Quick Actions for Employees
  const quickActions = [
    {
      id: '1',
      label: t('homepage.requestLeave'),
      icon: <CalendarOutlined />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      action: () => console.log('Request Leave'),
    },
    {
      id: '2',
      label: t('homepage.submitExpense'),
      icon: <DollarOutlined />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      action: () => console.log('Submit Expense'),
    },
    {
      id: '3',
      label: t('homepage.viewDocuments'),
      icon: <FileTextOutlined />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      action: () => console.log('View Documents'),
    },
    {
      id: '4',
      label: t('homepage.attendance'),
      icon: <ClockCircleOutlined />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      action: () => console.log('View Attendance'),
    },
    {
      id: '5',
      label: t('homepage.myProfile'),
      icon: <UserOutlined />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      action: () => console.log('My Profile'),
    },
    {
      id: '6',
      label: t('homepage.settings'),
      icon: <SettingOutlined />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
      action: () => console.log('Settings'),
    },
  ];

  // Featured items for carousel
  const featuredItems: CarouselItem[] = [
    {
      id: '1',
      title: t('homepage.newPolicyUpdate'),
      subtitle: 'Data Privacy Guidelines',
      description: t('homepage.policyUpdateDesc'),
      icon: <SafetyOutlined />,
      tag: { text: 'New', color: 'success' },
      action: () => console.log('View policy'),
    },
    {
      id: '2',
      title: t('homepage.trainingWorkshop'),
      subtitle: 'Leadership Development',
      description: t('homepage.trainingDesc'),
      icon: <ProjectOutlined />,
      tag: { text: 'Upcoming', color: 'info' },
      action: () => console.log('View training'),
    },
    {
      id: '3',
      title: t('homepage.systemUpdate'),
      subtitle: 'Version 2.5 Released',
      description: t('homepage.systemUpdateDesc'),
      icon: <BellOutlined />,
      tag: { text: 'Update', color: 'warning' },
      action: () => console.log('View update'),
    },
    {
      id: '4',
      title: t('homepage.annualReport'),
      subtitle: '2024 Summary',
      description: t('homepage.reportDesc'),
      icon: <FileTextOutlined />,
      tag: { text: 'Report', color: 'info' },
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
          title: 'Employee Code of Conduct Policy',
          subtitle: 'Updated by Admin',
          date: '2 days ago',
          tag: { text: 'Active', color: 'success' },
        },
        {
          id: '2',
          title: 'Data Privacy and Security Policy',
          subtitle: 'Updated by HR Manager',
          date: '5 days ago',
          tag: { text: 'Active', color: 'success' },
        },
        {
          id: '3',
          title: 'Remote Work Policy',
          subtitle: 'Updated by Admin',
          date: '1 week ago',
          tag: { text: 'Draft', color: 'warning' },
        },
        {
          id: '4',
          title: 'Health and Safety Guidelines',
          subtitle: 'Updated by Safety Officer',
          date: '2 weeks ago',
          tag: { text: 'Active', color: 'success' },
        },
        {
          id: '5',
          title: 'IT Usage Policy',
          subtitle: 'Updated by IT Manager',
          date: '3 weeks ago',
          tag: { text: 'Active', color: 'success' },
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
          title: 'New Employee Onboarding Procedure',
          subtitle: 'HR Department',
          date: '1 day ago',
          tag: { text: 'Updated', color: 'info' },
        },
        {
          id: '2',
          title: 'Expense Reimbursement Process',
          subtitle: 'Finance Department',
          date: '3 days ago',
          tag: { text: 'Updated', color: 'info' },
        },
        {
          id: '3',
          title: 'Leave Request Procedure',
          subtitle: 'HR Department',
          date: '1 week ago',
          tag: { text: 'Active', color: 'success' },
        },
        {
          id: '4',
          title: 'Equipment Request Process',
          subtitle: 'IT Department',
          date: '2 weeks ago',
          tag: { text: 'Active', color: 'success' },
        },
        {
          id: '5',
          title: 'Incident Reporting Procedure',
          subtitle: 'Safety Department',
          date: '3 weeks ago',
          tag: { text: 'Active', color: 'success' },
        },
      ],
      emptyMessage: t('homepage.noProcedures'),
      onViewAll: () => console.log('View all procedures'),
    },
    {
      title: t('homepage.photoGallery'),
      icon: <PictureOutlined />,
      items: [
        {
          id: '1',
          title: 'Annual Company Event 2024',
          subtitle: '125 photos',
          date: '3 days ago',
          tag: { text: 'New', color: 'success' },
        },
        {
          id: '2',
          title: 'Team Building Activity',
          subtitle: '89 photos',
          date: '1 week ago',
          tag: { text: 'Recent', color: 'info' },
        },
        {
          id: '3',
          title: 'Office Renovation Progress',
          subtitle: '45 photos',
          date: '2 weeks ago',
          tag: { text: 'Ongoing', color: 'warning' },
        },
        {
          id: '4',
          title: 'Training Workshop',
          subtitle: '67 photos',
          date: '3 weeks ago',
          tag: { text: 'Completed', color: 'success' },
        },
        {
          id: '5',
          title: 'Product Launch Event',
          subtitle: '203 photos',
          date: '1 month ago',
          tag: { text: 'Archived', color: 'default' },
        },
      ],
      emptyMessage: t('homepage.noGalleryItems'),
      onViewAll: () => console.log('View all gallery items'),
    },
    {
      title: t('homepage.forms'),
      icon: <FormOutlined />,
      items: [
        {
          id: '1',
          title: 'Leave Request Form',
          subtitle: '45 pending submissions',
          date: 'Updated today',
          tag: { text: 'Active', color: 'success' },
        },
        {
          id: '2',
          title: 'Expense Report Form',
          subtitle: '23 pending submissions',
          date: 'Updated 2 days ago',
          tag: { text: 'Active', color: 'success' },
        },
        {
          id: '3',
          title: 'Equipment Request Form',
          subtitle: '12 pending submissions',
          date: 'Updated 3 days ago',
          tag: { text: 'Active', color: 'success' },
        },
        {
          id: '4',
          title: 'Training Request Form',
          subtitle: '8 pending submissions',
          date: 'Updated 1 week ago',
          tag: { text: 'Active', color: 'success' },
        },
        {
          id: '5',
          title: 'Feedback Form',
          subtitle: '156 responses',
          date: 'Updated 2 weeks ago',
          tag: { text: 'Active', color: 'success' },
        },
      ],
      emptyMessage: t('homepage.noForms'),
      onViewAll: () => console.log('View all forms'),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Welcome Header Section */}
        <div className={`mb-8 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <Card className="border-0 shadow-lg bg-gradient-to-r from-mainColor to-primaryColor">
            <Row align="middle" gutter={[24, 24]}>
              <Col xs={24} md={16}>
                <Space direction="vertical" size="small" className="w-full">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size={64}
                      icon={<UserOutlined />}
                      className="bg-white text-mainColor border-4 border-white shadow-lg"
                    />
                    <div>
                      <Title level={2} className="!mb-1 !text-white !text-2xl md:!text-3xl font-bold">
                        {getGreeting()}, {currentUser.name}
                      </Title>
                      <Text className="text-white/90 text-base">
                        {currentUser.role} • {currentUser.department}
                      </Text>
                    </div>
                  </div>
                  <Text className="text-white/80 text-sm md:text-base block mt-2">
                    {t('homepage.welcomeSubtitle')}
                  </Text>
                </Space>
              </Col>
              <Col xs={24} md={8}>
                <StatsWidget stats={quickStats} />
              </Col>
            </Row>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className={`mb-8 ${mounted ? 'animate-fade-in-up animate-delay-100' : 'opacity-0'}`}>
          <QuickActions title={t('homepage.quickActions')} actions={quickActions} />
        </div>

        {/* Overview Cards Grid */}
        <div className={`mb-8 ${mounted ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
          <div className="flex items-center justify-between mb-6">
            <Title level={3} className="!mb-0 !text-gray-800">
              {t('homepage.overview')}
            </Title>
          </div>
          <Row gutter={[16, 16]}>
            {overviewCards.map((card, index) => {
              const delayClass = index === 0 ? 'animate-delay-100' : 
                                index === 1 ? 'animate-delay-200' :
                                index === 2 ? 'animate-delay-300' :
                                index === 3 ? 'animate-delay-400' :
                                index === 4 ? 'animate-delay-500' : 'animate-delay-100';
              return (
                <Col xs={24} sm={12} lg={8} xl={8} key={index}>
                  <div
                    className={mounted ? `animate-fade-in-up ${delayClass}` : 'opacity-0'}
                  >
                    <OverviewCard {...card} />
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>

        <Divider className="my-8" />

        {/* Main Content Grid - Tasks, Approvals, Announcements */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} lg={12}>
            <div className={mounted ? 'animate-slide-in-left' : 'opacity-0'}>
              <MyTasksCard tasks={myTasks} title={t('homepage.myTasks')} />
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className={mounted ? 'animate-slide-in-right' : 'opacity-0'}>
              <PendingApprovalsCard
                approvals={approvals}
                title={t('homepage.pendingApprovals')}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          </Col>
        </Row>

        {/* Announcements and Activity Feed */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} lg={16}>
            <div className={mounted ? 'animate-slide-in-left' : 'opacity-0'}>
              <AnnouncementsCard
                announcements={announcements}
                title={t('homepage.announcements')}
              />
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <div className={mounted ? 'animate-slide-in-right' : 'opacity-0'}>
              <ActivityFeed
                activities={recentActivities}
                title={t('homepage.recentActivity')}
                maxItems={6}
              />
            </div>
          </Col>
        </Row>

        <Divider className="my-8" />

        {/* Featured Items Carousel */}
        <div className={`mb-8 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <ContentCarousel
            title={t('homepage.featuredItems')}
            items={featuredItems}
            itemsPerSlide={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          />
        </div>

        <Divider className="my-8" />

        {/* Dashboard Grid Sections */}
        <div className={`mb-8 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <Title level={3} className="!mb-6 !text-gray-800">
            {t('homepage.modules')}
          </Title>
          <DashboardGrid sections={dashboardSections} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
