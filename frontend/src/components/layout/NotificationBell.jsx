import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, Clock, ShoppingBag, Star, Info } from 'lucide-react';
import { getMyNotifications, markNotificationAsRead } from '../../services/notificationApi';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getMyNotifications();
      // Ensure array
      const list = Array.isArray(data) ? data : [];
      setNotifications(list);
    } catch (err) {
      console.warn("Could not fetch notifications:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 20 seconds for new notifications
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = async (id, e) => {
    e?.stopPropagation();
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.warn("Failed to mark as read:", err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const n of unread) {
      try {
        await markNotificationAsRead(n.id);
      } catch {
        // ignore individual errors
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'ORDER':
        return <ShoppingBag size={16} className="text-blue-600" />;
      case 'REVIEW':
        return <Star size={16} className="text-amber-500" />;
      default:
        return <Info size={16} className="text-gray-500" />;
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / (1000 * 60));
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 text-gray-500 hover:text-[#0058be] hover:bg-blue-50 rounded-full transition"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-500 rounded-full px-1 shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center text-gray-400 px-4">
                <Bell size={28} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm font-medium text-gray-600">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  You'll be notified when orders or reviews are created.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-gray-50 transition cursor-pointer ${
                    !item.isRead ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="mt-0.5 p-2 bg-gray-100 rounded-lg flex-shrink-0">
                    {getNotificationIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-semibold truncate ${!item.isRead ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap flex items-center gap-0.5">
                        <Clock size={10} /> {formatTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 break-words line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                  {!item.isRead && (
                    <button
                      onClick={(e) => handleMarkAsRead(item.id, e)}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-md transition flex-shrink-0"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
