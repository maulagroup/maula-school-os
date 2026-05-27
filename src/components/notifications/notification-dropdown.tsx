'use client';

import { useState } from 'react';
import NotificationItem, { type Notification } from './notification-item';
import EmptyState from '@/components/ui/empty-state';

export interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClose?: () => void;
}

export default function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: NotificationDropdownProps) {
  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-secondary-200 z-50">
      <div className="flex items-center justify-between p-4 border-b border-secondary-200">
        <h3 className="font-semibold text-secondary-900">Notifikasi</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Tandai semua dibaca
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-secondary-400 hover:text-secondary-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        ) : (
          <EmptyState
            title="Tidak ada notifikasi"
            description="Anda belum memiliki notifikasi apapun"
          />
        )}
      </div>
      
      <div className="p-4 border-t border-secondary-200">
        <a
          href="/portal/notifications"
          className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Lihat semua notifikasi
        </a>
      </div>
    </div>
  );
}
