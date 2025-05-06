import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useUser } from '../contexts/UserContext';
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useUser();
  const [timeOfDay, setTimeOfDay] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  // Mock attendance data
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  
  useEffect(() => {
    // Update greeting based on time of day
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour < 12) setTimeOfDay('morning');
      else if (hour < 18) setTimeOfDay('afternoon');
      else setTimeOfDay('evening');
    };
    
    // Update current time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    };
    
    // Initialize
    updateTimeOfDay();
    updateTime();
    
    // Update every minute
    const timeInterval = setInterval(updateTime, 60000);
    
    // Generate mock attendance data for calendar
    const generateMockAttendanceData = () => {
      const events = [];
      const currentDate = new Date();
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();
      
      // Generate events for the current month
      for (let day = 1; day <= 28; day++) {
        const date = new Date(year, month, day);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        // Random attendance status
        const rand = Math.random();
        let status, color;
        
        if (rand < 0.8) {
          status = 'present';
          color = '#10b981'; // green
        } else if (rand < 0.9) {
          status = 'late';
          color = '#f59e0b'; // amber
        } else {
          status = 'absent';
          color = '#ef4444'; // red
        }
        
        events.push({
          title: status.charAt(0).toUpperCase() + status.slice(1),
          start: date,
          backgroundColor: color,
          borderColor: color,
          status: status
        });
      }
      
      setAttendanceData(events);
    };
    
    generateMockAttendanceData();
    
    return () => clearInterval(timeInterval);
  }, []);
  
  // Prepare data for attendance summary chart (doughnut)
  const attendanceSummaryData = {
    labels: ['Present', 'Late', 'Absent'],
    datasets: [
      {
        data: [
          attendanceData.filter(event => event.status === 'present').length,
          attendanceData.filter(event => event.status === 'late').length,
          attendanceData.filter(event => event.status === 'absent').length
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };
  
  // Prepare data for monthly trend chart (bar)
  const monthlyTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Present',
        data: [5, 4, 5, 4],
        backgroundColor: '#10b981',
      },
      {
        label: 'Late',
        data: [0, 1, 0, 1],
        backgroundColor: '#f59e0b',
      },
      {
        label: 'Absent',
        data: [0, 0, 0, 0],
        backgroundColor: '#ef4444',
      },
    ],
  };
  
  // Admin-specific charts
  const departmentAttendanceData = {
    labels: ['IT Dept', 'HR Dept', 'Finance', 'Operations', 'Marketing'],
    datasets: [
      {
        label: 'Present (%)',
        data: [95, 88, 92, 85, 90],
        backgroundColor: '#3b82f6',
      }
    ],
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Good {timeOfDay}, {user?.firstName}!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Clock size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Current Time</h3>
            <p className="text-lg font-semibold">{currentTime}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Calendar size={24} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Today's Date</h3>
            <p className="text-lg font-semibold">{currentDate}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Status Today</h3>
            <p className="text-lg font-semibold">Present</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Attendance Calendar</h2>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth'
            }}
            events={attendanceData}
            height="auto"
          />
        </div>
        
        <div>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-4">Attendance Summary</h2>
            <div className="h-64">
              <Doughnut 
                data={attendanceSummaryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Monthly Trend</h2>
            <div className="h-64">
              <Bar 
                data={monthlyTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      max: 5
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {isAdmin() && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Department Attendance Overview</h2>
          <div className="h-64">
            <Bar 
              data={departmentAttendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
      )}
      
      {isAdmin() && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Attendance Issues</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">John Smith</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Marketing</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">2025-03-15</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Late Arrival (45 min)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Sarah Johnson</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">HR</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">2025-03-12</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Absence</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Approved
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Michael Chen</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">IT</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">2025-03-10</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Early Departure (2 hrs)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Denied
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;